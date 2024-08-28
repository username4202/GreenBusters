import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ClaimSubmissionPage from './pages/ClaimSubmissionPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ClaimSubmissionPage />} />
      </Routes>
    </Router>
  );
}

export default App;
