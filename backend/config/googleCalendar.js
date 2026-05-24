const { google } = require('googleapis');

/**
 * Returns an authenticated OAuth2 client using the stored refresh token.
 * Call this before every Calendar API operation so credentials stay fresh.
 */
const getAuthClient = () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  return oauth2Client;
};

/**
 * Returns a ready-to-use Calendar v3 client.
 */
const getCalendarClient = () => {
  return google.calendar({ version: 'v3', auth: getAuthClient() });
};

/**
 * One-time helper: generates the URL you visit to grant calendar access.
 * After visiting and approving, Google sends a `code` to GOOGLE_REDIRECT_URI.
 */
const getAuthUrl = () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/calendar'],
  });
};

/**
 * One-time helper: exchanges the auth code for tokens and prints the
 * refresh token to stdout so you can paste it into .env.
 */
const exchangeCodeForTokens = async (code) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );

  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};

module.exports = { getAuthClient, getCalendarClient, getAuthUrl, exchangeCodeForTokens };
