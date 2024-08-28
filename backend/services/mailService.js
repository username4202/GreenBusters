const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
const { getLocalIPAddress } = require('../utils/network');



// 이메일을 전송하는 함수
exports.sendCongratulationEmail = async (email, transaction) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 트랜잭션 정보를 이메일에 포함시킴
  let info = await transporter.sendMail({
    from: '"GreenBusters" <no-reply@greenbusters.com>',
    to: email,
    subject: '축하합니다! 검증이 완료되었습니다.',
    text: `축하합니다! 귀하의 기업이 검증되었습니다.\n\n트랜잭션 정보:\nTransaction Hash: ${transaction.transactionHash}\nContract Address: ${transaction.contractAddress}\nUser Address: ${transaction.userAddress}`,
    html: `
      <h1>축하합니다! 검증이 완료되었습니다.</h1>
      <p>귀하의 기업이 GreenBusters에서 성공적으로 검증되었습니다.</p>
      <h2>트랜잭션 정보:</h2>
      <ul>
        <li><strong>Transaction Hash:</strong> ${transaction.transactionHash}</li>
        <li><strong>Contract Address:</strong> ${transaction.contractAddress}</li>
        <li><strong>User Address:</strong> ${transaction.userAddress}</li>
      </ul>
      <p>감사합니다.</p>
      <p>GreenBusters 드림</p>
    `,
  });

  console.log('이메일 전송 완료:', info.response);
};


async function sendEmailWithQRCode(email, transaction) {
  try {
    const { contractAddress, userAddress, transactionHash } = transaction;
    const ipAddress = getLocalIPAddress();
    const url = `http://${ipAddress}:3000/greenbusters/${contractAddress}/${userAddress}`;

    // QR 코드 생성
    const qrCodeData = await QRCode.toDataURL(url);

    // 이메일 설정
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
      text: `축하합니다! 귀하의 기업이 검증되었습니다. 아래의 QR 코드를 스캔하여 상세 정보를 확인하세요.\n\nURL: ${url}\n\n트랜잭션 정보:\nTransaction Hash: ${transactionHash}\nContract Address: ${contractAddress}\nUser Address: ${userAddress}`,
      html: `
        <h1>축하합니다! 검증이 완료되었습니다.</h1>
        <p>귀하의 기업이 GreenBusters에서 성공적으로 검증되었습니다.</p>
        <h2>QR 코드</h2>
        <img src="${qrCodeData}" alt="QR Code" />
        <p>아래의 URL을 통해서도 확인하실 수 있습니다:</p>
        <a href="${url}">${url}</a>
        <h2>트랜잭션 정보:</h2>
        <ul>
          <li><strong>Transaction Hash:</strong> ${transactionHash}</li>
          <li><strong>Contract Address:</strong> ${contractAddress}</li>
          <li><strong>User Address:</strong> ${userAddress}</li>
        </ul>
        <p>감사합니다.<br/>GreenBusters 드림</p>
      `,
    });

    console.log('이메일 전송 완료:', info.response);
  } catch (error) {
    console.error('Error sending email with QR code:', error);
  }
}

module.exports = { sendEmailWithQRCode };
