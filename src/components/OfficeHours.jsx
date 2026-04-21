import  Reac, {useState} from "react";

import Calendar from './Calendar';
import ContactModal from "./ContactModal";

export default function OfficeHours() {
const [isMapLoading, setIsMapLoading] = useState(true);
  const api_key = "AIzaSyARwoHfwrESwOLdt_gEAkSutmQVifgMoxc";
  const mapAddress = "Prairie Sky Integrative Health, 2146 Robinson St, Regina, Sk S4T 2P7";
  const encodedAddress = encodeURIComponent(mapAddress);
  
  // Use HTTPS to ensure the iframe onLoad event fires correctly
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${api_key}&q=${encodedAddress}`;
  const mapAddressBox = "Prairie Sky Integrative Health, <br /> 2146 Robinson St, Regina, Sk S4T 2P7";
  // Styles for the new address box
  const addressBoxStyle = {
    backgroundColor: '#f8f9fa',
    borderLeft: '4px solid #a2ab4e', // Using your olive brand color
    padding: '15px',
    marginTop: '20px',   
    marginBottom: '20px',
    borderRadius: '4px',
    fontSize: '1.35rem',
    color: '#4a4a4a',
    lineHeight: '1.4'
  };

  const mapContainerStyle = {
    position: 'relative',
    width: '95%',
    height: '220px', // Smaller height for the side-panel view
    marginTop: '20px',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#eee'
  };

  const localSpinnerStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 5
  };

  return (
    <>
    <section id="booking-section" className="mb-5">
      <div className="row">
        <div className="col-lg-6">
          <div className="officeHrs mt-4">
            <h4 className="turquois">Office Hours <span className="small">(BY APPOINTMENT ONLY)</span></h4>
            <ul className="hours mt-4 mx-md-5">
              <li>Monday: 9:00 – 5:00</li>
              <li>Tuesday: 9:00 – 5:00</li>
              <li>Wednesday: 9:00 – 5:00</li>
              <li>Thursday: 9:00 – 5:00</li>
              <li>Friday: 9:00 – 5:00</li>
              <li className="mt-2 text-muted">Closed Saturday, Sunday & Holidays</li>
            </ul>

            {/* Address Block */}
            <div style={addressBoxStyle} className="mx-md-4">
              <p><strong className="olive" style={{ display: 'block', marginBottom: '5px' }}>Location:</strong>
              {mapAddressBox.split('<br />').map((line, index) => (
                <span key={index}>{line}<br /></span>
              ))}
              </p>
            </div>

            {/* In-page Map View */}
            <div style={mapContainerStyle} className="mx-md-4">
              {isMapLoading && (
                <div style={localSpinnerStyle}>
                   <div className="spinner" style={{ border: '3px solid #f3f3f3', borderTop: '3px solid #a2ab4e', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite' }}></div>
                   <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
              )}
              <iframe
                title="Aura-Lee Massage Location"
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0, opacity: isMapLoading ? 0 : 1, transition: 'opacity 0.3s ease' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={() => setIsMapLoading(false)}
              ></iframe>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <Calendar />
        </div>
      </div>
    </section>
    </>
  );
}
