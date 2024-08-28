// hardhat.config.js
require("@nomicfoundation/hardhat-ethers");
require('dotenv').config(); // 환경 변수 파일을 사용하여 민감한 정보를 관리
require("@nomicfoundation/hardhat-toolbox");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const { API_URL, PRIVATE_KEY } = process.env;

task("gethash", "Get Hash data ")
  .addParam("contractAddress", "Contract address")
  .addParam("userAddress", "User Address")
  
  .setAction(async (taskArgs) => {
    const dataStorageAddress = taskArgs.contractAddress; // 배포한 계약의 주소
  
    const DataStorage = await ethers.getContractFactory("DataStorage");
    const dataStorage = await DataStorage.attach(dataStorageAddress);
  
    const userAddress = taskArgs.userAddress; // 데이터가 저장된 사용자 주소를 입력합니다.
  
    // 사용자의 저장된 데이터를 가져옵니다.
    const dataHash = await dataStorage.getData(userAddress);
    console.log(dataHash);

  });


task("uploadhash", "Upload Hash data ")
  .addParam("dataHash", "Hashed data")
  
  .setAction(async (taskArgs) => {
    const dataStorageAddress = "0x79bd789C6031bc6e39E70E6FAbf54d8352f466F0"; // 배포한 계약의 주소

    const DataStorage = await ethers.getContractFactory("DataStorage");
    const dataStorage = await DataStorage.attach(dataStorageAddress);

    // 환경 변수나 스크립트 인자로부터 dataHash를 가져옵니다.
    const args = process.argv.slice(2);
    const dataHash = taskArgs.dataHash;

    if (!dataHash) {
        console.error('Error: dataHash is not provided');
        process.exit(1);
    }

    const tx = await dataStorage.uploadData(dataHash);
    console.log("Transaction hash:", tx.hash);
    console.log("Contract Addresss:", dataStorageAddress);
    console.log("User Address:", dataStorage);


    await tx.wait();
    console.log("Data uploaded successfully.");

  });



module.exports = {
  solidity: "0.8.0",
  networks: {
    hardhat: {},
    ganache: {
      url: "HTTP://127.0.0.1:7545"
    },
    sepolia: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  }
};
