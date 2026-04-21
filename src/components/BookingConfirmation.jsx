import { useSearchParams, useNavigate } from "react-router-dom";
import GenerateConfirmationPDF from './GenerateConfirmationPDF';

export default function BookingConfirmation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const bdate = searchParams.get("bdate") || "N/A";
  const time = searchParams.get("time") || "N/A";
  const email = searchParams.get("email") || "client@example.com";
  const fname = searchParams.get("fname") || "First";
  const name = searchParams.get("name") || "Last";
  const confirmno = searchParams.get("confirmno") || Math.floor(Math.random() * 1000000);

  const handleSignOut = () => {
    alert("Great! See you soon.");
    navigate("/"); // redirect to homepage
  };

  return (
    <div className="container my-5">
      <h3>Confirmation</h3>
      <div className="" style={{  position: 'relative', justifyContent: 'end', display: 'flex', top: '-30px'}}>
          <button
          type="button"
            className="btn btn-secondary"
            onClick={() =>
              GenerateConfirmationPDF({
                firstname: searchParams.get("fname"),
                lastname: searchParams.get("name"),
                email: searchParams.get("email"),
                phone: searchParams.get("phone"),
                date: searchParams.get("bdate"),
                time: searchParams.get("time"),
                confirmationNumber: searchParams.get("confirmno"),
              })
            }
          ><i className="fas fa-file-pdf"></i>
          </button>
        </div>
      <hr />
      
      <h4 className="text-center">Zackly-Rite Massage Therapy</h4>
      

      <div className="row justify-content-center my-4">
        <h6 className="text-center">Appointment Booked for</h6>
        <h5 className="text-center pb-3">
          {fname} {name}
        </h5>
        
      </div>

      <div className="border rounded p-3 mb-3">
        <h5>Booked Appointment</h5>
        <p className="text-muted mb-1">
          Time: <strong>{bdate} {time}</strong>
        </p>
      </div>

      <div className="border rounded p-3 mb-3">
        <h5>Confirmation Message</h5>
        <p className="text-muted mb-1">
          Your confirmation number is: <strong>{confirmno}</strong>.
          <br />You will be emailed with your appointment booking details.
        </p>
      </div>

      <div className="border rounded p-3 mb-3">
        <h5>Emailed</h5>
        <p className="text-muted mb-1">
          Booking confirmation has been sent to <strong>{email}</strong>
        </p>
      </div>

      <div className="modal-footer d-flex flex-column justify-content-center border-0">
        <p className="text-muted">See you soon!</p>
        <button onClick={handleSignOut} className="btn btn-primary mt-2">
          Back Home
        </button>
      </div>
    </div>
  );
}
