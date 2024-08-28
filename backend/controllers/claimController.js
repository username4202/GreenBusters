const crypto = require('crypto');
const Claim = require('../models/claimModel');
const { sendCongratulationEmail } = require('../services/mailService');

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

exports.getPendingClaims = async (req, res) => {
  try {
    console.log('검증 대기 중인 클레임 목록을 가져오는 중...');
    const claims = await Claim.find({ isVerified: false });
    console.log('가져온 클레임:', claims);
    res.status(200).json(claims);
  } catch (error) {
    console.error('데이터를 가져오는 중 오류 발생:', error);
    res.status(500).json({ error: '데이터를 가져오는 중 오류 발생: ' + error.message });
  }
};
exports.verifyClaim = async (req, res) => {
  const { claimId, vote } = req.body;
  console.log('검증 요청:', { claimId, vote });

  try {
    const claim = await Claim.findById(claimId);
    if (!claim) {
      console.log('클레임을 찾을 수 없음:', claimId);
      return res.status(404).json({ error: '클레임을 찾을 수 없습니다.' });
    }

    console.log('검증 전 클레임 상태:', claim);

    // YES 또는 NO에 따라 count를 증가시킵니다.
    if (vote === 'YES') {
      claim.verifiedCount += 1;
    } else {
      claim.deniedCount += 1;
    }

    console.log('검증 후 상태:', { verifiedCount: claim.verifiedCount, deniedCount: claim.deniedCount });

    // 검증자가 두 명 이상일 경우, 검증 완료로 처리
    if (claim.verifiedCount >= 2) {
      claim.isVerified = true;
      console.log('클레임이 검증되었습니다. 블록체인 업로드 및 이메일 전송 준비...');
      // 블록체인에 업로드 및 이메일 전송
      // await uploadToBlockchain(claim);
      await sendCongratulationEmail(claim.email);
      console.log('이메일 전송 완료:', claim.email);
    }

    await claim.save();
    console.log('검증 후 클레임 상태 저장 완료:', claim);

    res.status(200).json({ message: '검증이 성공적으로 처리되었습니다.' });
  } catch (error) {
    console.error('검증 처리 중 오류 발생:', error);
    res.status(500).json({ error: '검증 처리 중 오류 발생: ' + error.message });
  }
};
