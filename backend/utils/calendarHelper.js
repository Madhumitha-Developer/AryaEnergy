const { getCalendarClient } = require('../config/googleCalendar');

// Duration map: service name → minutes
const DURATION_MAP = {
  'Discovery Call':             30,
  'Executive Advisory Session': 90,
  'Team Workshop':              240, // half-day = 4h
  'Framework Implementation':   480, // full-day = 8h
};

/**
 * Parses "May 15, 2026" + "10:00 AM" into a JS Date.
 */
const parseDateTime = (dateStr, timeStr) => {
  return new Date(`${dateStr} ${timeStr}`);
};

/**
 * Creates a Google Calendar event and returns { eventId, htmlLink }.
 * Falls back gracefully if Calendar is not configured.
 */
const createCalendarEvent = async (booking) => {
  if (!process.env.GOOGLE_REFRESH_TOKEN) {
    console.warn('⚠️  GOOGLE_REFRESH_TOKEN not set — skipping calendar event creation');
    return { eventId: null, htmlLink: null };
  }

  const calendar  = getCalendarClient();
  const start     = parseDateTime(booking.date, booking.time);
  const durationMins = DURATION_MAP[booking.service] || 60;
  const end       = new Date(start.getTime() + durationMins * 60 * 1000);

  const event = {
    summary:     `${booking.service} — ${booking.name}`,
    description: [
      `Client: ${booking.name}`,
      `Email:  ${booking.email}`,
      `Mobile: ${booking.mobile}`,
      '',
      'Session notes:',
      booking.description,
    ].join('\n'),
    start: {
      dateTime: start.toISOString(),
      timeZone: 'America/New_York', // adjust to Anya's timezone
    },
    end: {
      dateTime: end.toISOString(),
      timeZone: 'America/New_York',
    },
    attendees: [
      { email: booking.email, displayName: booking.name },
    ],
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email',  minutes: 24 * 60 },
        { method: 'popup',  minutes: 30 },
      ],
    },
    conferenceData: {
      createRequest: {
        requestId: `anya-${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
  };

  const response = await calendar.events.insert({
    calendarId:                process.env.GOOGLE_CALENDAR_ID || 'primary',
    resource:                  event,
    conferenceDataVersion:     1,
    sendUpdates:               'all', // sends invites to attendees
  });

  return {
    eventId:  response.data.id,
    htmlLink: response.data.htmlLink,
  };
};

/**
 * Deletes a Google Calendar event by ID.
 */
const deleteCalendarEvent = async (eventId) => {
  if (!process.env.GOOGLE_REFRESH_TOKEN || !eventId) return;
  const calendar = getCalendarClient();
  await calendar.events.delete({
    calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
    eventId,
    sendUpdates: 'all',
  });
};

module.exports = { createCalendarEvent, deleteCalendarEvent };
