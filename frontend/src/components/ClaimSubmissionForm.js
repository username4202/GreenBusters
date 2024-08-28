import '../styles/ClaimSubmissionForm.css';  // CSS 파일 불러오기
import React, { useState } from 'react';

function ClaimSubmissionForm() {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    jsonContent: '', // JSON 파일의 내용을 저장할 상태
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      setFormData({
        ...formData,
        jsonContent: event.target.result, // JSON 파일 내용을 문자열로 저장
      });
    };

    reader.readAsText(file); // JSON 파일을 텍스트로 읽음
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      companyName: formData.companyName,
      email: formData.email,
      jsonContent: formData.jsonContent,
    };

    try {
      const serverIp = process.env.REACT_APP_SERVER_IP; 
      const response = await fetch('http://${serverIp}:5000/api/claims/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMessage('제출이 완료되었습니다.');
      } else {
        setMessage('제출 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('폼 제출 중 오류 발생:', error);
      setMessage('폼 제출 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>회사 이름</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>이메일</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>JSON 파일 첨부</label>
          <input
            type="file"
            name="file"
            accept=".json" // JSON 파일만 허용
            onChange={handleFileChange}
            required
          />
        </div>
        <button type="submit">제출하기</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ClaimSubmissionForm;
