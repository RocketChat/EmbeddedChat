import { Rocketchat } from '@rocket.chat/sdk';

export default class RocketChatInstance {
  host = 'http://localhost:3000';
  rid = '';
  rcClient = new Rocketchat({
    logger: console,
    protocol: 'ddp',
    host: this.host,
    useSsl: false,
  });
  constructor(host, rid) {
    this.host = host;
    this.rid = rid;
  }

  async realtime(cookies) {
    try {
      await this.rcClient.connect();
      await this.rcClient.resume({ token: cookies.rc_token });
      await this.rcClient.subscribe('stream-room-messages', this.rid);
      this.rcClient.onMessage((data) => {
        console.log(data);
      });
    } catch (err) {
      console.log(err.message);
    }
  }

  async getMessages(cookies) {
    try {
      const messages = await fetch(
        `${this.host}/api/v1/channels.messages?roomId=${this.rid}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': cookies.rc_token ?? '',
            'X-User-Id': cookies.rc_uid ?? '',
          },
          method: 'GET',
        }
      );
      return await messages.json();
    } catch (err) {
      console.log(err.message);
    }
  }

  async sendMessage(message, cookies) {
    try {
      const response = await fetch(`${this.host}/api/v1/chat.sendMessage`, {
        body: `{"message": { "rid": "${this.rid}", "msg": "${message}" }}`,
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': cookies.rc_token,
          'X-User-Id': cookies.rc_uid,
        },
        method: 'POST',
      });
      return await response.json();
    } catch (err) {
      console.error(err.message);
    }
  }
}
