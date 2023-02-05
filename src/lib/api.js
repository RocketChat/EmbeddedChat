import { Rocketchat } from '@rocket.chat/sdk';
import Cookies from 'js-cookie';
import { RC_USER_ID_COOKIE, RC_USER_TOKEN_COOKIE } from './constant';

export default class RocketChatInstance {
  constructor(host, rid) {
    this.host = host;
    this.rid = rid;
    this.rcClient = new Rocketchat({
      protocol: 'ddp',
      host: this.host,
      useSsl: !/http:\/\//.test(host),
    });
  }

  getCookies() {
    return {
      rc_token: Cookies.get(RC_USER_TOKEN_COOKIE),
      rc_uid: Cookies.get(RC_USER_ID_COOKIE),
    };
  }

  getHost() {
    return this.host;
  }

  setCookies(cookies) {
    Cookies.set(RC_USER_TOKEN_COOKIE, cookies.rc_token || '');
    Cookies.set(RC_USER_ID_COOKIE, cookies.rc_uid || '');
  }

  async googleSSOLogin(signIn, acsCode) {
    const tokens = await signIn();
    let acsPayload = null;

    if (typeof acsCode === 'string') {
      acsPayload = acsCode;
    }

    const payload = acsCode
      ? JSON.stringify({
          serviceName: 'google',
          accessToken: tokens.access_token,
          idToken: tokens.id_token,
          expiresIn: 3600,
          totp: {
            code: acsPayload,
          },
        })
      : JSON.stringify({
          serviceName: 'google',
          accessToken: tokens.access_token,
          idToken: tokens.id_token,
          expiresIn: 3600,
          scope: 'profile',
        });

    try {
      const req = await fetch(`${this.host}/api/v1/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: payload,
      });
      const response = await req.json();

      if (response.status === 'success') {
        this.setCookies({
          rc_token: response.data.authToken,
          rc_uid: response.data.userId,
        });
        if (!response.data.me.username) {
          await this.updateUserUsername(
            response.data.userId,
            response.data.me.name
          );
        }
        return { status: response.status, me: response.data.me };
      }

      if (response.error === 'totp-required') {
        return response;
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  async login(userOrEmail, password, code) {
    let reqBody;
    if (!code) {
      reqBody = `{ "user": "${userOrEmail}", "password": "${password}"}`;
    } else {
      reqBody = `{"user": "${userOrEmail}","password": "${password}","code": "${code}"}`;
    }
    try {
      const req = await fetch(`${this.host}/api/v1/login`, {
        body: reqBody,
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
      const response = await req.json();
      if (response.status === 'success') {
        this.setCookies({
          rc_token: response.data.authToken,
          rc_uid: response.data.userId,
        });
        if (!response.data.me.username) {
          await this.updateUserUsername(
            response.data.userId,
            response.data.me.name
          );
        }
        return { status: response.status, me: response.data.me };
      }
      if (response.status === 'error') {
        return response;
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  async logout() {
    try {
      const response = await fetch(`${this.host}/api/v1/logout`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': Cookies.get(RC_USER_TOKEN_COOKIE),
          'X-User-Id': Cookies.get(RC_USER_ID_COOKIE),
        },
        method: 'POST',
      });
      this.setCookies({});
      return await response.json();
    } catch (err) {
      console.error(err.message);
    }
  }

  async updateUserNameThroughSuggestion(userid) {
    try {
      const response = await fetch(
        `${this.host}/api/v1/users.getUsernameSuggestion`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': Cookies.get(RC_USER_TOKEN_COOKIE),
            'X-User-Id': Cookies.get(RC_USER_ID_COOKIE),
          },
          method: 'GET',
        }
      );

      const suggestedUsername = await response.json();

      if (suggestedUsername.success) {
        const response2 = await fetch(`${this.host}/api/v1/users.update`, {
          body: `{"userId": "${userid}", "data": { "username": "${suggestedUsername.result}" }}`,
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': Cookies.get(RC_USER_TOKEN_COOKIE),
            'X-User-Id': Cookies.get(RC_USER_ID_COOKIE),
          },
          method: 'POST',
        });

        return await response2.json();
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  async updateUserUsername(userid, username) {
    const newUserName = username.replace(/\s/g, '.').toLowerCase();

    const usernameRegExp = /[0-9a-zA-Z-_.]+/;

    if (usernameRegExp.test(newUserName)) {
      try {
        const response = await fetch(`${this.host}/api/v1/users.update`, {
          body: `{"userId": "${userid}", "data": { "username": "${newUserName}" }}`,
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': Cookies.get(RC_USER_TOKEN_COOKIE),
            'X-User-Id': Cookies.get(RC_USER_ID_COOKIE),
          },
          method: 'POST',
        });

        const result = await response.json();

        if (
          !result.success &&
          result.errorType === 'error-could-not-save-identity'
        ) {
          return await this.updateUserNameThroughSuggestion(userid);
        }
        return result;
      } catch (err) {
        console.error(err.message);
      }
    } else {
      return this.updateUserNameThroughSuggestion(userid);
    }
  }

  async channelInfo() {
    try {
      const response = await fetch(
        `${this.host}/api/v1/channels.info?roomId=${this.rid}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': Cookies.get(RC_USER_TOKEN_COOKIE),
            'X-User-Id': Cookies.get(RC_USER_ID_COOKIE),
          },
          method: 'GET',
        }
      );
      return await response.json();
    } catch (err) {
      console.error(err.message);
    }
  }

  async realtime(callback) {
    try {
      await this.rcClient.connect();
      await this.rcClient.resume({ token: Cookies.get(RC_USER_TOKEN_COOKIE) });
      await this.rcClient.subscribe('stream-room-messages', this.rid);
      await this.rcClient.onMessage((data) => {
        callback(data);
      });
      await this.rcClient.subscribeRoom(this.rid);
      await this.rcClient.onStreamData('stream-notify-room', (ddpMessage) => {
        const [roomId, event] = ddpMessage.fields.eventName.split('/');

        if (roomId !== this.rid) {
          return;
        }

        if (event === 'deleteMessage') {
          callback(ddpMessage);
        }
      });
    } catch (err) {
      await this.close();
    }
  }

  async close() {
    await this.rcClient.unsubscribeAll();
    await this.rcClient.disconnect();
  }

  async getMessages(anonymousMode = false) {
    const endp = anonymousMode ? 'anonymousread' : 'messages';
    try {
      const messages = await fetch(
        `${this.host}/api/v1/channels.${endp}?roomId=${this.rid}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': Cookies.get(RC_USER_TOKEN_COOKIE),
            'X-User-Id': Cookies.get(RC_USER_ID_COOKIE),
          },
          method: 'GET',
        }
      );
      return await messages.json();
    } catch (err) {
      console.log(err.message);
    }
  }

  async getChannelRoles() {
    try {
      const roles = await fetch(
        `${this.host}/api/v1/channels.roles?roomId=${this.rid}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': Cookies.get(RC_USER_TOKEN_COOKIE),
            'X-User-Id': Cookies.get(RC_USER_ID_COOKIE),
          },
          method: 'GET',
        }
      );
      return await roles.json();
    } catch (err) {
      console.log(err.message);
    }
  }

  async sendMessage(message) {
    try {
      const response = await fetch(`${this.host}/api/v1/chat.sendMessage`, {
        body: JSON.stringify({ message: { rid: this.rid, msg: message } }),
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': Cookies.get(RC_USER_TOKEN_COOKIE),
          'X-User-Id': Cookies.get(RC_USER_ID_COOKIE),
        },
        method: 'POST',
      });
      return await response.json();
    } catch (err) {
      console.error(err.message);
    }
  }

  async deleteMessage(msgId) {
    try {
      const response = await fetch(`${this.host}/api/v1/chat.delete`, {
        body: `{"roomId": "${this.rid}", "msgId": "${msgId}","asUser" : true }`,
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': Cookies.get(RC_USER_TOKEN_COOKIE),
          'X-User-Id': Cookies.get(RC_USER_ID_COOKIE),
        },
        method: 'POST',
      });
      return await response.json();
    } catch (err) {
      console.error(err.message);
    }
  }

  async updateMessage(msgId, text) {
    try {
      const response = await fetch(`${this.host}/api/v1/chat.update`, {
        body: `{"roomId": "${this.rid}", "msgId": "${msgId}","text" : "${text}" }`,
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': Cookies.get('rc_token'),
          'X-User-Id': Cookies.get('rc_uid'),
        },
        method: 'POST',
      });
      return await response.json();
    } catch (err) {
      console.error(err.message);
    }
  }

  async starMessage(mid) {
    try {
      const response = await fetch(`${this.host}/api/v1/chat.starMessage`, {
        body: `{"messageId": "${mid}"}`,
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': Cookies.get(RC_USER_TOKEN_COOKIE),
          'X-User-Id': Cookies.get(RC_USER_ID_COOKIE),
        },
        method: 'POST',
      });
      return await response.json();
    } catch (err) {
      console.error(err.message);
    }
  }

  async unstarMessage(mid) {
    try {
      const response = await fetch(`${this.host}/api/v1/chat.unStarMessage`, {
        body: `{"messageId": "${mid}"}`,
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': Cookies.get(RC_USER_TOKEN_COOKIE),
          'X-User-Id': Cookies.get(RC_USER_ID_COOKIE),
        },
        method: 'POST',
      });
      return await response.json();
    } catch (err) {
      console.error(err.message);
    }
  }

  async getStarredMessages() {
    try {
      const response = await fetch(
        `${this.host}/api/v1/chat.getStarredMessages?roomId=${this.rid}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': Cookies.get(RC_USER_TOKEN_COOKIE),
            'X-User-Id': Cookies.get(RC_USER_ID_COOKIE),
          },
          method: 'GET',
        }
      );
      return await response.json();
    } catch (err) {
      console.error(err.message);
    }
  }

  async getPinnedMessages() {
    try {
      const response = await fetch(
        `${this.host}/api/v1/chat.getPinnedMessages?roomId=${this.rid}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': Cookies.get(RC_USER_TOKEN_COOKIE),
            'X-User-Id': Cookies.get(RC_USER_ID_COOKIE),
          },
          method: 'GET',
        }
      );
      return await response.json();
    } catch (err) {
      console.error(err.message);
    }
  }

  async pinMessage(mid) {
    try {
      const response = await fetch(`${this.host}/api/v1/chat.pinMessage`, {
        body: `{"messageId": "${mid}"}`,
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': Cookies.get(RC_USER_TOKEN_COOKIE),
          'X-User-Id': Cookies.get(RC_USER_ID_COOKIE),
        },
        method: 'POST',
      });
      return await response.json();
    } catch (err) {
      return {
        error: err.message,
      };
    }
  }

  async unpinMessage(mid) {
    try {
      const response = await fetch(`${this.host}/api/v1/chat.unPinMessage`, {
        body: `{"messageId": "${mid}"}`,
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': Cookies.get(RC_USER_TOKEN_COOKIE),
          'X-User-Id': Cookies.get(RC_USER_ID_COOKIE),
        },
        method: 'POST',
      });
      return await response.json();
    } catch (err) {
      console.error(err.message);
    }
  }

  async reactToMessage(emoji, messageId, shouldReact) {
    try {
      const response = await fetch(`${this.host}/api/v1/chat.react`, {
        body: `{"messageId": "${messageId}", "emoji": "${emoji}", "shouldReact": ${shouldReact}}`,
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': Cookies.get(RC_USER_TOKEN_COOKIE),
          'X-User-Id': Cookies.get(RC_USER_ID_COOKIE),
        },
        method: 'POST',
      });
      return await response.json();
    } catch (err) {
      console.error(err.message);
    }
  }

  async reportMessage(messageId, description) {
    try {
      const response = await fetch(`${this.host}/api/v1/chat.reportMessage`, {
        body: `{"messageId": "${messageId}", "description": "${description}"}`,
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': Cookies.get(RC_USER_TOKEN_COOKIE),
          'X-User-Id': Cookies.get(RC_USER_ID_COOKIE),
        },
        method: 'POST',
      });
      return await response.json();
    } catch (err) {
      console.error(err.message);
    }
  }

  async sendAttachment(e) {
    try {
      const form = new FormData();
      const file = e.files[0];
      form.append('file', file, file.name);
      const response = fetch(`${this.host}/api/v1/rooms.upload/${this.rid}`, {
        method: 'POST',
        body: form,
        headers: {
          'X-Auth-Token': Cookies.get(RC_USER_TOKEN_COOKIE),
          'X-User-Id': Cookies.get(RC_USER_ID_COOKIE),
        },
      }).then((r) => r.json());
      return response;
    } catch (err) {
      console.log(err);
    }
  }

  async me() {
    try {
      const response = await fetch(`${this.host}/api/v1/me`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': Cookies.get(RC_USER_TOKEN_COOKIE),
          'X-User-Id': Cookies.get(RC_USER_ID_COOKIE),
        },
        method: 'GET',
      });
      return await response.json();
    } catch (err) {
      console.error(err.message);
    }
  }

  async getChannelMembers() {
    try {
      const response = await fetch(
        `${this.host}/api/v1/channels.members?roomId=${this.rid}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': Cookies.get('rc_token'),
            'X-User-Id': Cookies.get('rc_uid'),
          },
          method: 'GET',
        }
      );
      return await response.json();
    } catch (err) {
      console.error(err.message);
    }
  }

  async getSearchMessages(text) {
    try {
      const response = await fetch(
        `${this.host}/api/v1/chat.search?roomId=${this.rid}&searchText=${text}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': Cookies.get('rc_token'),
            'X-User-Id': Cookies.get('rc_uid'),
          },
          method: 'GET',
        }
      );
      return await response.json();
    } catch (err) {
      console.error(err.message);
    }
  }
}
