export async function saveToken(token) {
  const urlencoded = new URLSearchParams();
  urlencoded.append('token', token);

  const requestOptions = {
    method: 'POST',
    body: urlencoded,
    redirect: 'follow',
    credentials: 'include',
  };

  fetch(
    'http://localhost:3000/api/apps/public/4c977b2e-eda2-4627-8bfe-2d0358304a79/auth-token',
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

export async function getToken() {
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    redirect: 'follow',
  };

  try {
    const response = await fetch(
      'http://localhost:3000/api/apps/public/4c977b2e-eda2-4627-8bfe-2d0358304a79/auth-token',
      requestOptions
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();

    const { token } = result;
    console.log(token);
    return token;
  } catch (error) {
    console.error('Error fetching token:', error);
    return null;
  }
}

export async function deleteToken() {
  const requestOptions = {
    method: 'DELETE',
    redirect: 'follow',
    credentials: 'include',
  };

  fetch(
    'http://localhost:3000/api/apps/public/4c977b2e-eda2-4627-8bfe-2d0358304a79/auth-token',
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}
