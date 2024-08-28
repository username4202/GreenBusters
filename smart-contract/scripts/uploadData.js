async function main() {
  const [deployer] = await ethers.getSigners();
  const dataStorageAddress = "0x79bd789C6031bc6e39E70E6FAbf54d8352f466F0"; // 배포한 계약의 주소

  const DataStorage = await ethers.getContractFactory("DataStorage");
  const dataStorage = await DataStorage.attach(dataStorageAddress);

  // 환경 변수나 스크립트 인자로부터 dataHash를 가져옵니다.
  const args = process.argv.slice(2);
  const dataHashIndex = args.indexOf('--dataHash');
  const dataHash = dataHashIndex !== -1 ? args[dataHashIndex + 1] : null;

  if (!dataHash) {
      console.error('Error: dataHash is not provided');
      process.exit(1);
  }

  const tx = await dataStorage.uploadData(dataHash);
  console.log("Transaction hash:", tx.hash);

  await tx.wait();
  console.log("Data uploaded successfully.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
