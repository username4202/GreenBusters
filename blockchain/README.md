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

### 5. 스마트 컨트랙트 
contracts/GreenWashingVerification.sol 파일을 확인 후 컴파일 진행
```
npx hardhat compile
```
### 6 배포 스크립트 작성

deploy/deploy.ts 파일 확인 후 배포 스크립트 실행
```
npx hardhat run deploy/deploy.ts
```

### 7 단위 텍스트 작성
test/GreenWashingVerification.ts 파일 확인 후 단위 테스트 진행

```
npx hardhat test
```