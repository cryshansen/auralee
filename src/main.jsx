import { StrictMode } from 'react'
import { BrowserRouter as Router } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from "react-helmet-async";
import { LoadingProvider } from "./context/LoadingContext";
import { SiteContentProvider } from "./context/SiteContentContext";
import GlobalSpinner from "./components/GlobalSpinner";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider> 
      <Router>      
        <SiteContentProvider>
          <LoadingProvider>
            <App />
            <GlobalSpinner />
          </LoadingProvider>
        </SiteContentProvider>
      </Router>
     </HelmetProvider> 
  </StrictMode>,
)
