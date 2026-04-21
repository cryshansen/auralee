import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./calendar.css";




// onDateSelect: optional callback(dateStr) used by modal; without it, navigates to /available
export default function Calendar({ onDateSelect }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState("");
  const [bookedDates, setBookedDates] = useState({});
  const navigate = useNavigate();
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const yearRange = Array.from({ length: 2 }, (_, i) => today.getFullYear() + i);

  useEffect(() => {
    const year = currentYear;
    const month = currentMonth + 1;

    const monthStr = `${year}-${String(month).padStart(2, "0")}`;
    fetch(`/api/appoint/month/${monthStr}`, { credentials: "include" })
      .then(res => res.ok ? res.json() : [])
      .then(dates => {
        // Backend returns Set<String> of date strings — convert to count map (1 per date)
        const counts = {};
        (Array.isArray(dates) ? dates : []).forEach(d => { counts[d] = (counts[d] || 0) + 1; });
        setBookedDates(counts);
      })
      .catch(() => setBookedDates({}));
  }, [currentMonth, currentYear]);

  const daysInMonth = (month, year) =>
    new Date(year, month + 1, 0).getDate();

  const handleDayClick = (day, month, year) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateStr);
    if (onDateSelect) {
      onDateSelect(dateStr);
    } else {
      navigate(`/available?bdate=${dateStr}`);
    }
  };

  const renderCalendarDays = () => {
    const days = [];
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const totalDays = daysInMonth(currentMonth, currentYear);
    const startDay = firstDayOfMonth.getDay();

    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const prevMonthDays = daysInMonth(prevMonth, prevYear);

    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;

    for (let i = startDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      /*const isBeforeThisMonth = currentYear < today.getFullYear() ||
        (currentYear === today.getFullYear() && currentMonth < today.getMonth());*/
      const isBeforeToday = new Date(prevYear, prevMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
      const isThisMonthInPast = currentYear < today.getFullYear() ||
        (currentYear === today.getFullYear() && currentMonth < today.getMonth());

      const isDisabled = isBeforeToday || isThisMonthInPast;

      days.push(
        <div
          key={`prev-${day}`}
          className={`day other-month ${isDisabled ? 'disabled' : 'clickable'}`}
          onClick={() => {
            if (!isDisabled) {
              setCurrentMonth(prevMonth);
              setCurrentYear(prevYear);
            }
          }}
          aria-disabled={isDisabled}
          title={isDisabled ? "Can't book past dates" : "Go to previous month"}
        >
          {day}
        </div>
      );
    }

    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(currentYear, currentMonth, d);
      const isToday =
        d === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear();
      const isPast =
        date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const bookingCount = bookedDates[dateStr] || 0;

      let className = "day";
     if (isWeekend) {
        className += " taken weekend";
      } else if (bookingCount >= 4) {
        className += " heavy-booked";
      } else if (bookingCount >= 2) {
        className += " medium-booked";
      } else if (bookingCount === 1) {
        className += " light-booked";
      } else {
        className += " available";
      }

      if (isPast || isWeekend) {
        className += " disabled";
      } else {
        className += " clickable";
      }
      if (isToday) className += " today";
   
      days.push(
        <div
          key={`current-${d}`}
          className={className}
          onClick={!isPast ? () => handleDayClick(d, currentMonth, currentYear) : undefined}
          aria-disabled={isPast}
        >
          {d}
        </div>
      );
    }

    const totalSlots = days.length;
    const nextDaysToFill = totalSlots % 7 === 0 ? 0 : 7 - (totalSlots % 7);

    for (let i = 1; i <= nextDaysToFill; i++) {
      days.push(
        <div
          key={`next-${i}`}
          className="day taken clickable"
          onClick={() => {
              setCurrentMonth(nextMonth);
              setCurrentYear(nextYear);
            } 
          }
          title="See next month"
        >
          {i}
        </div>
      );
    }

    return days;
  };

  return (
    <>
      <div className="calendar" id="calendar">
        <div className="calendar-header d-flex align-items-center justify-content-between">
          <select
            className="form-select w-auto btn btn-primary border-0 px-5"
            value={currentMonth}
            onChange={(e) => setCurrentMonth(Number(e.target.value))}
          >
            {months.map((month, i) => {
              const isPastMonth =
                currentYear === today.getFullYear() && i < today.getMonth();
              return (
                <option key={month} value={i} disabled={isPastMonth}>
                  {month}
                </option>
              );
            })}
          </select>

          <select
            className="form-select w-auto btn btn-primary  border-0 px-5"
            value={currentYear}
            onChange={(e) => setCurrentYear(Number(e.target.value))}
          >
            {yearRange.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="calendar-dates mt-3">
          <div className="days">
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
              <div key={day} className="day label">{day}</div>
            ))}
          </div>
          <div id="calendarDays" className="days">
            {renderCalendarDays()}
          </div>
        </div>
      </div>

      <div className="clearfix"></div>

      <div className="calendar-legend container mt-5">
        <h6 className="mb-2"><small>Booking Status Legend:</small></h6>
        <ul className="list-inline text-muted">
          <li className="list-inline-item">
            <small><span className="legend-box bg-white border pe-1 me-1"></span> Empty / Available</small>
          </li>
          <li className="list-inline-item">
             <small><span className="legend-box light-booked pe-2 me-2"></span> Lightly Booked</small>
          </li>
          <li className="list-inline-item">
             <small><span className="legend-box heavy-booked text-white pe-2 me-2"></span> Heavily Booked</small>
          </li>
          <li className="list-inline-item">
             <small><span className="legend-box disabled text-white pe-2 me-2"></span> Past Month Day</small>
          </li>
        </ul>
      </div>

      <div className="clearfix"></div>

    </>
  );
}
