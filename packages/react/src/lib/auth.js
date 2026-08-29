async function saveTokenSecure(token) {
  this.handleSecureLogin('save', token);
}

async function getTokenSecure() {
  const response = await this.handleSecureLogin('get');
  return response?.token !== undefined ? response.token : null;
}

async function deleteTokenSecure() {
  this.handleSecureLogin('delete');
}

export function getTokenStorage(secure = false, key = 'ec_token') {
  if (secure) {
    return {
      saveToken: saveTokenSecure,
      getToken: getTokenSecure,
      deleteToken: deleteTokenSecure,
    };
  }
  return {
    saveToken: (token) => {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, token);
      }
    },
    getToken: () => {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(key);
      }
      return null;
    },
    deleteToken: () => {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key);
      }
    },
  };
}
