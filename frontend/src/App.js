import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ClaimSubmissionPage from './pages/ClaimSubmissionPage';
import ClaimVerificationPage from './pages/ClaimVerificationPage';
import VerifiedDataView from './pages/VerifiedDataView'; // 새로운 페이지를 임포트

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/submission" element={<ClaimSubmissionPage />} />
        <Route path="/verification" element={<ClaimVerificationPage />} />
        <Route path="/greenbusters/:contractAddress/:userAddress" element={<VerifiedDataView />} />
      </Routes>
    </Router>
  );
}

export default App;
