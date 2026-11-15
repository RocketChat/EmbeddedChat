async function saveTokenLocalStorage(token, key = 'ec_token') {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(key, token);
  }
}

async function getTokenLocalStorage(key = 'ec_token') {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
}

async function deleteTokenLocalStorage(key = 'ec_token') {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(key);
  }
}

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
    saveToken: (token) => saveTokenLocalStorage(token, key),
    getToken: () => getTokenLocalStorage(key),
    deleteToken: () => deleteTokenLocalStorage(key),
  };
}
