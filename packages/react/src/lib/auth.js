export function getTokenStorage(secure = false, handleSecureLogin) {
  if (secure) {
    return {
      saveToken: async (token) => handleSecureLogin('save', token),
      getToken: async () => {
        const response = await handleSecureLogin('get');
        return response?.token !== undefined ? response.token : null;
      },
      deleteToken: async () => handleSecureLogin('delete'),
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
