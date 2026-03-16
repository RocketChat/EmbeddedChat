import { BaseService } from "./BaseService";

export class MessageService extends BaseService {
  async getMessages(
    anonymousMode = false,
    options: {
      query?: object | undefined;
      field?: object | undefined;
    } = {
      query: undefined,
      field: undefined,
    },
    isChannelPrivate = false
  ) {
    const roomType = isChannelPrivate ? "groups" : "channels";
    const endp = anonymousMode ? "anonymousread" : "messages";
    const query = options?.query
      ? `&query=${JSON.stringify(options.query)}`
      : "";
    const field = options?.field
      ? `&field=${JSON.stringify(options.field)}`
      : "";
    try {
      const headers = await this.getAuthHeaders();
      const messages = await fetch(
        `${this.host}/api/v1/${roomType}.${endp}?roomId=${this.rid}${query}${field}`,
        {
          headers,
          method: "GET",
        }
      );
      return await messages.json();
    } catch (err) {
      console.log(err);
    }
  }

  async getOlderMessages(
    anonymousMode = false,
    options: {
      query?: object | undefined;
      field?: object | undefined;
      offset?: number;
    } = {
      query: undefined,
      field: undefined,
      offset: 50,
    },
    isChannelPrivate = false
  ) {
    const roomType = isChannelPrivate ? "groups" : "channels";
    const endp = anonymousMode ? "anonymousread" : "messages";
    const query = options?.query
      ? `&query=${JSON.stringify(options.query)}`
      : "";
    const field = options?.field
      ? `&field=${JSON.stringify(options.field)}`
      : "";
    const offset = options?.offset ? options.offset : 0;
    try {
      const headers = await this.getAuthHeaders();
      const messages = await fetch(
        `${this.host}/api/v1/${roomType}.${endp}?roomId=${this.rid}${query}${field}&offset=${offset}`,
        {
          headers,
          method: "GET",
        }
      );
      return await messages.json();
    } catch (err) {
      console.log(err);
    }
  }

  async getThreadMessages(tmid: string, _isChannelPrivate = false) {
    try {
      const headers = await this.getAuthHeaders();
      const messages = await fetch(
        `${this.host}/api/v1/chat.getThreadMessages?tmid=${tmid}`,
        {
          headers,
          method: "GET",
        }
      );
      return await messages.json();
    } catch (err) {
      console.log(err);
    }
  }

  async sendMessage(message: any, threadId?: string) {
    const messageObj =
      typeof message === "string"
        ? {
            rid: this.rid,
            msg: message,
          }
        : {
            ...message,
            rid: this.rid,
          };
    if (threadId) {
      messageObj.tmid = threadId;
    }
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.host}/api/v1/chat.sendMessage`, {
        body: JSON.stringify({ message: messageObj }),
        headers,
        method: "POST",
      });
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async deleteMessage(msgId: string) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.host}/api/v1/chat.delete`, {
        body: JSON.stringify({ roomId: this.rid, msgId }),
        headers,
        method: "POST",
      });
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async updateMessage(msgId: string, text: string) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.host}/api/v1/chat.update`, {
        body: JSON.stringify({ roomId: this.rid, msgId, text }),
        headers,
        method: "POST",
      });
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async starMessage(mid: string) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.host}/api/v1/chat.starMessage`, {
        body: JSON.stringify({ messageId: mid }),
        headers,
        method: "POST",
      });
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async unstarMessage(mid: string) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.host}/api/v1/chat.unStarMessage`, {
        body: JSON.stringify({ messageId: mid }),
        headers,
        method: "POST",
      });
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async getStarredMessages() {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${this.host}/api/v1/chat.getStarredMessages?roomId=${this.rid}`,
        {
          headers,
          method: "GET",
        }
      );
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async getPinnedMessages() {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${this.host}/api/v1/chat.getPinnedMessages?roomId=${this.rid}`,
        {
          headers,
          method: "GET",
        }
      );
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async getMentionedMessages() {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${this.host}/api/v1/chat.getMentionedMessages?roomId=${this.rid}`,
        {
          headers,
          method: "GET",
        }
      );
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async pinMessage(mid: string) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.host}/api/v1/chat.pinMessage`, {
        body: JSON.stringify({ messageId: mid }),
        headers,
        method: "POST",
      });
      return await response.json();
    } catch (err) {
      return {
        error: err,
      };
    }
  }

  async unpinMessage(mid: string) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.host}/api/v1/chat.unPinMessage`, {
        body: JSON.stringify({ messageId: mid }),
        headers,
        method: "POST",
      });
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async reactToMessage(emoji: string, messageId: string, shouldReact: string) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.host}/api/v1/chat.react`, {
        body: JSON.stringify({
          messageId,
          emoji,
          shouldReact,
        }),
        headers,
        method: "POST",
      });
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async reportMessage(messageId: string, description: string) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.host}/api/v1/chat.reportMessage`, {
        body: JSON.stringify({ messageId, description }),
        headers,
        method: "POST",
      });
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async getSearchMessages(text: string) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${this.host}/api/v1/chat.search?roomId=${this.rid}&searchText=${text}`,
        {
          headers,
          method: "GET",
        }
      );
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async getMessageLimit() {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${this.host}/api/v1/settings/Message_MaxAllowedSize`,
        {
          headers,
          method: "GET",
        }
      );
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async getCommandsList() {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.host}/api/v1/commands.list`, {
        headers,
        method: "GET",
      });
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async execCommand({
    command,
    params,
    tmid,
  }: {
    command: string;
    params: string;
    tmid?: string;
  }) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.host}/api/v1/commands.run`, {
        headers,
        method: "POST",
        body: JSON.stringify({
          command,
          params,
          tmid,
          roomId: this.rid,
          triggerId: Math.random().toString(32).slice(2, 20),
        }),
      });
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async sendAttachment(
    file: File,
    fileName: string,
    fileDescription = "",
    threadId = undefined
  ) {
    try {
      const { userId, authToken } = (await this.auth.getCurrentUser()) || {};
      const form = new FormData();
      if (threadId) {
        form.append("tmid", threadId);
      }
      form.append("file", file, fileName);
      form.append(
        "description",
        fileDescription.length !== 0 ? fileDescription : ""
      );
      const response = fetch(`${this.host}/api/v1/rooms.upload/${this.rid}`, {
        method: "POST",
        body: form,
        headers: {
          "X-Auth-Token": authToken || "",
          "X-User-Id": userId || "",
        },
      }).then((r) => r.json());
      return response;
    } catch (err) {
      console.log(err);
    }
  }
}
