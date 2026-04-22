import { createContext, useContext, useState, useEffect } from "react";

// Defaults mirror the current hardcoded content — the site works even before
// Aura Lee publishes anything via the fluxo-app.ca admin panel.
const DEFAULT = {
  studioName: "Aura-Lee Massage Therapy",
  about: {
    heading: "Aura-Lee Zack, Registered Massage Therapist",
    body:
      "Taking care of your wellbeing is very essential in this busy, stressful world. Massage therapy can be part of your self-care, as it is helpful in decreasing stress and anxiety, relieving pain, offset improper ergonomics and poor posture, improve range of motion and mobility to make everyday activities easier, while aiding in rehabilitation of physical injuries.\n\nI have been committed to excellence since establishing my clinic in 1997 within a professional, tranquil and safe environment. The target of my treatments is of a therapeutic nature, although I also offer a spectrum of soft tissue specialized techniques such as Hot Stone massage, myofascial work and cupping massage to assist you in reaching your health goals. I look forward to helping with your wellness plan, so you can get closer to your best again.",
  },
  contact: {
    phone: "306 745-9085",
    email: "aura-lee@auralee.ca",
    address: "Prairie Sky Integrative Health\n2146 Robinson St, Regina, SK S4T 2P7",
  },
  hours: [
    { day: "Monday",    open: "09:00",  close: "17:00", closed: false },
    { day: "Tuesday",   open: "09:00",  close: "17:00", closed: false },
    { day: "Wednesday", open: "09:00",  close: "17:00", closed: false },
    { day: "Thursday",  open: "09:00",  close: "17:00", closed: false },
    { day: "Friday",    open: "09:00",  close: "17:00", closed: false },
    { day: "Saturday",  open: "",      close: "",      closed: true  },
    { day: "Sunday",    open: "",      close: "",      closed: true  },
  ],
  availableTimes: {
    duration: 60,
    slots: [
      { value: "09:00", label: "9:00 AM",  enabled: true },
      { value: "10:00", label: "10:00 AM", enabled: true },
      { value: "11:00", label: "11:00 AM", enabled: true },
      { value: "13:00", label: "1:00 PM",  enabled: true },
      { value: "14:00", label: "2:00 PM",  enabled: true },
      { value: "15:00", label: "3:00 PM",  enabled: true },
      { value: "16:00", label: "4:00 PM",  enabled: true },
      { value: "17:00", label: "5:00 PM",  enabled: true },
    ],
  },
  contentBlocks: {
    blocks: [
      {
        id: 1,
        heading: "The Treatment",
        body: "Sometimes life throws punches your way (that actually do hurt). Poor posture, insufficient exercise, overwork or injury are some of the circumstances that lead to discomfort, pain, restriction in mobility and more. Hands on techniques are used to manipulate soft tissues (muscles, connective tissue, fascia, etc) to provide therapeutic relief of the conditions, which can also compliment other modalities to speed up the recovery process and obtain the best possible outcome. As part of the treatment, I may include instruction of self-administered pain management techniques such as stretching, strengthening exercises, use of heat or cold, as strategies to try to keep bodies maintained and running as smoothly as possible.",
      },
      {
        id: 2,
        heading: "Company Background",
        body: "Owner and operator/Registered Massage Therapist, Aura-Lee Zack created and registered the company in 1997. The clinic is designed and managed by Aura. She aims to create a professional, clinical, yet relaxing space. Her target market includes any individual that reside in Esterhazy, Saskatchewan and surrounding area, specifically those with physical ailments and those interested in integrative medicine.",
      },
      {
        id: 3,
        heading: "Mission Statement",
        body: "Dedication is given to provide an effective treatment in a safe and caring environment, as I strive to restore, maintain and encourage optimal health and to provide an opportunity to be part of the client's wellness plan for their best quality of life.",
      },
    ],
  },
};

// Shallow-deep merge: arrays are replaced wholesale (not appended),
// objects are merged recursively, nulls/empty strings keep the default.
function merge(defaults, override) {
  if (!override || typeof override !== "object") return defaults;
  const result = { ...defaults };
  for (const key of Object.keys(override)) {
    const val = override[key];
    if (val === null || val === undefined) continue;
    if (Array.isArray(val)) {
      result[key] = val.length > 0 ? val : defaults[key];
    } else if (typeof val === "object") {
      result[key] = merge(defaults[key] ?? {}, val);
    } else if (val !== "") {
      result[key] = val;
    }
  }
  return result;
}

const SiteContentContext = createContext(DEFAULT);

export function SiteContentProvider({ children }) {
  const [siteContent, setSiteContent] = useState(DEFAULT);

  useEffect(() => {
    fetch("/api/public/landing")
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        console.log("[SiteContent] raw API response:", JSON.stringify(data, null, 2));
        const page = data?.data?.page;
        if (page) {
          const merged = merge(DEFAULT, page);
          console.log("[SiteContent] merged hours:", JSON.stringify(merged.hours));
          console.log("[SiteContent] merged availableTimes:", JSON.stringify(merged.availableTimes));
          setSiteContent(merged);
        } else {
          console.warn("[SiteContent] no page in response, using defaults");
          console.log("[SiteContent] default hours:", JSON.stringify(DEFAULT.hours));
          console.log("[SiteContent] default availableTimes:", JSON.stringify(DEFAULT.availableTimes));
        }
      })
      .catch(err => console.error("[SiteContent] fetch error:", err));
  }, []);

  return (
    <SiteContentContext.Provider value={siteContent}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
