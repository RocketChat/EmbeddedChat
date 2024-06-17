async function saveTokenLocalStorage(token) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('ec_token', token);
  }
}

async function getTokenLocalStorage() {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('ec_token');
  }
  return null;
}

async function deleteTokenLocalStorage() {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('ec_token');
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

export function getTokenStorage(secure = false) {
  if (secure) {
    return {
      saveToken: saveTokenSecure,
      getToken: getTokenSecure,
      deleteToken: deleteTokenSecure,
    };
  }
  return {
    saveToken: saveTokenLocalStorage,
    getToken: getTokenLocalStorage,
    deleteToken: deleteTokenLocalStorage,
  };
}
