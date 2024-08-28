const mongoose = require('mongoose');
const crypto = require('crypto');

const claimSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  email: { type: String, required: true },
  jsonContent: { type: String, required: true }, // JSON 데이터를 문자열로 저장
  submissionDate: { type: Date, default: Date.now },
  verifiedCount: { type: Number, default: 0 },
  deniedCount: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  dataHash: { type: String, required: true }, // 해시 값을 저장하는 필드
});

module.exports = mongoose.model('Claim', claimSchema);
