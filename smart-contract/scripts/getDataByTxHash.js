require('dotenv').config(); // .env 파일을 읽어 환경 변수로 설정
const { ethers } = require("ethers");

async function main() {
    const txHash = process.env.TX_HASH; // 환경 변수에서 트랜잭션 해시를 가져옴

    if (!txHash) {
        console.error("Please provide a transaction hash using the TX_HASH environment variable.");
        process.exit(1);
    }

    // Alchemy를 사용한 provider 설정
    const provider = new ethers.providers.AlchemyProvider("sepolia", process.env.ALCHEMY_API_KEY);

    // 트랜잭션에서 발신자 주소를 추출
    const tx = await provider.getTransaction(txHash);
    if (!tx) {
        console.error("Transaction not found.");
        process.exit(1);
    }

    const userAddress = tx.from;
    console.log("User Address:", userAddress);

    const dataStorageAddress = "0x79bd789C6031bc6e39E70E6FAbf54d8352f466F0"; // 배포한 계약의 주소
  
    const DataStorage = await ethers.getContractFactory("DataStorage");
    const dataStorage = await DataStorage.attach(dataStorageAddress);
  
    // 추출한 주소를 사용하여 저장된 데이터를 가져옴
    const dataHash = await dataStorage.getData(userAddress);
    console.log("Stored data hash for address", userAddress, ":", dataHash);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
