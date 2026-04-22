export function toMinutes(timeStr) {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

export function toHHMM(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function fmt12(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const p = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${p}`;
}

export function generateDaySlots(open, close, durationMins) {
  if (!open || !close || !durationMins) return [];
  const start = toMinutes(open);
  const end   = toMinutes(close) - durationMins;
  if (start == null || end == null || end < start) return [];
  const result = [];
  for (let t = start; t <= end; t += durationMins) {
    result.push(toHHMM(t));
  }
  return result;
}

export function getSlotsForDay(dayName, hours, availableTimes) {
  const { duration = 60, mode = "auto", overrides = {}, slots = [] } =
    availableTimes ?? {};

  const dayRow = Array.isArray(hours)
    ? hours.find((r) => r.day === dayName)
    : null;

  if (mode !== "auto") {
    return slots.map((s) => ({
      value:   s.value,
      label:   fmt12(s.value),
      enabled: !!s.enabled,
    }));
  }

  if (!dayRow || dayRow.closed) return [];

  const raw = generateDaySlots(dayRow.open, dayRow.close, duration);
  const dayOverrides = overrides[dayName] ?? {};

  return raw.map((v) => {
    const ov = dayOverrides[v];
    if (ov === false)           return { value: v,  label: fmt12(v),  enabled: false };
    if (typeof ov === "string") return { value: ov, label: fmt12(ov), enabled: true  };
    return                             { value: v,  label: fmt12(v),  enabled: true  };
  });
}

export function dayNameFromDate(dateStr) {
  const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split("-").map(Number);
  return DAYS[new Date(y, m - 1, d).getDay()];
}
