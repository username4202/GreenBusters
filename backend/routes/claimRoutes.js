const express = require('express');
const multer = require('multer');
const { getPendingClaims, submitClaim, verifyClaim } = require('../controllers/claimController');
const router = express.Router();

// multer 설정 (파일 업로드를 처리하기 위해)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 클레임 제출 라우트
router.post('/submit', upload.single('file'), submitClaim);

router.get('/pending', getPendingClaims);

router.post('/verify', verifyClaim);

module.exports = router;
