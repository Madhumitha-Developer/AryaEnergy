# Anya Eydman — Booking System

Full-stack booking platform: React frontend + Node.js/Express backend + MongoDB + Google Calendar integration.

---

## Project Structure

```
anya-eydman-updated/
├── src/                        ← React frontend (existing app + updated BookingSection)
│   └── components/
│       ├── BookingSection.jsx  ← Updated: popup modal + API call
│       └── BookingSection.css  ← Updated: modal styles appended
├── backend/
│   ├── server.js               ← Express entry point
│   ├── .env.example            ← Copy to .env and fill in values
│   ├── config/
│   │   ├── db.js               ← MongoDB connection
│   │   └── googleCalendar.js   ← OAuth2 client helpers
│   ├── models/
│   │   └── Booking.js          ← Mongoose schema
│   ├── routes/
│   │   ├── bookings.js         ← POST / GET / PATCH cancel
│   │   └── auth.js             ← One-time Google OAuth2 setup
│   ├── middleware/
│   │   └── errorHandler.js     ← Global error handler
│   └── utils/
│       └── calendarHelper.js   ← createCalendarEvent / deleteCalendarEvent
└── README.md
```

---

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB running locally (`mongod`) **or** a MongoDB Atlas connection string
- A Google Cloud project with Calendar API enabled (for calendar events)

---

### 1. Frontend

```bash
# In the project root (anya-eydman-updated/)
cp .env.example .env          # Edit REACT_APP_API_URL if backend runs elsewhere
npm install
npm start                     # Runs on http://localhost:3000
```

---

### 2. Backend

```bash
cd backend
cp .env.example .env          # Fill in all values (see below)
npm install
npm run dev                   # Runs on http://localhost:5000 with nodemon
```

---

### 3. Environment Variables

Edit `backend/.env`:

| Variable | Description |
|---|---|
| `PORT` | Backend port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string, e.g. `mongodb://localhost:27017/anya-eydman` |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |
| `GOOGLE_REDIRECT_URI` | `http://localhost:5000/api/auth/google/callback` |
| `GOOGLE_REFRESH_TOKEN` | Obtained via the one-time OAuth flow below |
| `GOOGLE_CALENDAR_ID` | `primary` or a specific calendar ID |
| `ALLOWED_ORIGINS` | Comma-separated frontend origins, e.g. `http://localhost:3000` |

---

### 4. Google Calendar Setup (one-time)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project → **APIs & Services** → **Enable APIs** → search **Google Calendar API** → Enable
3. **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID** → Web application
4. Add `http://localhost:5000/api/auth/google/callback` to **Authorized redirect URIs**
5. Copy the **Client ID** and **Client Secret** into `backend/.env`
6. With the backend running, visit: **http://localhost:5000/api/auth/google**
7. Approve the permissions. You'll be redirected back and shown your `GOOGLE_REFRESH_TOKEN`.
8. Paste it into `backend/.env` as `GOOGLE_REFRESH_TOKEN=...`
9. Restart the backend — calendar events will now be created automatically.

> **Tip:** The booking still saves to MongoDB even if Google Calendar is not configured. Calendar creation is non-blocking; it warns in the console but never fails the booking response.

---

## API Reference

### `POST /api/bookings`

Create a booking and (optionally) a Google Calendar event.

**Request body:**
```json
{
  "service":     "Discovery Call",
  "duration":    "30 min",
  "date":        "May 15, 2026",
  "time":        "10:00 AM",
  "name":        "Jane Smith",
  "email":       "jane@example.com",
  "mobile":      "+1 555 000 0000",
  "description": "I want to discuss my executive team's trust deficit."
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "Booking confirmed",
  "data": {
    "id": "664abc123...",
    "service": "Discovery Call",
    "date": "May 15, 2026",
    "time": "10:00 AM",
    "name": "Jane Smith",
    "calendarLink": "https://calendar.google.com/event?eid=..."
  }
}
```

### `GET /api/bookings`

List bookings. Optional query params: `email`, `status`, `page`, `limit`.

### `GET /api/bookings/:id`

Fetch a single booking by MongoDB ObjectId.

### `PATCH /api/bookings/:id/cancel`

Cancel a booking and delete the Google Calendar event.

### `GET /health`

Server health check.

---

## How It Works

1. User picks a service, date, and time slot on the calendar.
2. "Confirm Booking" opens a modal collecting name, email, mobile, and description.
3. On submit, the frontend `POST`s to `/api/bookings`.
4. The backend validates, saves to MongoDB, then creates a Google Calendar event with the client as an attendee (Google sends them an invite automatically).
5. The booking is confirmed in the UI.
