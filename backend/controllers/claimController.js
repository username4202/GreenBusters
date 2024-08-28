const Claim = require('../models/claimModel');

exports.submitClaim = async (req, res) => {
  const { companyName, email, jsonContent } = req.body;

  if (!companyName || !email || !jsonContent) {
    return res.status(400).json({ error: '모든 필드를 입력해야 합니다.' });
  }

  try {
    // 데이터베이스에 저장할 새 Claim 생성
    const newClaim = new Claim({
      companyName,
      email,
      jsonContent, // JSON 내용을 문자열로 저장
      submissionDate: new Date(),
    });

    await newClaim.save();

    res.status(201).json({ message: '클레임이 성공적으로 제출되었습니다.', claim: newClaim });
  } catch (error) {
    res.status(500).json({ error: '클레임 제출 중 오류 발생: ' + error.message });
  }
};
