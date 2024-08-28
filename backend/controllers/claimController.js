const crypto = require('crypto');
const Claim = require('../models/claimModel');

exports.submitClaim = async (req, res) => {
  const { companyName, email, jsonContent } = req.body;

  // 입력된 데이터 확인
  console.log('입력된 데이터:', { companyName, email, jsonContent });

  // 필수 필드 체크
  if (!companyName || !email || !jsonContent) {
    console.log('필수 필드 누락');
    return res.status(400).json({ error: '모든 필드를 입력해야 합니다.' });
  }

  try {
    // jsonContent 해시 생성
    const dataHash = crypto
      .createHash('sha256')
      .update(jsonContent)
      .digest('hex');

    console.log('생성된 해시:', dataHash);

    // 새로운 Claim 생성
    const newClaim = new Claim({
      companyName,
      email,
      jsonContent, // JSON 내용을 문자열로 저장
      dataHash,    // 해시 값을 함께 저장
    });

    // 생성된 Claim 객체 확인
    console.log('새로운 Claim 객체:', newClaim);

    // 데이터베이스에 저장
    await newClaim.save();

    // 데이터베이스 저장 후 결과 확인
    console.log('클레임 저장 성공:', newClaim);

    // 성공 응답
    res.status(201).json({ message: '클레임이 성공적으로 제출되었습니다.', claim: newClaim });
  } catch (error) {
    // 오류 발생 시 콘솔 로그
    console.error('클레임 제출 중 오류 발생:', error);
    // 오류 처리
    res.status(500).json({ error: '클레임 제출 중 오류 발생: ' + error.message });
  }
};
