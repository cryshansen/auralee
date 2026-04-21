import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLoading } from "../context/LoadingContext";
import "./available-times.css"; // custom styling if needed

export default function AvailableTimes() {
  const [searchParams] = useSearchParams();
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [formattedDate, setFormattedDate] = useState("");
  const [bdate, setBdate] = useState("");
  const navigate = useNavigate();

  const { showLoader, hideLoader } = useLoading();

  useEffect(() => {
    showLoader();
    const date = searchParams.get("bdate");
    if (!date) return;

    setBdate(date);

    const [year, month, day] = date.split("-");
    const dateObj = new Date(year, month - 1, day);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const displayDate = `${months[dateObj.getMonth()]} ${day}, ${year}`;
    setFormattedDate(displayDate);

    // Fetch booked slots for this date so we can disable them
    fetch(`/api/appoint/day/${date}`, { credentials: "include" })
      .then(res => res.ok ? res.json() : [])
      .then(appts => {
        const times = (Array.isArray(appts) ? appts : []).map(a => a.timeslot?.slice(0, 5));
        setAvailableTimes(times);
      })
      .catch(() => setAvailableTimes([]))
      .finally(() => hideLoader());

    }, [searchParams]);

    const handleBooking = () => {
        if (!selectedTime) {
            alert("Please select a time slot.");
            return;
        }
        const cotoken = getToken();
        navigate(`/booking?bdate=${bdate}&time=${selectedTime}&cotoken=${cotoken}`);
    };

  const getToken = () => {
    return Math.random().toString().split(".")[1];
  };

  return (
    <div className="container">
      <div className="header mt-5">
        <h3>What's Available</h3>
      </div>
      <hr />
      <div className="content_bod">
        <h3>{formattedDate}</h3>
        <h4>Available Appointments:</h4>

        <p>Morning</p>
        <div className="row">
          {["09:00", "10:00","11:00"].map((time, i) => (
            <div className="col-sm-2" key={time}>
              <input
                type="radio"
                id={`control_0${i + 1}`}
                name="select"
                value={time}
                disabled={availableTimes.includes(time)}
                onChange={() => setSelectedTime(time)}
              />
              <label htmlFor={`control_0${i + 1}`}>{time}</label>
            </div>
          ))}
        </div>

        <p>Afternoon</p>
        <div className="row">
          {["13:00", "14:00","15:00", "16:00", "17:00"].map((time, i) => (
            <div className="col-sm-2" key={time}>
              <input
                type="radio"
                id={`control_0${i + 3}`}
                name="select"
                value={time}
                disabled={availableTimes.includes(time)}
                onChange={() => setSelectedTime(time)}
              />
              <label htmlFor={`control_0${i + 3}`}>{time}</label>
            </div>
          ))}
        </div>

        <div className="row mt-4">
          <div className="col"></div>
          <div className="col center">
            <button className="btn btn-primary" title="Select a time!" onClick={handleBooking} disabled={ !selectedTime } >
              Book it!
            </button>
          </div>
          <div className="col"></div>
        </div>
      </div>
    </div>
  );
}
