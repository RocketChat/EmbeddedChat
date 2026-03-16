import { BaseService } from "./BaseService";

export class UserService extends BaseService {
  async updateUserNameThroughSuggestion(userid: string) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${this.host}/api/v1/users.getUsernameSuggestion`,
        {
          headers,
          method: "GET",
        }
      );

      const suggestedUsername = await response.json();

      if (suggestedUsername.success) {
        const response2 = await fetch(`${this.host}/api/v1/users.update`, {
          body: JSON.stringify({
            userId: userid,
            data: { username: suggestedUsername.result },
          }),
          headers,
          method: "POST",
        });

        return await response2.json();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async updateUserUsername(userid: string, username: string) {
    const newUserName = username.replace(/\s/g, ".").toLowerCase();

    const usernameRegExp = /[0-9a-zA-Z-_.]+/;

    if (usernameRegExp.test(newUserName)) {
      try {
        const headers = await this.getAuthHeaders();
        const response = await fetch(`${this.host}/api/v1/users.update`, {
          body: JSON.stringify({
            userId: userid,
            data: { username: newUserName },
          }),
          headers,
          method: "POST",
        });

        const result = await response.json();

        if (
          !result.success &&
          result.errorType === "error-could-not-save-identity"
        ) {
          return await this.updateUserNameThroughSuggestion(userid);
        }
        return result;
      } catch (err) {
        console.error(err);
      }
    } else {
      return this.updateUserNameThroughSuggestion(userid);
    }
  }

  async getUsersInRole(role: string) {
    try {
      const headers = await this.getAuthHeaders();
      const roles = await fetch(
        `${this.host}/api/v1/roles.getUsersInRole?role=${role}`,
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

  async getUserRoles() {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${this.host}/api/v1/method.call/getUserRoles`,
        {
          body: JSON.stringify({
            message: JSON.stringify({
              msg: "method",
              id: null,
              method: "getUserRoles",
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

  async me() {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.host}/api/v1/me`, {
        headers,
        method: "GET",
      });
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async getUserStatus(reqUserId: string) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${this.host}/api/v1/users.getStatus?userId=${reqUserId}`,
        {
          method: "GET",
          headers,
        }
      );
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async userInfo(reqUserId: string) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${this.host}/api/v1/users.info?userId=${reqUserId}`,
        {
          method: "GET",
          headers,
        }
      );
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async userData(username: string) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${this.host}/api/v1/users.info?username=${username}`,
        {
          method: "GET",
          headers,
        }
      );
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }
}
