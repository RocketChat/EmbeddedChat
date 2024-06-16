export async function saveToken(token) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('ec_token', token);
  }
}

export async function getToken() {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('ec_token');
  }
  return null;
}

export async function deleteToken() {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('ec_token');
  }
}
