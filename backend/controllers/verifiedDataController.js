const { getHashFromBlockchain } = require('../services/blockchainService');
const Claim = require('../models/claimModel'); // Claim 모델을 가져옵니다

exports.getVerifiedData = async (req, res) => {
    try {
        const { contractAddress, userAddress } = req.params;

        // 블록체인에서 해시 데이터를 가져옵니다.
        let dataHash = await getHashFromBlockchain(contractAddress, userAddress);

        // 0x가 앞에 붙어 있다면 제거
        if (dataHash.startsWith('0x')) {
            dataHash = dataHash.slice(2);
        }

        console.log("exports.getVerifiedData:", dataHash);

        // MongoDB에서 해당 해시와 일치하는 데이터 찾기
        const claim = await Claim.findOne({ dataHash: dataHash });

        if (!claim) {
            return res.status(404).json({ error: 'Data not found' });
        }

        // 일치하는 데이터의 JSON 콘텐츠를 응답으로 반환
        res.status(200).json({ jsonContent: claim.jsonContent });
    } catch (error) {
        console.error('Error retrieving verified data:', error);
        res.status(500).json({ error: 'Failed to retrieve verified data.' });
    }
};
