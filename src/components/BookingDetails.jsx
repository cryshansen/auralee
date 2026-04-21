import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSearchParams, useNavigate } from "react-router-dom";

import './booking.css';

const schema = yup.object().shape({
  firstname: yup.string().required("First name is required"),
  lastname: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().matches(/^[\d\s\-()]+$/, "Invalid phone number").required("Phone is required"),
});

export default function BookingDetails() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const bdate = searchParams.get("bdate") || "";
  const time = searchParams.get("time") || "";
  const cotoken = searchParams.get("cotoken") || "";
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      bookeddate: bdate,
      bookedtime: time,
      cotoken: cotoken,
      gctoken: "",
    },
  });

  const onSubmit = (formData) => {
    // Honeypot: bots fill the hidden website field, humans never see it
    if (formData.website) return;

    const payload = {
      name:        `${formData.firstname} ${formData.lastname}`,
      email:       formData.email,
      phone:       formData.phone,
      date:        formData.bookeddate,
      startTime:   `${formData.bookedtime}:00`,
      serviceName: "",
    };

    fetch(`${baseUrl}/api/appoint/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        const { confirmationNumber } = data;
        navigate(
          `/confirmation?bdate=${formData.bookeddate}&time=${formData.bookedtime}&fname=${formData.firstname}&name=${formData.lastname}&phone=${formData.phone}&email=${formData.email}&cotoken=${formData.cotoken}&confirmno=${confirmationNumber}`
        );
      })
      .catch((err) => {
        console.error("Booking error:", err);
        alert("Something went wrong. Please try again.");
      });
  };

  // Auto-fill test not for production
/*  const handleFakeLogin = () => {
    setValue("firstname", "Crystal");
    setValue("lastname", "Hansen");
    setValue("email", "test@example.com");
    setValue("phone", "123-456-7890");
  };*/

  return (
    <div className="container my-5">
      <h3>Here's the details:</h3>
      <hr />

      <div className="mb-4">
        <h4>Booking Date: <span>{bdate}</span></h4>
        <h4>Time: <span>{time}</span></h4>
      </div>

      <h4>Client Profile</h4>
      <hr />
      <p>Please enter your contact information to book your appointment.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Hidden Fields */}
        <input type="hidden" {...register("bookeddate")} />
        <input type="hidden" {...register("bookedtime")} />
        <input type="hidden" {...register("cotoken")} />
        <input type="hidden" {...register("gctoken")} />

        {/* Honeypot — invisible to humans, bots fill it in */}
        <input
          type="text"
          {...register("website")}
          autoComplete="off"
          tabIndex="-1"
          aria-hidden="true"
          style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }}
        />

        {/* Fields */}
        <div className="mb-3">
          <label className="form-label border-0 booking">First Name</label>
          <input
            className={`form-control ${errors.firstname ? "is-invalid" : ""}`}
            {...register("firstname")}
          />
          {errors.firstname && <div className="invalid-feedback">{errors.firstname.message}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label  border-0 booking">Last Name</label>
          <input
            className={`form-control ${errors.lastname ? "is-invalid" : ""}`}
            {...register("lastname")}
          />
          {errors.lastname && <div className="invalid-feedback">{errors.lastname.message}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label  border-0 booking">Phone</label>
          <input
            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
            {...register("phone")}
          />
          {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label  border-0 booking">Email</label>
          <input
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            {...register("email")}
          />
          {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
        </div>

        <div className="d-flex justify-content-between mt-4">
           {/*<button type="button" className="btn btn-secondary" onClick={handleFakeLogin}>
            Sign in (Example)
          </button> */}
          <button type="submit" className="btn btn-primary">
            Confirm it!
          </button>
        </div>
      </form>
    </div>
  );
}
