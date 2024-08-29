import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import '../styles/VerifiedDataView.css';

function VerifiedDataView() {
  const { contractAddress, userAddress } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataHash, setDataHash] = useState('');

  useEffect(() => {
    const serverIp = process.env.REACT_APP_SERVER_IP;

    const fetchData = async () => {
      try {
        const response = await fetch(`http://${serverIp}:5000/api/verified/greenbusters/${contractAddress}/${userAddress}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        const parsedData = JSON.parse(result.jsonContent);
        setData(parsedData.data); // Correctly reference the nested data object
        setDataHash(result.dataHash);
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
        <FaSpinner className="spinner" />
        <p><p>블록체인 트랜잭션을 조회하고<br />데이터의 무결성을 확인 중입니다...</p></p>
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="verified-data-container">
      <div className="header">
        <h1 className="title">GreenBusters <br />Verified Data<br />{data.name}</h1>
      </div>
      <div className="info-section">
        <p><strong>Contract Address:</strong> {contractAddress}</p>
        <p><strong>User Address:</strong> {userAddress}</p>
        <p><strong>Data Hash:</strong> {dataHash}</p>
      </div>
      <div className="data-section">
        <h2>Sustainability Data Overview</h2>
        <div className="data-card">
          <h3>Raw Materials Usage</h3>
          <p>Organic Cotton Percentage: {data.raw_materials_usage.organic_cotton_percentage}%</p>
          <p>Recycled Materials Percentage: {data.raw_materials_usage.recycled_materials_percentage}%</p>
          <p>Water Consumption (Liters per kg): {data.raw_materials_usage.water_consumption_liters_per_kg}L</p>
        </div>
        <div className="data-card">
          <h3>Production Process</h3>
          <p>Renewable Energy Percentage: {data.production_process.renewable_energy_percentage}%</p>
          <p>Carbon Emissions (Tons per year): {data.production_process.carbon_emissions_tons_per_year} tons</p>
          <p>Restricted Chemicals Compliance: {data.production_process.chemicals_used.restricted_chemicals_compliance ? 'Yes' : 'No'}</p>
          <p>Toxic Chemicals Percentage: {data.production_process.chemicals_used.toxic_chemicals_percentage}%</p>
        </div>
        <div className="data-card">
          <h3>Product Lifecycle</h3>
          <p>Average Product Lifespan (Years): {data.product_lifecycle.average_product_lifespan_years} years</p>
          <p>Repair Services Offered: {data.product_lifecycle.repair_services_offered ? 'Yes' : 'No'}</p>
          <p>Take Back Program: {data.product_lifecycle.take_back_program ? 'Yes' : 'No'}</p>
        </div>
        <div className="data-card">
          <h3>Waste Management</h3>
          <p>Waste Reduction Percentage: {data.waste_management.waste_reduction_percentage}%</p>
          <p>Recycling Rate Percentage: {data.waste_management.recycling_rate_percentage}%</p>
          <p>Zero Waste to Landfill: {data.waste_management.zero_waste_to_landfill ? 'Yes' : 'No'}</p>
        </div>
        <div className="data-card">
          <h3>Environmental Certifications</h3>
          <p>Bluesign Certified: {data.environmental_certifications.bluesign_certified ? 'Yes' : 'No'}</p>
          <p>Fair Trade Certified: {data.environmental_certifications.fair_trade_certified ? 'Yes' : 'No'}</p>
          <p>B Corp Certified: {data.environmental_certifications.b_corp_certified ? 'Yes' : 'No'}</p>
        </div>
      </div>
      <div className="integrity-message">
        <strong>Data Integrity:</strong> This data has been verified and is certified as intact by GreenBusters.
      </div>
    </div>
  );
}

export default VerifiedDataView;
