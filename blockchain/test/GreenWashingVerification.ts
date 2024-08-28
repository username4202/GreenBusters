import { expect } from "chai";
import { ethers } from "hardhat";
import { GreenWashingVerification } from "../typechain-types";

describe("GreenWashingVerification", function () {
    let greenWashingVerification: GreenWashingVerification;
    let owner: any;
    let user1: any;
    let validator1: any;
    let validator2: any;
    let validator3: any;

    beforeEach(async function () {
        // 스마트 컨트랙트의 배포 준비
        [owner, user1, validator1, validator2, validator3] = await ethers.getSigners();
        const GreenWashingVerificationFactory = await ethers.getContractFactory("GreenWashingVerification");
        greenWashingVerification = await GreenWashingVerificationFactory.deploy(
            validator1.address,
            validator2.address,
            validator3.address
        ) as GreenWashingVerification;

        // 배포 완료 대기
        await greenWashingVerification.waitForDeployment();
    });

    it("should allow the owner to register data", async function () {
        // 데이터 등록 테스트: owner가 데이터를 등록
        const tx = await greenWashingVerification.connect(owner).registerData("sampleHash");
        await tx.wait();

        // 제출된 데이터의 해시 값을 확인
        const dataHash = await greenWashingVerification.getDataHash(1);
        expect(dataHash).to.equal("Data not yet verified"); // 검증되지 않은 상태의 메시지 확인
    });

    it("should prevent duplicate data registration", async function () {
        // owner가 데이터를 등록
        await greenWashingVerification.connect(owner).registerData("sampleHash");

        // 동일한 해시 값으로 다시 등록 시도 시 오류 발생
        await expect(greenWashingVerification.connect(owner).registerData("sampleHash")).to.be.revertedWith("Data already exists");
    });

    it("should allow validators to vote for data and verify it", async function () {
        // owner가 데이터를 등록
        await greenWashingVerification.connect(owner).registerData("sampleHash");

        // 검증자1과 검증자2가 찬성 투표 (과반수 이상으로 검증 성공)
        await greenWashingVerification.connect(validator1).voteForData(1, true); // 찬성
        await greenWashingVerification.connect(validator2).voteForData(1, true); // 찬성
        await greenWashingVerification.connect(validator3).voteForData(1, false); // 반대

        // 데이터가 검증되었는지 확인
        const isVerified = await greenWashingVerification.isDataVerified("sampleHash");
        expect(isVerified).to.be.true;

        // 검증된 데이터의 해시 값을 확인
        const dataHash = await greenWashingVerification.getDataHash(1);
        expect(dataHash).to.equal("sampleHash");
    });

    it("should fail verification with majority disapproval votes", async function () {
        // owner가 데이터를 등록
        await greenWashingVerification.connect(owner).registerData("sampleHash");

        // 검증자1과 검증자2가 반대 투표 (과반수 반대 투표로 검증 실패)
        await greenWashingVerification.connect(validator1).voteForData(1, false); // 반대
        await greenWashingVerification.connect(validator2).voteForData(1, false); // 반대
        await greenWashingVerification.connect(validator3).voteForData(1, true); // 찬성

        // 데이터가 검증되지 않았는지 확인
        const isVerified = await greenWashingVerification.isDataVerified("sampleHash");
        expect(isVerified).to.be.false;

        // 검증되지 않은 데이터의 해시 값을 확인
        const dataHash = await greenWashingVerification.getDataHash(1);
        expect(dataHash).to.equal("Data not yet verified");
    });

    it("should prevent further voting after data is verified", async function () {
        // owner가 데이터를 등록
        await greenWashingVerification.connect(owner).registerData("sampleHash");

        // 검증자1,2,3가 찬성 투표로 데이터 검증
        await greenWashingVerification.connect(validator1).voteForData(1, true); // 찬성
        await greenWashingVerification.connect(validator2).voteForData(1, true); // 찬성
        await greenWashingVerification.connect(validator3).voteForData(1, true); // 찬성


        // 데이터가 검증된 후 추가 투표 시도 시 오류 발생
        await expect(greenWashingVerification.connect(validator3).voteForData(1, true)).to.be.revertedWith("You have already voted for this data");
    });

    it("should return correct verification status", async function () {
        // owner가 데이터를 등록
        await greenWashingVerification.connect(owner).registerData("sampleHash");

        // 검증자1이 찬성 투표 (아직 검증되지 않음)
        await greenWashingVerification.connect(validator1).voteForData(1, true);
        let isVerified = await greenWashingVerification.isDataVerified("sampleHash");
        expect(isVerified).to.be.false;

        // 검증자2가 찬성 투표 (아직 검증되지 않음)
        await greenWashingVerification.connect(validator2).voteForData(1, true);
        isVerified = await greenWashingVerification.isDataVerified("sampleHash");
        expect(isVerified).to.be.false;

        // 검증자3가 반대 투표하여 검증 완료
        await greenWashingVerification.connect(validator3).voteForData(1, false);
        isVerified = await greenWashingVerification.isDataVerified("sampleHash");
        expect(isVerified).to.be.true;
    });

    it("should return the correct hash value for verified data", async function () {
        // owner가 데이터를 등록
        await greenWashingVerification.connect(owner).registerData("sampleHash");

        // 검증자1과 검증자3가 찬성, 검증자 2가 반대 투표하여 데이터 검증
        await greenWashingVerification.connect(validator1).voteForData(1, true); // 찬성
        await greenWashingVerification.connect(validator2).voteForData(1, false); // 반대
        await greenWashingVerification.connect(validator3).voteForData(1, true); // 찬성

        // 검증된 데이터의 해시 값을 확인
        const dataHash = await greenWashingVerification.getDataHash(1);
        expect(dataHash).to.equal("sampleHash");
    });

    it("should return 'Data not yet verified' for unverified data", async function () {
        // owner가 데이터를 등록
        await greenWashingVerification.connect(owner).registerData("sampleHash");

        // 검증되지 않은 데이터의 해시 값을 확인
        const dataHash = await greenWashingVerification.getDataHash(1);
        expect(dataHash).to.equal("Data not yet verified");
    });
});
