async function saveTokenLocalStorage(token, key = 'ec_token') {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(key, token);
  }
}

async function getTokenLocalStorage(key = 'ec_token') {
  if (typeof localStorage !== 'undefined') {
    const token = localStorage.getItem(key);
    if (token) {
      return token;
    }
    // Backward compatibility: fallback and migrate legacy 'ec_token' if namespaced key is empty
    if (key !== 'ec_token') {
      const legacyToken = localStorage.getItem('ec_token');
      if (legacyToken) {
        localStorage.setItem(key, legacyToken);
        return legacyToken;
      }
    }
  }
  return null;
}

async function deleteTokenLocalStorage(key = 'ec_token') {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(key);
    if (key !== 'ec_token') {
      localStorage.removeItem('ec_token');
    }
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
