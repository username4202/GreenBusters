require('dotenv').config();
const express = require('express');
const connectDB = require('./utils/database');  // MongoDB 연결 함수
const claimRoutes = require('./routes/claimRoutes');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// MongoDB 연결
connectDB();

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 라우트 설정
app.use('/api/claims', claimRoutes);

// 서버 실행
app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
