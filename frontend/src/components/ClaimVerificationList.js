import React, { useEffect, useState } from 'react';
import ClaimDetail from './ClaimDetail';

function ClaimVerificationList() {
  const [claims, setClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);

  useEffect(() => {
    const serverIp = process.env.REACT_APP_SERVER_IP; 
    console.log("Fetching pending claims..."); // 로그 추가
    fetch('http://${serverIp}:5000/api/claims/pending')
      .then(response => {
        console.log("Received response:", response); // 로그 추가
        return response.json();
      })
      .then(data => {
        console.log("Claims data:", data); // 로그 추가
        setClaims(data);
      })
      .catch(error => {
        console.error("Error fetching claims:", error); // 에러 로그 추가
      });
  }, []);

  const handleClaimClick = (claim) => {
    console.log("Claim clicked:", claim); // 로그 추가
    setSelectedClaim(claim);
  };

  const handleCloseDetail = () => {
    console.log("Closing detail view"); // 로그 추가
    setSelectedClaim(null);
  };

  console.log("Current claims state:", claims); // 현재 상태 로그 추가
  console.log("Selected claim:", selectedClaim); // 현재 선택된 클레임 로그 추가

  return (
    <div>
      <h1>검증 대기 중인 기업 목록</h1>
      {claims.length === 0 ? (
        <p>검증 대기 중인 기업이 없습니다.</p>
      ) : (
        <ul>
          {claims.map(claim => (
            <li key={claim._id}>
              <h2>{claim.companyName}</h2>
              <button onClick={() => handleClaimClick(claim)}>상세 보기</button>
            </li>
          ))}
        </ul>
      )}
      {selectedClaim && <ClaimDetail claim={selectedClaim} onClose={handleCloseDetail} />}
    </div>
  );
}

export default ClaimVerificationList;
