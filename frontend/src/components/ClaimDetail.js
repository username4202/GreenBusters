import React from 'react';
import '../styles/ClaimDetail.css'; // CSS 파일 임포트

function ClaimDetail({ claim, onClose }) {
  const handleVote = (vote) => {
    const serverIp = process.env.REACT_APP_SERVER_IP;  // 환경 변수에서 서버 IP 가져오기
    fetch('http://${serverIp}:5000/api/claims/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ claimId: claim._id, vote }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.isVerified) {
          alert('검증이 완료되었습니다.');
        } else {
          alert(data.message);
        }
        onClose(); // 검증이 완료되면 상세 보기 창을 닫음
      })
      .catch(error => {
        console.error('Error:', error);
        alert('검증 처리 중 오류가 발생했습니다.');
      });
  };

  const { name, data } = JSON.parse(claim.jsonContent);

  return (
    <div className="claim-detail">
      <h2>{name}의 상세 정보</h2>
      
      <div className="scrollable-content">
        <div className="section">
          <h3>Raw Materials Usage</h3>
          <p>Organic Cotton Percentage: {data.raw_materials_usage.organic_cotton_percentage}%</p>
          <p>Recycled Materials Percentage: {data.raw_materials_usage.recycled_materials_percentage}%</p>
          <p>Water Consumption: {data.raw_materials_usage.water_consumption_liters_per_kg} liters/kg</p>
        </div>
        
        <div className="section">
          <h3>Production Process</h3>
          <p>Renewable Energy Percentage: {data.production_process.renewable_energy_percentage}%</p>
          <p>Carbon Emissions: {data.production_process.carbon_emissions_tons_per_year} tons/year</p>
          <p>Restricted Chemicals Compliance: {data.production_process.chemicals_used.restricted_chemicals_compliance ? 'Yes' : 'No'}</p>
          <p>Toxic Chemicals Percentage: {data.production_process.chemicals_used.toxic_chemicals_percentage}%</p>
        </div>
        
        <div className="section">
          <h3>Product Lifecycle</h3>
          <p>Average Product Lifespan: {data.product_lifecycle.average_product_lifespan_years} years</p>
          <p>Repair Services Offered: {data.product_lifecycle.repair_services_offered ? 'Yes' : 'No'}</p>
          <p>Take Back Program: {data.product_lifecycle.take_back_program ? 'Yes' : 'No'}</p>
        </div>
        
        <div className="section">
          <h3>Waste Management</h3>
          <p>Waste Reduction Percentage: {data.waste_management.waste_reduction_percentage}%</p>
          <p>Recycling Rate Percentage: {data.waste_management.recycling_rate_percentage}%</p>
          <p>Zero Waste to Landfill: {data.waste_management.zero_waste_to_landfill ? 'Yes' : 'No'}</p>
        </div>
        
        <div className="section">
          <h3>Environmental Certifications</h3>
          <p>Bluesign Certified: {data.environmental_certifications.bluesign_certified ? 'Yes' : 'No'}</p>
          <p>Fair Trade Certified: {data.environmental_certifications.fair_trade_certified ? 'Yes' : 'No'}</p>
          <p>B Corp Certified: {data.environmental_certifications.b_corp_certified ? 'Yes' : 'No'}</p>
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <button onClick={() => handleVote('YES')}>YES</button>
        <button onClick={() => handleVote('NO')}>NO</button>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}

export default ClaimDetail;
