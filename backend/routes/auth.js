/**
 * One-time Google OAuth2 flow.
 *
 * Usage:
 *  1. GET  /api/auth/google          → Redirects you to Google's consent screen
 *  2. GET  /api/auth/google/callback → Google calls this with ?code=...
 *     The refresh_token is printed in the response — paste it into .env as
 *     GOOGLE_REFRESH_TOKEN, then restart the server.
 *
 * These routes are only needed during initial setup. Protect or remove them
 * in production.
 */

const express = require('express');
const router  = express.Router();
const { getAuthUrl, exchangeCodeForTokens } = require('../config/googleCalendar');

router.get('/google', (req, res) => {
  const url = getAuthUrl();
  res.redirect(url);
});

router.get('/google/callback', async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    return res.status(400).send(`<pre>Google auth error: ${error}</pre>`);
  }

  if (!code) {
    return res.status(400).send('<pre>No code received from Google</pre>');
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    res.send(`
      <html>
        <body style="font-family:monospace;padding:2rem;background:#f9f5ef;color:#0d1b2a;">
          <h2 style="color:#b8976a">✅ Google Calendar Connected</h2>
          <p>Add this to your <code>.env</code> file and restart the server:</p>
          <pre style="background:#fff;padding:1rem;border:1px solid #e5e0d8;border-radius:4px">GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}</pre>
          <p style="color:#6b7280;font-size:0.85rem">Keep this token secret — it grants full calendar access.</p>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send(`<pre>Token exchange failed: ${err.message}</pre>`);
  }
});

module.exports = router;
