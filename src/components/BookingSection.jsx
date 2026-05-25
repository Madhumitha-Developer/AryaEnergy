import React, { useState, useMemo } from 'react';
import { useFadeRef } from '../hooks/useScrollFade';
import './BookingSection.css';

const SERVICES = [
  { name: 'Discovery Call',             duration: '30 min',   price: 'Free' },
  { name: 'Executive Advisory Session', duration: '90 min',   price: '$499' },
  { name: 'Team Workshop',              duration: 'Half-day', price: 'Custom' },
  { name: 'Framework Implementation',   duration: 'Full-day', price: 'Custom' },
];

const MONTHS    = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const TIMES     = ['9:00 AM','10:00 AM','11:30 AM','1:00 PM','2:30 PM','4:00 PM'];
const DAY_NAMES = ['Su','Mo','Tu','We','Th','Fr','Sa'];
const API_BASE  = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Parses "9:00 AM" / "1:00 PM" into { hours, minutes } in 24-hour format.
 */
const parseTimeSlot = (timeStr) => {
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return { hours, minutes };
};

export default function BookingSection() {
  const ref   = useFadeRef();
  const today = new Date();

  const [month,    setMonth]    = useState(today.getMonth());
  const [year,     setYear]     = useState(today.getFullYear());
  const [selDay,   setSelDay]   = useState(null);
  const [selSlot,  setSelSlot]  = useState(null);
  const [selSvc,   setSelSvc]   = useState(0);

  // Confirmation state
  const [confirmed,        setConfirmed]        = useState(false);
  const [bookingId,        setBookingId]        = useState(null);
  const [confirmedDetails, setConfirmedDetails] = useState(null);

  // Reschedule state
  const [rescheduling,    setRescheduling]    = useState(false);
  const [rescheduling_,   setRescheduling_]   = useState(false);
  const [rescheduleError, setRescheduleError] = useState('');

  // Detail modal state
  const [showModal,   setShowModal]   = useState(false);
  const [formData,    setFormData]    = useState({ name: '', email: '', mobile: '', description: '' });
  const [formErrors,  setFormErrors]  = useState({});
  const [submitting,  setSubmitting]  = useState(false);
  const [submitError, setSubmitError] = useState('');

  // ── Calendar helpers ──────────────────────────────────────────────
  const prevMonth = () => {
    setMonth((m) => { if (m === 0) { setYear((y) => y - 1); return 11; } return m - 1; });
    setSelDay(null); setSelSlot(null);
  };
  const nextMonth = () => {
    setMonth((m) => { if (m === 11) { setYear((y) => y + 1); return 0; } return m + 1; });
    setSelDay(null); setSelSlot(null);
  };

  const { leadingBlanks, daysInMonth } = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const days     = new Date(year, month + 1, 0).getDate();
    return { leadingBlanks: firstDay, daysInMonth: days };
  }, [month, year]);

  const isPast      = (day) => { const d = new Date(year, month, day); const t = new Date(); t.setHours(0,0,0,0); return d < t; };
  const isAvailable = (day) => { const dow = new Date(year, month, day).getDay(); return dow !== 0 && dow !== 6 && !isPast(day); };

  /**
   * Returns true if this time slot has already passed on the selected day.
   * On future days, all slots are available. On today, only slots after the
   * current time are available.
   */
  const isSlotPast = (day, timeStr) => {
    const now = new Date();
    // If not today, never past
    if (year !== now.getFullYear() || month !== now.getMonth() || day !== now.getDate()) {
      return false;
    }
    const { hours, minutes } = parseTimeSlot(timeStr);
    const slotMinutes = hours * 60 + minutes;
    const nowMinutes  = now.getHours() * 60 + now.getMinutes();
    return slotMinutes <= nowMinutes;
  };

  // ── Reset to fresh booking ────────────────────────────────────────
  const resetAll = () => {
    setConfirmed(false);
    setBookingId(null);
    setConfirmedDetails(null);
    setRescheduling(false);
    setRescheduleError('');
    setSelDay(null);
    setSelSlot(null);
  };

  // ── Enter reschedule mode ─────────────────────────────────────────
  const handleRescheduleClick = () => {
    setRescheduling(true);
    setRescheduleError('');
    setSelDay(null);
    setSelSlot(null);
  };

  // ── Submit reschedule ─────────────────────────────────────────────
  const handleRescheduleSubmit = async () => {
    if (!selDay || !selSlot) return;
    setRescheduling_(true);
    setRescheduleError('');

    const newDate = `${MONTHS[month]} ${selDay}, ${year}`;
    const newTime = selSlot;

    try {
      const res = await fetch(`${API_BASE}/api/bookings/${bookingId}/reschedule`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: newDate, time: newTime }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Reschedule failed. Please try again.');
      }
      setConfirmedDetails({ ...confirmedDetails, date: newDate, time: newTime });
      setRescheduling(false);
      setSelDay(null);
      setSelSlot(null);
    } catch (err) {
      setRescheduleError(err.message);
    } finally {
      setRescheduling_(false);
    }
  };

  // ── Detail modal ──────────────────────────────────────────────────
  const handleConfirmClick = () => {
    if (!selDay || !selSlot) return;
    setShowModal(true);
    setFormErrors({});
    setSubmitError('');
  };

  const handleModalClose = () => { if (submitting) return; setShowModal(false); };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim())    errors.name = 'Name is required';
    if (!formData.email.trim())   errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Enter a valid email';
    if (!formData.mobile.trim())  errors.mobile = 'Mobile number is required';
    else if (!/^\+?[\d\s\-()]{7,15}$/.test(formData.mobile)) errors.mobile = 'Enter a valid number';
    if (!formData.description.trim()) errors.description = 'Please add a brief description';
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service:     SERVICES[selSvc].name,
          duration:    SERVICES[selSvc].duration,
          date:        `${MONTHS[month]} ${selDay}, ${year}`,
          time:        selSlot,
          name:        formData.name.trim(),
          email:       formData.email.trim(),
          mobile:      formData.mobile.trim(),
          description: formData.description.trim(),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Something went wrong. Please try again.');
      }
      const json = await res.json();
      setShowModal(false);
      setConfirmed(true);
      setBookingId(json.data?.id || null);
      setConfirmedDetails({
        service: SERVICES[selSvc].name,
        date:    `${MONTHS[month]} ${selDay}, ${year}`,
        time:    selSlot,
      });
      setFormData({ name: '', email: '', mobile: '', description: '' });
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────
  const renderCalendar = (onConfirm, confirmLabel, confirmDisabled, extraError) => (
    <div className="cal-widget fade-up fade-up-delay-2">
      <div className="cal-nav">
        <button className="cal-arrow" onClick={prevMonth} aria-label="Previous month">‹</button>
        <div className="cal-month">{MONTHS[month]} {year}</div>
        <button className="cal-arrow" onClick={nextMonth} aria-label="Next month">›</button>
      </div>
      <div className="cal-days-header">
        {DAY_NAMES.map((d) => <div className="cal-day-name" key={d}>{d}</div>)}
      </div>
      <div className="cal-days">
        {Array.from({ length: leadingBlanks }).map((_, i) => <div key={`blank-${i}`} className="cal-day cal-day--empty" />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const past  = isPast(day);
          const avail = isAvailable(day);
          const sel   = selDay === day;
          let cls = 'cal-day';
          if (past) cls += ' cal-day--past';
          else if (sel) cls += ' cal-day--selected';
          else if (avail) cls += ' cal-day--available';
          return (
            <div key={day} className={cls}
              onClick={() => avail && (setSelDay(day), setSelSlot(null))}
              role={avail ? 'button' : undefined} tabIndex={avail ? 0 : undefined}
              onKeyDown={(e) => e.key === 'Enter' && avail && (setSelDay(day), setSelSlot(null))}
            >{day}</div>
          );
        })}
      </div>
      {selDay && (() => {
        const availableSlots = TIMES.filter((t) => !isSlotPast(selDay, t));
        return (
          <div className="time-slots">
            <div className="time-slots__label">Available times — {MONTHS[month]} {selDay}</div>
            <div className="slots-grid">
              {TIMES.map((t) => {
                const slotPast = isSlotPast(selDay, t);
                return (
                  <button
                    key={t}
                    className={`slot${selSlot === t ? ' slot--selected' : ''}${slotPast ? ' slot--past' : ''}`}
                    onClick={() => !slotPast && setSelSlot(t)}
                    disabled={slotPast}
                    title={slotPast ? 'This time has already passed' : undefined}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
            {availableSlots.length === 0 && (
              <p className="slots-all-past">All time slots for today have passed. Please select another day.</p>
            )}
            {extraError && <div className="booking-error">{extraError}</div>}
            <button className="book-btn" disabled={!selSlot || confirmDisabled} onClick={onConfirm}>
              {confirmDisabled
                ? <span className="modal__spinner" />
                : confirmLabel}
            </button>
          </div>
        );
      })()}
    </div>
  );

  return (
    <section id="booking" className="booking-section" ref={ref}>
      <div className="booking-section__header fade-up">
        <div className="section-tag">Book a Session</div>
        <h2 className="section-h2">Schedule directly — no back and forth</h2>
        <div className="divider" />
        <p className="section-sub">
          Select the service you need, then pick a time that works. You'll receive
          a confirmation and calendar invite within minutes.
        </p>
      </div>

      {/* ── Confirmed view ── */}
      {confirmed && !rescheduling ? (
        <div className="booking-confirmed">
          <div className="booking-confirmed__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>
            </svg>
          </div>
          <div className="booking-confirmed__title">You're booked</div>
          <div className="booking-confirmed__detail">
            {confirmedDetails?.service} · {confirmedDetails?.date} at {confirmedDetails?.time}
          </div>
          <p className="booking-confirmed__note">
            Check your inbox for a confirmation email and Google Calendar invite from Anya.
          </p>
          <div className="booking-confirmed__actions">
            <button className="btn-outline booking-confirmed__reschedule" onClick={handleRescheduleClick}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
              Reschedule
            </button>
            <button className="btn-outline" onClick={resetAll}>
              Book another session
            </button>
          </div>
        </div>

      /* ── Reschedule picker ── */
      ) : confirmed && rescheduling ? (
        <div className="booking-section__inner booking-section__inner--reschedule">
          <div className="reschedule-header fade-up">
            <div className="section-tag">Reschedule</div>
            <p className="reschedule-header__note">
              Pick a new date and time for your <strong>{confirmedDetails?.service}</strong>.
              Your Google Calendar invite will be updated automatically.
            </p>
            <button className="reschedule-header__cancel" onClick={() => setRescheduling(false)}>
              ← Keep original time
            </button>
          </div>
          {renderCalendar(handleRescheduleSubmit, 'Confirm new time →', rescheduling_, rescheduleError)}
        </div>

      /* ── Normal booking picker ── */
      ) : (
        <div className="booking-section__inner">
          <div className="service-select fade-up fade-up-delay-1">
            <div className="service-select__label">Select a service</div>
            {SERVICES.map((s, i) => (
              <button key={s.name} className={`svc-option${selSvc === i ? ' svc-option--active' : ''}`} onClick={() => setSelSvc(i)}>
                <div>
                  <div className="svc-option__name">{s.name}</div>
                  <div className="svc-option__dur">{s.duration}</div>
                </div>
                <div className="svc-option__price">{s.price}</div>
              </button>
            ))}
          </div>
          {renderCalendar(handleConfirmClick, 'Confirm Booking →', false, '')}
        </div>
      )}

      {/* ── Detail modal ── */}
      {showModal && (
        <div className="modal-overlay" onClick={handleModalClose} role="dialog" aria-modal="true">
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal__close" onClick={handleModalClose} aria-label="Close" disabled={submitting}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <div className="modal__header">
              <div className="modal__tag">Almost there</div>
              <h3 className="modal__title">Complete your booking</h3>
              <div className="modal__booking-summary">
                <span className="modal__svc">{SERVICES[selSvc].name}</span>
                <span className="modal__dot">·</span>
                <span>{MONTHS[month]} {selDay}, {year}</span>
                <span className="modal__dot">·</span>
                <span>{selSlot}</span>
              </div>
            </div>
            <div className="modal__body">
              <div className="modal__row modal__row--2">
                <div className="modal__field">
                  <label className="modal__label">Full Name</label>
                  <input className={`modal__input${formErrors.name ? ' modal__input--error' : ''}`} type="text" name="name" placeholder="Jane Smith" value={formData.name} onChange={handleInputChange} disabled={submitting} />
                  {formErrors.name && <span className="modal__error">{formErrors.name}</span>}
                </div>
                <div className="modal__field">
                  <label className="modal__label">Email Address</label>
                  <input className={`modal__input${formErrors.email ? ' modal__input--error' : ''}`} type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleInputChange} disabled={submitting} />
                  {formErrors.email && <span className="modal__error">{formErrors.email}</span>}
                </div>
              </div>
              <div className="modal__field">
                <label className="modal__label">Mobile Number</label>
                <input className={`modal__input${formErrors.mobile ? ' modal__input--error' : ''}`} type="tel" name="mobile" placeholder="+1 (555) 000-0000" value={formData.mobile} onChange={handleInputChange} disabled={submitting} />
                {formErrors.mobile && <span className="modal__error">{formErrors.mobile}</span>}
              </div>
              <div className="modal__field">
                <label className="modal__label">What would you like to discuss?</label>
                <textarea className={`modal__textarea${formErrors.description ? ' modal__input--error' : ''}`} name="description" placeholder="Briefly describe your situation, goals, or questions for this session…" rows={4} value={formData.description} onChange={handleInputChange} disabled={submitting} />
                {formErrors.description && <span className="modal__error">{formErrors.description}</span>}
              </div>
              {submitError && <div className="modal__submit-error">{submitError}</div>}
              <button className="modal__submit" onClick={handleSubmit} disabled={submitting}>
                {submitting ? <span className="modal__spinner" /> : 'Confirm Booking →'}
              </button>
              <p className="modal__privacy">Your details are kept private and used solely to confirm your session.</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
