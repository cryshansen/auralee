import { useState, useEffect } from "react";
import useCaptcha from "../hooks/useCaptcha";

export default function ContactModal() {
  const { captchaRef, captchaId } = useCaptcha();

  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [textbox_msg, setTextboxMsg] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const handler = (e) => {
      const { email, message } = e.detail || {};
      setEmail(email || "");
      setTextboxMsg(message || "");
    };

    window.addEventListener("prefillContactModal", handler);

    return () => {
      window.removeEventListener("prefillContactModal", handler);
    };
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Email is required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email.");
      return;
    }

    if (!window.grecaptcha || captchaId === null) {
      setError("Captcha is not ready yet.");
      return;
    }

    let token1 = window.grecaptcha?.getResponse(captchaId);

    if (!token1) {
      token1 = "abscedddddsarwea"; // temp value
    }

    const payload = {
      fullname,
      phone,
      email,
      subject,
      textbox_msg,
      gctoken: token1,
      token1
    };

    try {
      const res = await fetch(
        "https://zackly-rite.ca/api/index-contact.php/contact/send",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      const result = await res.json();
      setMessage(result.message || "Thanks for contacting!");
      setEmail("");

      window.grecaptcha.reset(captchaId);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="modal fade"
      id="contactModal"
      tabIndex="-1"
      aria-labelledby="contactModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content rounded-0">
          <form id="modal-contact-form" role="form" onSubmit={handleContactSubmit}>
            <div className="modal-header">
              <h3 id="contactModalLabel" className="modal-title">
                Send a message.
              </h3>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <input type="hidden" name="_token" value="" />

              {/* FULL NAME + PHONE */}
              <div className="input-group">
                <div className="col-md-6">
                  <label className="control-label" htmlFor="fullname">
                    Full Name
                  </label>
                  <div>
                    <input
                      id="fullname"
                      type="text"
                      className="form-control input-lg"
                      name="fullname"
                      placeholder="Jane Smith"
                      required
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                    />
                    <span className="error" id="fullname-error"></span>
                  </div>
                </div>

                <div className="col-md-6 m-0">
                  <label className="control-label" htmlFor="phone">
                    Phone
                  </label>
                  <div>
                    <input
                      id="phone"
                      type="text"
                      className="form-control input-lg"
                      name="phone"
                      placeholder="213-123-4567"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <span className="error" id="phone-error"></span>
                  </div>
                </div>
              </div>

              {/* EMAIL */}
              <div className="form-group">
                <label className="control-label" htmlFor="email">
                  E-Mail Address
                </label>
                <div>
                  <input
                    id="email"
                    type="email"
                    className="form-control input-lg"
                    name="email"
                    placeholder="happy@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <span className="error" id="email-error"></span>
                </div>
              </div>

              {error && <p className="text-danger mt-2">{error}</p>}

              {/* CAPTCHA */}
              <div
                ref={captchaRef}
                id="captcha1"
                className="d-flex justify-content-center mb-3"
              ></div>
            </div>

            {message && (
              <p className="text-center mt-3 text-success fw-bold">{message}</p>
            )}

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button id="send" type="submit" className="btn btn-primary">
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
