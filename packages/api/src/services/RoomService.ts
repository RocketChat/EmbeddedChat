import { ROCKETCHAT_APP_ID } from "../utils/constants";
import { BaseService } from "./BaseService";

export class RoomService extends BaseService {
  async channelInfo(isChannelPrivate = false) {
    const roomType = isChannelPrivate ? "groups" : "channels";
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${this.host}/api/v1/${roomType}.info?roomId=${this.rid}`,
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

  async getRoomInfo() {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${this.host}/api/v1/method.call/rooms%3Aget`,
        {
          body: JSON.stringify({
            message: JSON.stringify({
              msg: "method",
              id: null,
              method: "rooms/get",
              params: [],
            }),
          }),
          headers,
          method: "POST",
        }
      );

      const result = await response.json();

      if (result.success && result.message) {
        const parsedMessage = JSON.parse(result.message);
        return parsedMessage;
      }
      return null;
    } catch (err) {
      console.error(err);
    }
  }

  async getChannelRoles(isChannelPrivate = false) {
    const roomType = isChannelPrivate ? "groups" : "channels";
    try {
      const headers = await this.getAuthHeaders();
      const roles = await fetch(
        `${this.host}/api/v1/${roomType}.roles?roomId=${this.rid}`,
        {
          headers,
          method: "GET",
        }
      );
      return await roles.json();
    } catch (err) {
      console.log(err);
    }
  }

  async getChannelMembers(isChannelPrivate = false) {
    const roomType = isChannelPrivate ? "groups" : "channels";
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${this.host}/api/v1/${roomType}.members?roomId=${this.rid}`,
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

  async findOrCreateInvite() {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.host}/api/v1/findOrCreateInvite`, {
        method: "POST",
        body: JSON.stringify({ rid: this.rid, days: 1, maxUses: 10 }),
        headers,
      });
      return await response.json();
    } catch (err) {
      console.log(err);
    }
  }

  async getAllFiles(isChannelPrivate = false, typeGroup: string) {
    const roomType = isChannelPrivate ? "groups" : "channels";
    try {
      const headers = await this.getAuthHeaders();
      const url =
        typeGroup === ""
          ? `${this.host}/api/v1/${roomType}.files?roomId=${this.rid}`
          : `${this.host}/api/v1/${roomType}.files?roomId=${this.rid}&typeGroup=${typeGroup}`;
      const response = await fetch(url, {
        headers,
        method: "GET",
      });
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async getAllImages() {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${this.host}/api/v1/rooms.images?roomId=${this.rid}`,
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

  async getRCAppInfo() {
    try {
      const response = await fetch(
        `${this.host}/api/apps/public/${ROCKETCHAT_APP_ID}/info`
      );

      if (!response.ok) {
        return null;
      }
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async permissionInfo() {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.host}/api/v1/permissions.listAll`, {
        headers,
        method: "GET",
      });
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }
}
