// authFetch.js

async function authFetch(url, options = {}) {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  // Attach the access token
  options.headers = options.headers || {};
  options.headers['Authorization'] = `Bearer ${accessToken}`;

  let response = await fetch(url, options);

  // If unauthorized, try refreshing the token
  if (response.status === 401 || response.status === 403) {
    const refreshResponse = await fetch('https://localhost:3000/auth/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: refreshToken })
    });

    if (refreshResponse.ok) {
      const data = await refreshResponse.json();
      localStorage.setItem('accessToken', data.accessToken);

      // Retry the original request with the new access token
      options.headers['Authorization'] = `Bearer ${data.accessToken}`;
      response = await fetch(url, options);
    } else {
      throw new Error('Session expired. Please log in again.');
    }
  }

  return response;
}
