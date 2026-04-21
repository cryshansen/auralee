import { useState, useEffect } from "react";
import useCaptcha from "../hooks/useCaptcha";
import { apiUrl } from "../config/api";

export default function ContactInquiryModal({ selectedDate, show, onClose, theme = { accent: "#007bff", dark: "#333" } }) {
  const [status, setStatus] = useState("idle"); // idle | success
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic for sending lead to backend/email goes here
    console.log("Lead captured:", { ...form, date: selectedDate });
    setStatus("success");
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button onClick={onClose} style={closeButtonStyle}>&times;</button>
        
        {status === "idle" ? (
          <div className="p-4">
            <h3 className="text-xl font-bold mb-2  turquois border-bottom pb-3" >
              Great to see you're exploring!
            </h3>
            <p className="text-md text-gray-600 mb-6">
              Our online calendar is currently under maintenance, but we'd love to help you book <span className="font-bold turquois">{selectedDate}</span>.<br /> <br />
              Give us a call at <span className="font-bold turquois"><a href="tel:+13067459085">306-745-9085</a></span>!
            </p>

            {/*<form onSubmit={handleSubmit} className="space-y-4">
              <input 
                required
                placeholder="Your Name"
                className="w-full border rounded-lg px-4 py-2"
                onChange={(e) => setForm({...form, name: e.target.value})}
              />
              <input 
                required
                type="email"
                placeholder="Email Address"
                className="w-full border rounded-lg px-4 py-2"
                onChange={(e) => setForm({...form, email: e.target.value})}
              />
              <textarea 
                placeholder="How can we help?"
                rows={3}
                className="w-full border rounded-lg px-4 py-2 resize-none"
                onChange={(e) => setForm({...form, message: e.target.value})}
              />
              <button 
                type="submit" 
                className="w-full py-3 rounded-lg text-white font-bold transition-transform active:scale-95"
                style={{ backgroundColor: theme.accent }}
              >
                Send Message
              </button>
            </form>
            */}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
            <p className="text-gray-500 mb-6">We'll be in touch shortly regarding {selectedDate}.</p>
            <button onClick={onClose} className="underline text-sm font-bold">Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed", inset: 0, zIndex: 10000,
  backgroundColor: "rgba(0,0,0,0.6)",
  display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
};

const modalStyle = {
  backgroundColor: "white", borderRadius: "1.25rem",
  width: "100%", maxWidth: "450px", position: "relative",
  padding: "2rem", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)"
};

const closeButtonStyle = {
  position: "absolute", top: "1rem", right: "1.5rem",
  fontSize: "2rem", color: "#aaa", border: "none", background: "none", cursor: "pointer"
};