import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ClaimSubmissionPage from './pages/ClaimSubmissionPage';
import ClaimVerificationPage from './pages/ClaimVerificationPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/submission" element={<ClaimSubmissionPage />} />
        <Route path="/verification" element={<ClaimVerificationPage />} />
      </Routes>
    </Router>
  );
}

export default App;