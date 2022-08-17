const jwt = require('jsonwebtoken');

const exchangeCodeForToken = async (code) => {
  const client_id = process.env.GOOGLE_CLIENT_ID;
  const client_secret = process.env.GOOGLE_SECRET;
  const redirect_uri = process.env.GOOGLE_REDIRECT_URI;
  const grant_type = 'authorization_code';

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id,
      client_secret,
      code,
      redirect_uri,
      grant_type,
    })
  });

  const resp = await response.json();
  return resp.id_token;
};

const getGoogleProfile = async (token) => {
  return jwt.decode(token);
};

module.exports = { exchangeCodeForToken, getGoogleProfile };
