import { Rocketchat } from '@rocket.chat/sdk';
import Cookies from 'js-cookie';

export default class RocketChatInstance {
  host = 'http://localhost:3000';
  rid = '';
  rcClient = new Rocketchat({
    protocol: 'ddp',
    host: this.host,
    useSsl: false,
  });

  constructor(host, rid) {
    this.host = host;
    this.rid = rid;
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
        return { status: response.status };
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

  async updateUserUsername(userid, username) {
    let newUserName = username.replace(/\s/g, '.').toLowerCase();
    try {
      const response = await fetch(`${this.host}/api/v1/users.update`, {
        body: `{"userId": "${userid}", "data": { "username": "${newUserName}" }}`,
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

  async me() {
    try {
      const response = await fetch(`${this.host}/api/v1/me`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': Cookies.get('rc_token'),
          'X-User-Id': Cookies.get('rc_uid'),
        },
        method: 'GET',
      });
      return await response.json();
    } catch (err) {
      console.error(err.message);
    }
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
}
