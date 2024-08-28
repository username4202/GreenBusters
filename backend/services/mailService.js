const nodemailer = require('nodemailer');

// 이메일을 전송하는 함수
exports.sendCongratulationEmail = async (email) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let info = await transporter.sendMail({
    from: '"GreenBusters" <no-reply@greenbusters.com>',
    to: email,
    subject: '축하합니다! 검증이 완료되었습니다.',
    text: '축하합니다! 귀하의 기업이 검증되었습니다.',
  });

  console.log('이메일 전송 완료:', info.response);
};
