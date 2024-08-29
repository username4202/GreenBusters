const { exec } = require('child_process');
const path = require('path');
const Transaction = require('../models/transactionModel'); // Claim 모델을 가져옵니다
const sendEmailWithQRCode = require('../services/mailService').sendEmailWithQRCode; 

async function getHashFromBlockchain(contractAddress, userAddress) {
    return new Promise((resolve, reject) => {

        // smart-contract 디렉토리로 이동한 후 명령어 실행
        const command = `cd ${path.resolve(__dirname, '../../smart-contract')} && npx hardhat gethash --contract-address ${contractAddress} --user-address ${userAddress} --network sepolia`;
        
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Command execution error: ${error}`);
                return reject(error);
            }
            if (stderr) {
                console.error(`Script execution error: ${stderr}`);
                return reject(stderr);
            }

            try {
                // 데이터 해시를 바로 추출하여 반환
                const dataHash = stdout.trim();  // 필요에 따라 trim()으로 공백 제거
                console.log("dataHash:",dataHash)
                resolve(dataHash);
            } catch (parseError) {
                reject(`Parsing error: ${parseError.message}`);
            }
        });
    });
}

async function uploadToBlockchain(dataHash) {
    return new Promise((resolve, reject) => {
        const command = `cd ${path.resolve(__dirname, '../../smart-contract')} && npx hardhat uploadhash --data-hash ${dataHash} --network sepolia`;

        exec(command, async (error, stdout, stderr) => {
            if (error) {
                console.error(`명령어 실행 오류: ${error}`);
                return reject(error);
            }
            if (stderr) {
                console.error(`스크립트 실행 오류: ${stderr}`);
                return reject(stderr);
            }

            try {
                console.log(stdout);

                // 정규식을 사용하여 필요한 정보를 추출
                const transactionHashMatch = stdout.match(/Transaction hash:\s*(0x[0-9a-fA-F]+)/);
                const contractAddressMatch = stdout.match(/Contract Addresss:\s*(0x[0-9a-fA-F]+)/);
                const userAddressMatch = stdout.match(/address:\s*'0x[0-9a-fA-F]+'/);

                const transactionHash = transactionHashMatch ? transactionHashMatch[1] : null;
                const contractAddress = contractAddressMatch ? contractAddressMatch[1] : null;
                const userAddress = userAddressMatch ? userAddressMatch[0].split("'")[1] : null;

                if (!transactionHash || !contractAddress || !userAddress) {
                    throw new Error('필요한 데이터를 모두 찾지 못했습니다.');
                }

                // 트랜잭션 정보를 저장
                const transaction = new Transaction({
                    transactionHash,
                    contractAddress,
                    userAddress
                });

                await transaction.save();

                resolve(transaction);
            } catch (parseError) {
                reject(`파싱 오류: ${parseError}`);
            }
        });
    });
}

module.exports = {
    getHashFromBlockchain,
    uploadToBlockchain
};
