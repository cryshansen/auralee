import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLoading } from "../context/LoadingContext";
import { useSiteContent } from "../context/SiteContentContext";
import "./available-times.css"; // custom styling if needed

export default function AvailableTimes() {
  const { availableTimes: atConfig } = useSiteContent();
  const enabledSlots = (atConfig?.slots ?? []).filter(s => s.enabled);
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
          {enabledSlots.filter(s => parseInt(s.value) < 12).map((s, i) => (
            <div className="col-sm-2" key={s.value}>
              <input
                type="radio"
                id={`control_m${i}`}
                name="select"
                value={s.value}
                disabled={availableTimes.includes(s.value)}
                onChange={() => setSelectedTime(s.value)}
              />
              <label htmlFor={`control_m${i}`}>{s.label}</label>
            </div>
          ))}
        </div>

        <p>Afternoon</p>
        <div className="row">
          {enabledSlots.filter(s => parseInt(s.value) >= 12).map((s, i) => (
            <div className="col-sm-2" key={s.value}>
              <input
                type="radio"
                id={`control_a${i}`}
                name="select"
                value={s.value}
                disabled={availableTimes.includes(s.value)}
                onChange={() => setSelectedTime(s.value)}
              />
              <label htmlFor={`control_a${i}`}>{s.label}</label>
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
