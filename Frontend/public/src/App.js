import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load components for better chunking
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const CompanyRegistration = React.lazy(() => import('./pages/CompanyRegistration'));
const TripBrowse = React.lazy(() => import('./pages/TripBrowse'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <div className="App">
      <Suspense fallback={<div className="loading">Loading...</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<LandingPage />} />
          {/* <Route path="/company-register" element={<CompanyRegistration />} />
          <Route path="/browse-trips" element={<TripBrowse />} />
          <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;