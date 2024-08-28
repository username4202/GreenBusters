import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa'; // 스피너 아이콘 가져오기
import '../styles/VerifiedDataView.css'; // 스타일을 위한 CSS 파일 임포트

function VerifiedDataView() {
  const { contractAddress, userAddress } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataHash, setDataHash] = useState('');  // 데이터 해시 상태 추가

  useEffect(() => {
    const serverIp = process.env.REACT_APP_SERVER_IP;
    // API를 호출하여 데이터를 가져옵니다
    const fetchData = async () => {
      try {
        const response = await fetch(`http://${serverIp}:5000/api/verified/greenbusters/${contractAddress}/${userAddress}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(JSON.parse(result.jsonContent));  // JSON 데이터를 파싱하여 상태로 설정합니다
        setDataHash(result.dataHash);  // 데이터 해시값 설정
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [contractAddress, userAddress]);

  if (loading) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner" /> {/* 로딩 스피너 아이콘 */}
        <p>Loading data...</p>
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="verified-data-container">
      <h1 className="title">GreenBusters Verified Data</h1>
      <div className="info-section">
        <p><strong>Contract Address:</strong> {contractAddress}</p>
        <p><strong>User Address:</strong> {userAddress}</p>
        <p><strong>Data Hash:</strong> {dataHash}</p>  {/* 데이터 해시 표시 */}
      </div>
      <div className="data-section">
        <h2>Data Details</h2>
        <pre>{JSON.stringify(data, null, 2)}</pre>  {/* JSON 데이터를 보기 좋게 포맷팅 */}
      </div>
      <div className="integrity-message">
        <strong>Data Integrity:</strong> This data has been verified and is certified as intact by GreenBusters.
      </div>
    </div>
  );
}

export default VerifiedDataView;
