const express  = require('express');
const router   = express.Router();
const Booking  = require('../models/Booking');
const { createCalendarEvent, deleteCalendarEvent, updateCalendarEvent } = require('../utils/calendarHelper');

// ─── POST /api/bookings ────────────────────────────────────────────────────
// Create a new booking, persist to MongoDB, create a Google Calendar event.
router.post('/', async (req, res, next) => {
  try {
    const { service, duration, date, time, name, email, mobile, description } = req.body;

    // Basic presence check (Mongoose validation does the rest)
    if (!service || !date || !time || !name || !email || !mobile || !description) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // 1. Save to MongoDB
    const booking = await Booking.create({ service, duration, date, time, name, email, mobile, description });

    // 2. Create Google Calendar event (non-blocking failure)
    try {
      const { eventId, htmlLink } = await createCalendarEvent(booking);
      if (eventId) {
        booking.googleEventId = eventId;
        booking.calendarLink  = htmlLink;
        await booking.save();
      }
    } catch (calErr) {
      // Log but don't fail the booking if Calendar is misconfigured
      console.error('Calendar event creation failed:', calErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Booking confirmed',
      data: {
        id:          booking._id,
        service:     booking.service,
        date:        booking.date,
        time:        booking.time,
        name:        booking.name,
        calendarLink: booking.calendarLink,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/bookings ─────────────────────────────────────────────────────
// List all bookings (admin use — add auth middleware in production).
router.get('/', async (req, res, next) => {
  try {
    const { email, status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (email)  filter.email  = email.toLowerCase();
    if (status) filter.status = status;

    const skip     = (Number(page) - 1) * Number(limit);
    const [bookings, total] = await Promise.all([
      Booking.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Booking.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data:    bookings,
      meta:    { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/bookings/:id ─────────────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
});

// ─── PATCH /api/bookings/:id/reschedule ───────────────────────────────────
// Move an existing booking to a new date/time and update the Google Calendar event.
router.patch('/:id/reschedule', async (req, res, next) => {
  try {
    const { date, time } = req.body;
    if (!date || !time) {
      return res.status(400).json({ success: false, message: 'New date and time are required' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Cannot reschedule a cancelled booking' });
    }

    // Update fields
    booking.date = date;
    booking.time = time;
    await booking.save();

    // Update Google Calendar event
    try {
      if (booking.googleEventId) {
        const { htmlLink } = await updateCalendarEvent(booking.googleEventId, booking);
        if (htmlLink) {
          booking.calendarLink = htmlLink;
          await booking.save();
        }
      }
    } catch (calErr) {
      console.error('Calendar update failed:', calErr.message);
    }

    res.json({
      success: true,
      message: 'Booking rescheduled',
      data: {
        id:           booking._id,
        service:      booking.service,
        date:         booking.date,
        time:         booking.time,
        calendarLink: booking.calendarLink,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── PATCH /api/bookings/:id/cancel ───────────────────────────────────────
router.patch('/:id/cancel', async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Already cancelled' });
    }

    // Remove Google Calendar event
    if (booking.googleEventId) {
      try { await deleteCalendarEvent(booking.googleEventId); } catch (e) { console.error('Calendar delete failed:', e.message); }
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ success: true, message: 'Booking cancelled', data: { id: booking._id, status: booking.status } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
