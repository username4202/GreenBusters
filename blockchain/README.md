# GreenWashingVerification 스마트 컨트랙트 프로젝트

이 프로젝트는 하드햇(Hardhat)을 사용하여 개발된 GreenWashingVerification 스마트 컨트랙트입니다. 이 컨트랙트는 데이터의 해시 값을 등록하고, 검증자가 투표를 통해 데이터를 검증하는 기능을 제공합니다.

## 설치 및 초기 설정

### 1. 프로젝트 초기화

먼저, 프로젝트 폴더에서 하드햇을 설치합니다.

```bash
npm init -y
npm install --save-dev hardhat
# 타입스크립트 코드를 사용하여 hardhat 프로젝트를 초기화 진행
npx hardhat init

```
### 2. 기본 설정 변경

contracts/Lock.sol 파일을 삭제하고, 대신 contracts/GreenWashingVerification.sol 파일을 생성합니다.
ignition 폴더를 삭제하고, deploy 디렉토리를 생성하여 deploy/deploy.ts 파일을 작성합니다.
test/Lock.ts 파일을 삭제하고, 대신 test/GreenWashingVerification.ts 파일을 생성합니다.

### 3.필수 패키지 설치
```
npm install --save-dev typechain @typechain/hardhat @typechain/ethers-v6 ethers @nomicfoundation/hardhat-ethers

```

### 4. hardhat 설정 파일 수정 
hardhat.config.ts 파일을 다음과 같이 수정합니다.
```
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },
};

export default config;

```

### 5. 스마트 컨트랙트 작성
contracts/GreenWashingVerification.sol 파일을 생성하고, 다음 코드를 작성합니다.

```

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GreenWashingVerification {

    // 데이터 구조체: 해시 값, 제출자, 검증 여부, 투표 수, 투표자들을 포함
    struct Data {
        string hashValue; // 데이터의 해시 값
        address submitter; // 데이터를 제출한 사람의 주소
        bool verified; // 데이터가 검증되었는지 여부
        uint voteCount; // 데이터를 위해 투표한 사람 수
        mapping(address => bool) voters; // 이미 투표한 사람을 기록하기 위한 매핑
    }

    address public owner; // 스마트 컨트랙트의 소유자
    address public validator1; // 검증자 1
    address public validator2; // 검증자 2
    address public validator3; // 검증자 3
    uint public dataCount; // 총 데이터 수
    mapping(uint => Data) public dataRegistry; // 데이터 ID와 데이터 구조체를 매핑하는 데이터베이스

    // 오직 소유자만 실행할 수 있는 기능을 제한하는 수식어
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    // 검증자만 실행할 수 있는 기능을 제한하는 수식어
    modifier onlyValidator() {
        require(
            msg.sender == validator1 || msg.sender == validator2 || msg.sender == validator3,
            "You are not a validator"
        );
        _;
    }

    // 컨트랙트 생성자: 스마트 컨트랙트 배포 시 소유자와 검증자를 설정
    constructor(address _validator1, address _validator2, address _validator3) {
        owner = msg.sender;
        validator1 = _validator1;
        validator2 = _validator2;
        validator3 = _validator3;
    }

    // 데이터가 제출될 때 발생하는 이벤트
    event DataSubmitted(uint dataId, string hashValue, address submitter);
    // 데이터가 검증될 때 발생하는 이벤트
    event DataVerified(uint dataId, bool isVerified, uint voteCount);

    // 데이터를 제출하는 함수: 해시 값을 입력받아 데이터베이스에 저장
    function submitData(string memory _hashValue) public returns (uint) {
        // 중복 데이터 확인
        for (uint i = 1; i <= dataCount; i++) {
            require(
                keccak256(abi.encodePacked(dataRegistry[i].hashValue)) != keccak256(abi.encodePacked(_hashValue)),
                "Data already exists"
            );
        }

        dataCount++; // 데이터 ID 증가
        Data storage newData = dataRegistry[dataCount]; // 새로운 데이터 구조체 생성
        newData.hashValue = _hashValue; // 해시 값 저장
        newData.submitter = msg.sender; // 제출자 주소 저장
        newData.verified = false; // 초기 검증 상태는 false
        newData.voteCount = 0; // 초기 투표 수는 0

        emit DataSubmitted(dataCount, _hashValue, msg.sender);

        return dataCount; // 데이터 ID 반환
    }

    // 데이터를 검증하기 위해 투표하는 함수
    function voteForData(uint _dataId) public onlyValidator {
        Data storage data = dataRegistry[_dataId]; // 데이터베이스에서 해당 데이터를 가져옴

        require(data.submitter != address(0), "Data does not exist"); // 데이터가 존재하는지 확인
        require(!data.voters[msg.sender], "You have already voted for this data"); // 중복 투표 방지
        require(!data.verified, "Data has already been verified"); // 이미 검증된 데이터에 대한 추가 투표 방지
        
        data.voters[msg.sender] = true; // 투표자를 기록
        data.voteCount++; // 투표 수 증가

        // 검증 기준: 2표 이상이 모이면 검증된 것으로 간주
        if (data.voteCount >= 2) { // 과반수 이상 투표가 필요한 경우
            data.verified = true; // 검증 상태를 true로 변경
            emit DataVerified(_dataId, true, data.voteCount); // 데이터가 검증되었음을 알리는 이벤트 발생
        }
    }

    // 데이터가 검증되었는지 확인하는 함수
    function isDataVerified(uint _dataId) public view returns (bool) {
        Data storage data = dataRegistry[_dataId]; // 데이터베이스에서 해당 데이터를 가져옴
        require(data.submitter != address(0), "Data does not exist"); // 데이터가 존재하는지 확인
        return data.verified; // 검증 상태 반환
    }

    // 데이터의 해시 값을 반환하는 함수
    function getDataHash(uint _dataId) public view returns (string memory) {
        Data storage data = dataRegistry[_dataId]; // 데이터베이스에서 해당 데이터를 가져옴
        require(data.submitter != address(0), "Data does not exist"); // 데이터가 존재하는지 확인
        
        if (data.verified) {
            return data.hashValue; // 검증된 경우 해시 값 반환
        } else {
            return "Data not yet verified"; // 검증되지 않은 경우 메시지 반환
        }   
    }
}


```

