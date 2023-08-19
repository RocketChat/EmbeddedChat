export async function saveToken(token) {
  localStorage.setItem('ec_token', token);
}

export async function getToken() {
  return localStorage.getItem('ec_token');
}

export async function deleteToken() {
  localStorage.removeItem('ec_token');
}
