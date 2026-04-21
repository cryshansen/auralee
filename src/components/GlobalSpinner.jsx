// components/GlobalSpinner.jsx
import { useLoading } from "../context/LoadingContext";
import "./global-spinner.css"; // style this as needed

export default function GlobalSpinner() {
  const { loading } = useLoading();

  if (!loading) return null;

  return (
    <div className="global-spinner-overlay">
      <div className="spinner" />
    </div>
  );
}
