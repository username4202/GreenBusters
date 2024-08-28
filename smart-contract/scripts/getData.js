// scripts/getData.js
async function main() {
    const [deployer] = await ethers.getSigners();
    const dataStorageAddress = "0x79bd789C6031bc6e39E70E6FAbf54d8352f466F0"; // 배포한 계약의 주소
  
    const DataStorage = await ethers.getContractFactory("DataStorage");
    const dataStorage = await DataStorage.attach(dataStorageAddress);
  
    const userAddress = "deployer.address"; // 데이터가 저장된 사용자 주소를 입력합니다.
  
    // 사용자의 저장된 데이터를 가져옵니다.
    const dataHash = await dataStorage.getData(userAddress);
    console.log("Stored data hash for address", userAddress, ":", dataHash);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  