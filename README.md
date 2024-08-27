# GreenBusters

## 프로젝트 개요

GreenBusters는 친환경 클레임을 검증하고, 검증된 제품에 대해 NFT 기반의 메달이나 배지를 발급하는 플랫폼입니다. 이 플랫폼은 기업이 제출한 데이터를 검증하여 블록체인에 기록하며, 소비자가 제품의 친환경성을 투명하게 확인할 수 있도록 돕습니다.

### 주요 기능

1. 기업이 LCA 데이터를 제출할 수 있습니다.
2. 검증자들이 해당 데이터를 검증하고, 검증된 데이터는 블록체인에 기록됩니다.
3. 검증이 완료된 후, NFT 기반의 메달이나 배지를 발급합니다.
4. 발급된 NFT는 각 제품에 대해 고유하게 연결되며, 소비자는 QR 코드를 통해 검증된 데이터를 확인할 수 있습니다.

## 프로젝트 구조

\```
GreenBusters/
├── backend/          # 서버 코드와 API 관리
├── frontend/         # React 기반의 웹 애플리케이션
├── smart-contracts/  # 블록체인 스마트 계약 및 배포 스크립트
├── node_modules/     # 프로젝트 의존성 모듈
├── package.json      # 프로젝트 종속성 및 스크립트
├── README.md         # 프로젝트 설명서
└── .gitignore        # Git에서 추적하지 않을 파일들
\```

### Backend
- **controllers/**: 클레임 제출 및 NFT 발급과 관련된 비즈니스 로직
- **models/**: MongoDB 데이터베이스 모델 정의
- **routes/**: API 엔드포인트 정의
- **services/**: IPFS, 블록체인, 이메일 등의 외부 서비스와의 통합 로직
- **utils/**: 헬퍼 함수 및 데이터베이스 연결 등

### Frontend
- **components/**: 재사용 가능한 UI 컴포넌트
- **pages/**: 주요 페이지 컴포넌트 (홈, 클레임 검증, NFT 배지 등)
- **services/**: API 및 블록체인 상호작용 로직
- **styles/**: 전역 및 컴포넌트 스타일링

### Smart Contracts
- **contracts/**: 스마트 계약 코드 (예: EcoClaimVerification.sol, NFTMedal.sol)
- **scripts/**: 스마트 계약 배포 및 NFT 민팅 스크립트
- **test/**: 스마트 계약의 테스트 코드

## 설치 및 실행

### 1. 프로젝트 클론

먼저, GitHub에서 프로젝트를 클론합니다:

\```bash
git clone https://github.com/username4202/GreenBusters.git
cd GreenBusters
\```

### 2. Backend 설정

`backend` 디렉토리로 이동하여 필요한 패키지를 설치합니다:

\```bash
cd backend
npm install
\```

환경 변수를 설정합니다. `.env` 파일을 생성하고 아래와 같은 내용을 추가하세요:

\```env
DATABASE_URL=mongodb://localhost:27017/greenbusters
ETHEREUM_NETWORK=http://localhost:8545
IPFS_API_URL=https://ipfs.infura.io:5001
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
\```

서버를 실행합니다:

\```bash
npm start
\```

### 3. Frontend 설정

`frontend` 디렉토리로 이동하여 필요한 패키지를 설치합니다:

\```bash
cd ../frontend
npm install
\```

프론트엔드 애플리케이션을 실행합니다:

\```bash
npm start
\```

### 4. Smart Contracts 설정

`smart-contracts` 디렉토리로 이동하여 Hardhat 환경을 설정하고 스마트 계약을 배포합니다:

\```bash
cd ../smart-contracts
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network localhost
\```

### 5. Git 사용

프로젝트에 변경 사항이 있을 때마다 커밋하고, 팀원들과 공유하세요:

\```bash
git add .
git commit -m "Your message"
git push origin main
\```

## 중요한 정보

### 환경 변수

- `.env` 파일에 민감한 정보를 포함시키지 않도록 주의하세요.
- `.gitignore` 파일에 `.env`를 추가하여 Git에 커밋되지 않도록 설정했습니다.

### 데이터베이스

- 이 프로젝트는 MongoDB를 사용합니다. 로컬에서 MongoDB 인스턴스를 실행 중인지 확인하세요.
- `DATABASE_URL`을 통해 MongoDB에 연결됩니다.

### 블록체인

- 이더리움 네트워크는 로컬에서 실행 중인 테스트 노드를 사용하거나, Infura와 같은 서비스로 연결할 수 있습니다.
- 스마트 계약 배포 및 테스트에 Hardhat을 사용합니다.

## 기여

프로젝트에 기여하고 싶다면, 먼저 이슈를 생성하거나 팀과 상의해 주세요. 기여를 환영합니다!

## 라이센스

이 프로젝트는 [MIT 라이센스](LICENSE) 하에 배포됩니다.
