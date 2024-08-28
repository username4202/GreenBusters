const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  email: { type: String, required: true },
  jsonContent: { type: String, required: true }, // JSON 내용을 문자열로 저장
  submissionDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Claim', claimSchema);
