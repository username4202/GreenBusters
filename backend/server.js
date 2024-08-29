require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./utils/database');  // MongoDB 연결 함수
const claimRoutes = require('./routes/claimRoutes');
const verifiedDataRoutes = require('./routes/verifiedDataRoutes');
const sendEmailWithQRCode = require('./services/mailService').sendEmailWithQRCode; // import the function
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// MongoDB 연결
connectDB();

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// API 라우트 설정 (반드시 React 정적 파일 제공 이전에 설정)
app.use('/api/claims', claimRoutes);
app.use('/api/verified', verifiedDataRoutes); // 새로운 라우트 추가

// 이메일 테스트 라우트 추가
app.post('/api/test-email', async (req, res) => {
  const { email, transaction } = req.body;

  try {
    // Call the sendEmailWithQRCode function
    await sendEmailWithQRCode(email, transaction);

    // Respond with success if the email is sent
    res.status(200).json({ message: 'Email sent successfully.' });
  } catch (error) {
    // Log and respond with an error if something goes wrong
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email with QR code.' });
  }
});

// API 테스트 라우트 추가
app.use('/api/test', (req, res) => {
  res.json({ message: 'API 경로가 제대로 작동 중입니다.' });
});

// React 정적 파일 제공 (API 라우트 이후에 설정)
app.use(express.static(path.join(__dirname, 'client/build')));

// 나머지 모든 요청을 React 앱의 index.html로 리다이렉트
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// 서버 실행
app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
