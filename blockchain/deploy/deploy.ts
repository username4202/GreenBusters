import { ethers } from "hardhat";

async function main() {
    const [owner, validator1, validator2, validator3] = await ethers.getSigners();
    
    // 스마트 컨트랙트 배포 준비
    const GreenWashingVerificationFactory = await ethers.getContractFactory("GreenWashingVerification");
    const greenWashingVerification = await GreenWashingVerificationFactory.deploy(
        validator1.address,
        validator2.address,
        validator3.address
    );

    await greenWashingVerification.waitForDeployment();

    console.log("GreenWashingVerification deployed to:", await greenWashingVerification.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
