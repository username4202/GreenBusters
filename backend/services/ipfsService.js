const { create } = require('ipfs-http-client');
const projectId = process.env.INFURA_PROJECT_ID;
const projectSecret = process.env.INFURA_PROJECT_SECRET;
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

const uploadToIPFS = async (fileBuffer) => {
  try {
    const result = await ipfs.add(fileBuffer);
    return result.path; // IPFS에 저장된 파일의 해시값을 반환
  } catch (error) {
    throw new Error('IPFS 파일 업로드 실패: ' + error.message);
  }
};

module.exports = {
  uploadToIPFS,
};
