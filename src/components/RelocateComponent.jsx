import React, {useState , useEffect} from 'react';
import BookingModal from './BookingModal';


export default function RelocateComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
 const [isMapLoading, setIsMapLoading] = useState(true); // Local loading state
 const api_key="AIzaSyARwoHfwrESwOLdt_gEAkSutmQVifgMoxc";
 //"Prairie Sky Integrative Health, 2146 Robinson St, Regina, Sk S4T 2P7";const address = "Prairie Sky Integrative Health, 2146 Robinson St, Regina, Sk S4T 2P7";
 // Replace this with your actual new clinic address
  const mapAddress ="Prairie Sky Integrative Health, 2146 Robinson St, Regina, Sk S4T 2P7";
  const encodedAddress = encodeURIComponent(mapAddress);
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${api_key}&q=${encodedAddress}`;

  /// Trigger spinner when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setIsMapLoading(true);
    }
  }, [isModalOpen]);

 
  
  // Update this to the new clinic address for the text display
  const newAddress = "Aura-Lee Massage Therapy, Prairie Sky Integrative Health, 2146 Robinson St, Regina, Sk S4T 2P7";
  // --- STYLES ---
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    zIndex: 1000,
  
  };

  const modalContentStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '600px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
  };
const mapBoxStyle = {
    position: 'relative', // Necessary to absolute position the spinner inside
    width: '100%',
    height: '400px',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    overflow: 'hidden'
  };

  const localSpinnerStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    zIndex: 5
  };



  return (
    <>
      <section className="rebrand-notice">
          <div className="container">
              <div className="notice-content">
                  <span className="label olive">Important Update</span>
                  <h2>We’ve Moved & Rebranded</h2>
                  <p className="pb-4" >
                      <strong className="turquois">Aura-Lee Massage Therapy</strong> is now
                      <strong className="turquois"> Aura-Lee Massage Therapy</strong>.
                  </p>
                  <p className="description pb-4">
                      We have officially relocated from Esterhazy, SK to our new professional clinic in <strong>Regina, SK</strong>. 
                      While our name and location have changed, our commitment to your wellness remains the same.
                  </p>
                  <div className="action-items">
                      <button className="btn-primary" onClick={() => setShowBookingModal(true)}>Book at New Location</button>
                      <button
                          onClick={() => setIsModalOpen(true)}
                          className="btn-secondary turquoise olive"
                        >
                          View New Location
                        </button>
                  </div>
              </div>
          </div>
      </section>
      <BookingModal show={showBookingModal} onClose={() => setShowBookingModal(false)} />
      {/* --- MODAL OVERLAY --- */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)} style={modalOverlayStyle}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={modalContentStyle}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <h3 style={{ margin: 0 }}>Our New Clinic</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer', 'color' : '#000' }}>&times;</button>
            </div>
            
            <div className="map-container" style={{ width: '100%', height: '400px', backgroundColor: '#eee' }}>
            
            {/* LOCAL SPINNER - Only shows when isMapLoading is true */}
              {isMapLoading && (
                <div style={localSpinnerStyle}>
                  <div className="spinner" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #5f5f5b', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
                  <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                  <span style={{ fontSize: '0.8rem', color: '#888' }}>Loading Map...</span>
                </div>
              )}
             <iframe
                title="Aura-Lee Massage Location"
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0, opacity: isMapLoading ? 0.5 : 1, transition: 'opacity 0.3s ease' }}
                allowFullScreen=""
                loading="eager"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={()=> setIsMapLoading(false)}
              ></iframe>            
              </div>
            
            <p style={{ marginTop: '15px', fontSize: '0.9rem', color: '#666' }}>
              {mapAddress}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
