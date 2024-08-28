const { exec } = require('child_process');
const path = require('path');

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
                // stdout을 라인별로 나눔
                const outputLines = stdout.split('\n');

                // 트랜잭션 해시, 계약 주소, 사용자 주소를 찾음
                const transactionHash = outputLines.find(line => line.includes("Transaction hash:")).split(": ")[1].trim();
                const contractAddress = outputLines.find(line => line.includes("Contract Address:")).split(": ")[1].trim();
                const userAddress = outputLines.find(line => line.includes("User Address:")).split(": ")[1].trim();

                // 모델에 저장
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
