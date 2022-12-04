import { Rocketchat } from '@rocket.chat/sdk';
import Cookies from 'js-cookie';

export default class RocketChatInstance {
  host = 'http://localhost:3000';
  rid = '';
  rcClient = null;

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
      rc_token: Cookies.get('rc_token'),
      rc_uid: Cookies.get('rc_uid'),
    };
  }

  setCookies(cookies) {
    Cookies.set('rc_token', cookies.rc_token || '');
    Cookies.set('rc_uid', cookies.rc_uid || '');
  }

  async googleSSOLogin(signIn) {
    const tokens = await signIn();
    try {
      const req = await fetch(`${this.host}/api/v1/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceName: 'google',
          accessToken: tokens.access_token,
          idToken: tokens.id_token,
          expiresIn: 3600,
        }),
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
    } catch (err) {
      console.error(err.message);
    }
  }

  async logout() {
    try {
      const response = await fetch(`${this.host}/api/v1/logout`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': Cookies.get('rc_token'),
          'X-User-Id': Cookies.get('rc_uid'),
        },
        method: 'POST',
      });
      this.setCookies({});
      return await response.json();
    } catch (err) {
      console.error(err.message);
    }
  }

  async getUserNameSuggestion(){
    try {
      const response = await fetch(
        `${this.host}/api/v1/users.getUsernameSuggestion`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': Cookies.get('rc_token'),
            'X-User-Id': Cookies.get('rc_uid'),
          },
          method: 'GET',
        }
      );

      return await response.json()
    } catch (error) {
      console.log(error.message)
    }
  }

  async updateUserUsername(userid, username) {
    try {
      const username = await this.getUserNameSuggestion();

      if (username.success){
        const response = await fetch(`${this.host}/api/v1/users.update`, {
          body: `{"userId": "${userid}", "data": { "username": "${username.result}" }}`,
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': Cookies.get('rc_token'),
            'X-User-Id': Cookies.get('rc_uid'),
          },
          method: 'POST',
        });
        return await response.json();
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  async channelInfo() {
    try {
      const response = await fetch(
        `${this.host}/api/v1/channels.info?roomId=${this.rid}`,
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

  async realtime(callback) {
    try {
      await this.rcClient.connect();
      await this.rcClient.resume({ token: Cookies.get('rc_token') });
      await this.rcClient.subscribe('stream-room-messages', this.rid);
      await this.rcClient.onMessage((data) => {
        callback(data);
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
            'X-Auth-Token': Cookies.get('rc_token'),
            'X-User-Id': Cookies.get('rc_uid'),
          },
          method: 'GET',
        }
      );
      return await messages.json();
    } catch (err) {
      console.log(err.message);
    }
  }

  async sendMessage(message) {
    try {
      const response = await fetch(`${this.host}/api/v1/chat.sendMessage`, {
        body: `{"message": { "rid": "${this.rid}", "msg": "${message}" }}`,
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

  async unstarMessage(mid) {
    try {
      const response = await fetch(`${this.host}/api/v1/chat.unStarMessage`, {
        body: `{"messageId": "${mid}"}`,
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

  async getStarredMessages() {
    try {
      const response = await fetch(
        `${this.host}/api/v1/chat.getStarredMessages?roomId=${this.rid}`,
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

  async getPinnedMessages() {
    try {
      const response = await fetch(
        `${this.host}/api/v1/chat.getPinnedMessages?roomId=${this.rid}`,
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

  async pinMessage(mid) {
    try {
      const response = await fetch(`${this.host}/api/v1/chat.pinMessage`, {
        body: `{"messageId": "${mid}"}`,
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': Cookies.get('rc_token'),
          'X-User-Id': Cookies.get('rc_uid'),
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

  async reactToMessage(emoji, messageId, shouldReact) {
    try {
      const response = await fetch(`${this.host}/api/v1/chat.react`, {
        body: `{"messageId": "${messageId}", "emoji": "${emoji}", "shouldReact": ${shouldReact}}`,
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

  async sendAttachment(e) {
    try {
      const form = new FormData();
      let response;
      e.files[0].text().then((t) => {
        form.append('file', new Blob([t]), e.files[0].name);
        response = fetch(`${this.host}/api/v1/rooms.upload/${this.rid}`, {
          method: 'POST',
          body: form,
          headers: {
            'X-Auth-Token': Cookies.get('rc_token'),
            'X-User-Id': Cookies.get('rc_uid'),
          },
        }).then((r) => r.json());
      });
      return response;
    } catch (err) {
      console.log(err);
    }
  }
}
