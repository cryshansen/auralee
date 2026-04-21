<<<<<<< HEAD
=======

# auralee.ca

>>>>>>> 5438d79
# Zackly-Rite Appointment Booking App

This is a single-page React application designed for booking appointments with Zackly-Rite Massage Therapy. It allows users to select a date, view available time slots in real-time, and submit their contact details securely as a seamless end-to-end flow for scheduling service.  It features a dynamic calendar interface to select available dates, retrieves real-time booked time slots from a PHP-based backend via RESTful API, and prevents double-booking through conditional slot disabling. The app uses react-router-dom for navigation, react-hook-form combined with Yup for schema-based form validation, and integrates Google reCAPTCHA v2 with a custom React hook for bot prevention. Additionally, it leverages React Helmet for managing page metadata, improving SEO and accessibility. Built with modular components and .env configuration for endpoint flexibility, the app is optimized for deployment in modern front-end stacks.


 The app communicates with a PHP-based RESTful API to manage appointments and prevent double-booking. The backend connects to the `Bookit App Platform` hosted on EC2 to post appointments. 



---

## 🚀 Features

- 📅 Interactive calendar to select booking dates
- ⏰ Dynamic timeslot availability fetched from the backend
- ❌ Disables already-booked time slots to avoid conflicts
- 📋 Booking form with validation using `react-hook-form` and `Yup`
- 🤖 Google reCAPTCHA v2 integration via a custom React hook
- 🔐 Confirmation system with unique token assignment
- 🌐 SEO-friendly using `React Helmet`
- 💡 `.env` configuration for flexible API endpoints

---

## 🛠️ Tech Stack

| Layer        | Technology                  |
|-------------|------------------------------|
| Frontend     | React, Vite                 |
| Routing      | React Router DOM            |
| Forms        | react-hook-form, Yup        |
| HTTP         | Fetch API                   |
| CAPTCHA      | Google reCAPTCHA v2         |
| Meta Tags    | React Helmet                |
| Backend API  | PHP (REST)                  |
| Deployment   | Vercel / Netlify (suggested)|

---

## 📁 Project Structure

/src
│
├── components/
│   ├── Calendar.jsx
│   ├── AvailableTimes.jsx
│   └── BookingDetails.jsx
│
├── hooks/
│   └── useRecaptcha.js
│
├── styles/
│   └── booking.css
│
├── App.jsx
├── main.jsx
└── routes.jsx


🧪 TODOs
 Add unit tests for form validation

 Add calendar navigation (month/year)

 Admin dashboard for managing bookings

 Dark mode toggle# auralee.ca
<<<<<<< HEAD
=======

>>>>>>> 5438d79
