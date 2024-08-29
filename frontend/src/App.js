import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage'; // Import the MainPage component
import ClaimSubmissionPage from './pages/ClaimSubmissionPage';
import ClaimVerificationPage from './pages/ClaimVerificationPage';
import VerifiedDataView from './pages/VerifiedDataView'; // Import the VerifiedDataView component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} /> {/* Add the main page route */}
        <Route path="/submission" element={<ClaimSubmissionPage />} />
        <Route path="/verification" element={<ClaimVerificationPage />} />
        <Route path="/greenbusters/:contractAddress/:userAddress" element={<VerifiedDataView />} />
      </Routes>
    </Router>
  );
}

export default App;
