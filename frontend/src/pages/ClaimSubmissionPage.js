import React from 'react';
import ClaimSubmissionForm from '../components/ClaimSubmissionForm';

function ClaimSubmissionPage() {
  return (
    <div>
      <div className="company-name">Greenbusters</div>
      <h1>LCA 제출</h1>
      <ClaimSubmissionForm />
    </div>
  );
}

export default ClaimSubmissionPage;
