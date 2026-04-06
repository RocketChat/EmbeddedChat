export function getTokenStorage(secure = false) {
  if (secure) {
    return {
      async saveToken(token) {
        await this.handleSecureLogin('save', token);
      },
      async getToken() {
        const response = await this.handleSecureLogin('get');
        return response?.token !== undefined ? response.token : null;
      },
      async deleteToken() {
        await this.handleSecureLogin('delete');
      },
    };
  }

  return {
    async saveToken(token) {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('ec_token', token);
      }
    },
    async getToken() {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem('ec_token');
      }
      return null;
    },
    async deleteToken() {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('ec_token');
      }
    },
  };
}
