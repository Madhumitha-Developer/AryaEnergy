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

  const calendar     = getCalendarClient();
  const start        = parseDateTime(booking.date, booking.time);
  const durationMins = DURATION_MAP[booking.service] || 60;
  const end          = new Date(start.getTime() + durationMins * 60 * 1000);

  // Reschedule URL — client clicks this to pick a new time
  const rescheduleUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/?reschedule=true&email=${encodeURIComponent(booking.email)}&bookingId=${booking._id}`;

  // Placeholder replaced after insert once we have the real Meet link
  const buildDescription = (meetLink) => [
    `Hi ${booking.name},`,
    '',
    `Looking forward to connecting.`,
    '',
    `📅  Service  : ${booking.service}`,
    `🕐  Duration : ${booking.duration || `${durationMins} min`}`,
    `📆  Date     : ${booking.date} at ${booking.time}`,
    booking.description ? `\n📝  Notes    : ${booking.description}` : '',
    '',
    '─────────────────────────────────────',
    'JOIN THE VIDEO MEETING',
    `To join, click this link: ${meetLink || '(Meet link will appear in your calendar invite)'}`,
    '',
    'Or join by phone using the dial-in details in your calendar invite.',
    '',
    '─────────────────────────────────────',
    'NEED TO RESCHEDULE?',
    `Click here to pick a new time: ${rescheduleUrl}`,
    '',
    '─────────────────────────────────────',
    '— Arya Power Solutions',
    'https://aryapowersolutions.com',
  ].filter(line => line !== null).join('\n');

  const event = {
    summary: `${booking.service} with ${booking.name}`,
    description: buildDescription(null), // will be patched after insert
    start: {
      dateTime: start.toISOString(),
      timeZone: process.env.TIMEZONE || 'America/New_York',
    },
    end: {
      dateTime: end.toISOString(),
      timeZone: process.env.TIMEZONE || 'America/New_York',
    },
    attendees: [
      { email: booking.email, displayName: booking.name },
    ],
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 }, // 1 day before
        { method: 'popup', minutes: 30 },       // 30 min before
      ],
    },
    conferenceData: {
      createRequest: {
        requestId: `anya-${booking._id || Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
    guestsCanModifyEvent: false,
    guestsCanSeeOtherGuests: true,
  };

  const response = await calendar.events.insert({
    calendarId:            process.env.GOOGLE_CALENDAR_ID || 'primary',
    resource:              event,
    conferenceDataVersion: 1,
    sendUpdates:           'all',
  });

  // Extract the real Google Meet link from the response
  const meetLink = response.data.conferenceData?.entryPoints?.find(
    (e) => e.entryPointType === 'video'
  )?.uri || '';

  // Patch the description with the real Meet link (silent — no second email)
  if (meetLink) {
    await calendar.events.patch({
      calendarId:            process.env.GOOGLE_CALENDAR_ID || 'primary',
      eventId:               response.data.id,
      resource:              { description: buildDescription(meetLink) },
      conferenceDataVersion: 1,
      sendUpdates:           'none',
    });
  }

  return {
    eventId:       response.data.id,
    htmlLink:      response.data.htmlLink,
    meetLink,
    rescheduleUrl,
  };
};

/**
 * Updates an existing Google Calendar event with the booking's new date/time.
 * Returns { htmlLink } of the updated event.
 */
const updateCalendarEvent = async (eventId, booking) => {
  if (!process.env.GOOGLE_REFRESH_TOKEN || !eventId) {
    console.warn('⚠️  GOOGLE_REFRESH_TOKEN not set or no eventId — skipping calendar update');
    return { htmlLink: null };
  }

  const calendar     = getCalendarClient();
  const start        = parseDateTime(booking.date, booking.time);
  const durationMins = DURATION_MAP[booking.service] || 60;
  const end          = new Date(start.getTime() + durationMins * 60 * 1000);

  // Fetch the existing event so we preserve conferenceData and other fields
  const existing = await calendar.events.get({
    calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
    eventId,
  });

  const meetLink = existing.data.conferenceData?.entryPoints?.find(
    (e) => e.entryPointType === 'video'
  )?.uri || '';

  const rescheduleUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/?reschedule=true&email=${encodeURIComponent(booking.email)}&bookingId=${booking._id}`;

  const updatedDescription = [
    `Hi ${booking.name},`,
    '',
    `Your booking has been rescheduled. Looking forward to connecting!`,
    '',
    `📅  Service  : ${booking.service}`,
    `🕐  Duration : ${booking.duration || `${durationMins} min`}`,
    `📆  New Date : ${booking.date} at ${booking.time}`,
    booking.description ? `\n📝  Notes    : ${booking.description}` : '',
    '',
    '─────────────────────────────────────',
    'JOIN THE VIDEO MEETING',
    `To join, click this link: ${meetLink || '(See calendar invite for Meet link)'}`,
    '',
    'Or join by phone using the dial-in details in your calendar invite.',
    '',
    '─────────────────────────────────────',
    'NEED TO RESCHEDULE AGAIN?',
    `Click here to pick a new time: ${rescheduleUrl}`,
    '',
    '─────────────────────────────────────',
    '— Arya Power Solutions',
    'https://aryapowersolutions.com',
  ].filter(Boolean).join('\n');

  const updatedEvent = {
    ...existing.data,
    description: updatedDescription,
    start: {
      dateTime: start.toISOString(),
      timeZone: process.env.TIMEZONE || 'America/New_York',
    },
    end: {
      dateTime: end.toISOString(),
      timeZone: process.env.TIMEZONE || 'America/New_York',
    },
  };

  const response = await calendar.events.update({
    calendarId:            process.env.GOOGLE_CALENDAR_ID || 'primary',
    eventId,
    resource:              updatedEvent,
    conferenceDataVersion: 1,
    sendUpdates:           'all', // notifies attendees of the time change
  });

  return { htmlLink: response.data.htmlLink, meetLink, rescheduleUrl };
};

/**
 * Deletes a Google Calendar event by ID.
 */
const deleteCalendarEvent = async (eventId) => {
  if (!process.env.GOOGLE_REFRESH_TOKEN || !eventId) return;
  const calendar = getCalendarClient();
  await calendar.events.delete({
    calendarId:  process.env.GOOGLE_CALENDAR_ID || 'primary',
    eventId,
    sendUpdates: 'all',
  });
};

module.exports = { createCalendarEvent, updateCalendarEvent, deleteCalendarEvent };