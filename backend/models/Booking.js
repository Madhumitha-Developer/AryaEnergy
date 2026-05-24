const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    // ─── Session details ─────────────────────────────────────────────
    service: {
      type: String,
      required: [true, 'Service is required'],
      enum: ['Discovery Call', 'Executive Advisory Session', 'Team Workshop', 'Framework Implementation'],
    },
    duration: { type: String, required: true },
    date:     { type: String, required: [true, 'Date is required'] },  // "May 15, 2026"
    time:     { type: String, required: [true, 'Time is required'] },  // "10:00 AM"

    // ─── Client details ──────────────────────────────────────────────
    name:        { type: String, required: [true, 'Name is required'],   trim: true },
    email:       { type: String, required: [true, 'Email is required'],  trim: true, lowercase: true },
    mobile:      { type: String, required: [true, 'Mobile is required'], trim: true },
    description: { type: String, required: [true, 'Description is required'], trim: true },

    // ─── Google Calendar ─────────────────────────────────────────────
    googleEventId: { type: String, default: null },
    calendarLink:  { type: String, default: null },

    // ─── Status ──────────────────────────────────────────────────────
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'confirmed',
    },
  },
  { timestamps: true },
);

// Index for quick lookup by email
bookingSchema.index({ email: 1 });
bookingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);
