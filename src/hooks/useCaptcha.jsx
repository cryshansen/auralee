import { useRef, useState, useEffect } from "react";

// ✅ Use your .env key
const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

// 🔒 Internal loading state
let scriptLoading = false;
let grecaptchaReady = false;
const grecaptchaReadyCallbacks = [];

function loadGrecaptcha(callback) {
  if (grecaptchaReady) return callback();

  grecaptchaReadyCallbacks.push(callback);

  if (!scriptLoading) {
    scriptLoading = true;

    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      const waitForGrecaptcha = setInterval(() => {
        if (window.grecaptcha && typeof window.grecaptcha.render === "function") {
          clearInterval(waitForGrecaptcha);
          grecaptchaReady = true;
          grecaptchaReadyCallbacks.forEach(cb => cb());
        }
      }, 100);
    };

    document.body.appendChild(script);
  }
}

export default function useCaptcha() {
  const captchaRef = useRef(null);
  const [captchaId, setCaptchaId] = useState(null);

  useEffect(() => {
    loadGrecaptcha(() => {
      if (captchaRef.current && captchaId === null) {
        // Prevent re-rendering into an already used container
        if (captchaRef.current.childNodes.length > 0) {
          console.warn("reCAPTCHA already rendered in element");
          return;
        }

        try {
          const id = window.grecaptcha.render(captchaRef.current, {
            sitekey: SITE_KEY,
          });
          setCaptchaId(id);
        } catch (e) {
          console.error("reCAPTCHA render error:", e);
        }
      }
    });
  }, [captchaId]);

  return { captchaRef, captchaId };
}