컴파일 진행

```
npx hardhat compile

```
### 6 배포 스크립트 작성

```
import { ethers } from "hardhat";

async function main() {
    const [owner, validator1, validator2, validator3] = await ethers.getSigners();
    
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

```

배포 스크립트 실행
```
npx hardhat run deploy/deploy.ts

```

### 7 단위 텍스트 작성
test/GreenWashingVerification.ts 파일을 생성하고, 다음과 같은 단위 테스트 코드를 작성합니다.

```
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

    it("should allow a user to register data", async function () {
        // 데이터 등록 테스트: user1이 데이터를 제출
        const tx = await greenWashingVerification.connect(user1).submitData("sampleHash");
        await tx.wait();

        // 제출된 데이터의 해시 값을 확인
        const dataHash = await greenWashingVerification.getDataHash(1);
        expect(dataHash).to.equal("Data not yet verified"); // 검증되지 않은 상태의 메시지 확인
    });

    it("should prevent duplicate data registration", async function () {
        // user1이 데이터를 등록
        await greenWashingVerification.connect(user1).submitData("sampleHash");

        // 동일한 해시 값으로 다시 등록 시도 시 오류 발생
        await expect(greenWashingVerification.connect(user1).submitData("sampleHash")).to.be.revertedWith("Data already exists");
    });

    it("should allow validators to vote for data and verify it", async function () {
        // user1이 데이터를 등록
        await greenWashingVerification.connect(user1).submitData("sampleHash");

        // 검증자1과 검증자2가 찬성 투표 (과반수 이상으로 검증 성공)
        await greenWashingVerification.connect(validator1).voteForData(1);
        await greenWashingVerification.connect(validator2).voteForData(1);

        // 데이터가 검증되었는지 확인
        const isVerified = await greenWashingVerification.isDataVerified(1);
        expect(isVerified).to.be.true;

        // 검증된 데이터의 해시 값을 확인
        const dataHash = await greenWashingVerification.getDataHash(1);
        expect(dataHash).to.equal("sampleHash");
    });

    it("should fail verification with less than majority votes", async function () {
        // user1이 데이터를 등록
        await greenWashingVerification.connect(user1).submitData("sampleHash");

        // 검증자1이 찬성 투표 (과반수 이하로 검증 실패)
        await greenWashingVerification.connect(validator1).voteForData(1);

        // 데이터가 검증되지 않았는지 확인
        const isVerified = await greenWashingVerification.isDataVerified(1);
        expect(isVerified).to.be.false;

        // 검증되지 않은 데이터의 해시 값을 확인
        const dataHash = await greenWashingVerification.getDataHash(1);
        expect(dataHash).to.equal("Data not yet verified");
    });

    it("should prevent further voting after data is verified", async function () {
        // user1이 데이터를 등록
        await greenWashingVerification.connect(user1).submitData("sampleHash");

        // 검증자1과 검증자2가 찬성 투표로 데이터 검증
        await greenWashingVerification.connect(validator1).voteForData(1);
        await greenWashingVerification.connect(validator2).voteForData(1);

        // 데이터가 검증된 후 추가 투표 시도 시 오류 발생
        await expect(greenWashingVerification.connect(validator3).voteForData(1)).to.be.revertedWith("Data has already been verified");
    });

    it("should return correct verification status", async function () {
        // user1이 데이터를 등록
        await greenWashingVerification.connect(user1).submitData("sampleHash");

        // 검증자1이 찬성 투표 (아직 검증되지 않음)
        await greenWashingVerification.connect(validator1).voteForData(1);
        let isVerified = await greenWashingVerification.isDataVerified(1);
        expect(isVerified).to.be.false;

        // 검증자2가 추가 투표하여 검증 완료
        await greenWashingVerification.connect(validator2).voteForData(1);
        isVerified = await greenWashingVerification.isDataVerified(1);
        expect(isVerified).to.be.true;
    });

    it("should return the correct hash value for verified data", async function () {
        // user1이 데이터를 등록
        await greenWashingVerification.connect(user1).submitData("sampleHash");

        // 검증자1과 검증자2가 찬성 투표하여 데이터 검증
        await greenWashingVerification.connect(validator1).voteForData(1);
        await greenWashingVerification.connect(validator2).voteForData(1);

        // 검증된 데이터의 해시 값을 확인
        const dataHash = await greenWashingVerification.getDataHash(1);
        expect(dataHash).to.equal("sampleHash");
    });
});

```

단위 테스트 진행
```
npx hardhat test

```