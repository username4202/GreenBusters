const express = require('express');
const router = express.Router();
const { getVerifiedData } = require('../controllers/verifiedDataController');

const { generateQRCode } = require('../services/qrCodeService');
const { getLocalIPAddress } = require('../utils/network'); // IP 주소 가져오는 함수 임포트

// 검증된 데이터를 가져오는 라우트
router.get('/greenbusters/:contractAddress/:userAddress', getVerifiedData);

router.get('/generate-qrcode/:contractAddress/:userAddress', async (req, res) => {
    try {
      const { contractAddress, userAddress } = req.params;
      const ipAddress = getLocalIPAddress();
      const url = `http://${ipAddress}:3000/greenbusters/${contractAddress}/${userAddress}`;
      
      // QR 코드 생성
      const qrCodeData = await generateQRCode(url);
  
      // QR 코드를 이미지로 반환
      res.status(200).json({ qrCodeData });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate QR code' });
    }
  });
  
  module.exports = router;
