import React, { Suspense, useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// const CompanyRegistration = React.lazy(() => import('./pages/CompanyRegistration'));
// const TripBrowse = React.lazy(() => import('./pages/TripBrowse'));
// const NotFound = React.lazy(() => import('./pages/NotFound'));

const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const CompanyRegistration = React.lazy(() => import("./pages/CompanyRegistration"));
const TripBrowse = React.lazy(() => import("./pages/TripBrowse"));
const AgentDashboard = React.lazy(() => import("./pages/AgentDashboard"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

function App() {
  // Read moduleType injected by backend (via JSP c:out → window.out)
  const moduleType = (window.out && window.out.moduleType) || "LANDING";

  return (
    <div className="App">
      <Suspense fallback={<div className="loading">Loading...</div>}>
        <Routes>
          {/* Default route */}
          <Route path="/" element={<LandingPage />} />

          {/* Normal navigation */}
          <Route path="/home" element={<LandingPage />} />
          <Route path="/company-register" element={<CompanyRegistration />} />
          <Route path="/browse-trips" element={<TripBrowse />} />
          <Route path="/agent/dashboard" element={<AgentDashboard />} />
          <Route path="*" element={<NotFound />} />

          {/* Optionally: auto-redirect based on backend's moduleType */}
          {moduleType === "AGENT_DASHBOARD" && (
            <Route path="/" element={<AgentDashboard />} />
          )}
          {moduleType === "TRIP_BROWSE" && (
            <Route path="/" element={<TripBrowse />} />
          )}
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;