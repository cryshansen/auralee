import { useState, useEffect } from "react";
import Calendar from "./Calendar";
import { useSiteContent } from "../context/SiteContentContext";
import { getSlotsForDay, dayNameFromDate } from "../config/slotUtils";

const OLIVE     = "#a2ab4e";
const TURQUOISE = "#2e9083";

export default function BookingModal({ show, onClose }) {
  const { availableTimes, hours } = useSiteContent();

  const [step, setStep]           = useState("calendar"); // "calendar" | "form" | "done"
  const [pickedDate, setPickedDate] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [startTime, setStartTime] = useState("");

  // contact fields
  const [name, setName]     = useState("");
  const [email, setEmail]   = useState("");
  const [phone, setPhone]   = useState("");
  const [website, setWebsite] = useState(""); // honeypot

  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  // reset whenever modal opens
  useEffect(() => {
    if (show) {
      setStep("calendar");
      setPickedDate("");
      setBookedSlots([]);
      setStartTime("");
      setName(""); setEmail(""); setPhone(""); setWebsite("");
      setError("");
    }
  }, [show]);

  const handleDatePicked = (dateStr) => {
    setPickedDate(dateStr);
    setStartTime("");
    setError("");
    // fetch already-booked slots for that date so we can disable them
    fetch(`/api/appoint/day/${dateStr}`, { credentials: "include" })
      .then(res => res.ok ? res.json() : [])
      .then(appts => {
        const times = (Array.isArray(appts) ? appts : []).map(a => a.timeslot?.slice(0, 5));
        setBookedSlots(times);
      })
      .catch(() => setBookedSlots([]))
      .finally(() => setStep("form"));
  };

  const goBack = () => { setStep("calendar"); setError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (website) return; // honeypot triggered
    if (!startTime) { setError("Please select a time slot."); return; }
    if (!name.trim()) { setError("Your name is required."); return; }
    if (!email.trim()) { setError("Email is required."); return; }

    setLoading(true); setError("");
    try {
      const res = await fetch("/api/appoint/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email, phone,
          date: pickedDate,
          startTime: `${startTime}:00`,
          serviceName: "",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Something went wrong. Please try again.");
      } else {
        setStep("done");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  const isCalendar = step === "calendar";
  const isDone     = step === "done";

  const enabledSlots   = getSlotsForDay(dayNameFromDate(pickedDate), hours, availableTimes).filter(s => s.enabled);
  const morningSlots   = enabledSlots.filter(s => parseInt(s.value) < 12);
  const afternoonSlots = enabledSlots.filter(s => parseInt(s.value) >= 12);

  return (
    <div style={overlayStyle} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: "white",
        borderRadius: "1rem",
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        width: "100%",
        maxWidth: isCalendar ? "820px" : "520px",
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        transition: "max-width 250ms ease",
      }}>
        {/* Accent top bar */}
        <div style={{ height: "5px", backgroundColor: OLIVE, flexShrink: 0 }} />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "1.25rem 2rem", borderBottom: `1px solid ${OLIVE}33`, flexShrink: 0 }}>
          {!isCalendar && !isDone && (
            <button onClick={goBack} title="Back to calendar" style={backBtnStyle(TURQUOISE)}>
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 600, fontSize: "0.9rem", color: "#111" }}>
              {isCalendar && "Select a Date"}
              {step === "form" && (pickedDate ? `Book a Session — ${pickedDate}` : "Book a Session")}
              {isDone && "Booking Requested!"}
            </p>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "#888", marginTop: "2px" }}>
              {isCalendar && "Pick an available date to continue"}
              {step === "form" && "Choose a time and enter your details"}
              {isDone && "We'll confirm your appointment shortly."}
            </p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "1.4rem", color: "#999", cursor: "pointer", lineHeight: 1, padding: "0 4px" }}>&times;</button>
        </div>

        {/* Step 1: Calendar */}
        {isCalendar && (
          <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
            <Calendar onDateSelect={handleDatePicked} />
          </div>
        )}

        {/* Step 2: Time + Form */}
        {step === "form" && (
          <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem 2rem 2rem" }}>
            <form onSubmit={handleSubmit} noValidate>

              {/* Honeypot */}
              <input type="text" value={website} onChange={e => setWebsite(e.target.value)}
                autoComplete="off" tabIndex="-1" aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }} />

              {/* Time slot selection */}
              <div className="mb-4">
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: TURQUOISE, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "0.5rem" }}>
                  Select a Time
                </label>
                {[["Morning", morningSlots], ["Afternoon", afternoonSlots]].map(([label, group]) => (
                  <div key={label} className="mb-2">
                    <small style={{ color: "#999", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</small>
                    <div className="d-flex flex-wrap gap-2 mt-1">
                      {group.map(s => {
                        const taken    = bookedSlots.includes(s.value);
                        const selected = startTime === s.value;
                        return (
                          <button key={s.value} type="button" disabled={taken} onClick={() => setStartTime(s.value)}
                            style={{
                              padding: "0.35rem 0.85rem",
                              borderRadius: "6px",
                              fontSize: "0.8rem",
                              fontWeight: 500,
                              border: `1px solid ${taken ? "#e5e7eb" : selected ? OLIVE : OLIVE + "99"}`,
                              backgroundColor: taken ? "#f3f4f6" : selected ? OLIVE : "white",
                              color: taken ? "#9ca3af" : selected ? "white" : "#333",
                              cursor: taken ? "not-allowed" : "pointer",
                              textDecoration: taken ? "line-through" : "none",
                            }}>
                            {s.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <hr style={{ borderColor: OLIVE + "33" }} />

              {/* Contact fields */}
              <div className="mb-3">
                <label className="form-label" style={{ fontSize: "0.8rem", fontWeight: 600, color: "#333" }}>Full Name</label>
                <input className="form-control form-control-sm" placeholder="Jane Smith" required
                  value={name} onChange={e => setName(e.target.value)} style={{ borderColor: OLIVE }} />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ fontSize: "0.8rem", fontWeight: 600, color: "#333" }}>Email</label>
                <input type="email" className="form-control form-control-sm" placeholder="you@example.com" required
                  value={email} onChange={e => setEmail(e.target.value)} style={{ borderColor: OLIVE }} />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ fontSize: "0.8rem", fontWeight: 600, color: "#333" }}>Phone</label>
                <input className="form-control form-control-sm" placeholder="306-555-0100"
                  value={phone} onChange={e => setPhone(e.target.value)} style={{ borderColor: OLIVE }} />
              </div>

              {error && <p style={{ color: "#dc2626", fontSize: "0.85rem" }}>{error}</p>}

              <div className="d-flex justify-content-end gap-2 mt-3">
                <button type="button" onClick={onClose}
                  style={{ padding: "0.45rem 1.1rem", borderRadius: "6px", border: `1px solid #ccc`, background: "white", fontSize: "0.85rem", cursor: "pointer" }}>
                  Cancel
                </button>
                <button type="submit" disabled={loading}
                  style={{ padding: "0.45rem 1.1rem", borderRadius: "6px", border: "none", background: TURQUOISE, color: "white", fontSize: "0.85rem", cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
                  {loading ? "Sending…" : "Request Booking"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Done */}
        {isDone && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>🌿</div>
            <h5 style={{ color: TURQUOISE, marginBottom: "0.5rem" }}>Booking Requested!</h5>
            <p style={{ color: "#555", marginBottom: "0.25rem" }}>{pickedDate} at {startTime}</p>
            <p style={{ color: "#888", fontSize: "0.85rem" }}>Aura-Lee will confirm your appointment by email.</p>
            <button onClick={onClose} className="btn btn-primary mt-3" style={{ background: OLIVE, borderColor: OLIVE }}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function backBtnStyle(color) {
  return {
    background: "none",
    border: "none",
    color,
    cursor: "pointer",
    padding: "4px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };
}

const overlayStyle = {
  position: "fixed",
  inset: 0,
  zIndex: 9999,
  background: "rgba(0,0,0,0.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "1rem",
};
