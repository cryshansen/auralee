// context/LoadingContext.jsx
import { createContext, useContext, useState } from "react";
import GlobalSpinner from "../components/GlobalSpinner";

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const showLoader = () => setLoading(true);
  const hideLoader = () => setLoading(false);
  return (
    <LoadingContext.Provider value={{ loading,setLoading, showLoader, hideLoader }}>
      {children}
      {loading && <GlobalSpinner />}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
