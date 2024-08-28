// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GreenWashingVerification {

    // 데이터 구조체: 해시 값, 제출자, 검증 여부, 찬성 표 수, 반대 표 수, 투표자들을 포함
    struct Data {
        string dataHash; // 데이터의 해시 값
        address submitter; // 데이터를 제출한 사람의 주소
        bool verified; // 데이터가 검증되었는지 여부
        uint approvalCount; // 찬성 표 수
        uint disapprovalCount; // 반대 표 수
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
    event DataSubmitted(uint dataId, string dataHash, address submitter);
    // 데이터가 검증될 때 발생하는 이벤트
    event DataVerified(uint dataId, bool isVerified, uint approvalCount, uint disapprovalCount);

    // 데이터를 제출하는 함수: 해시 값을 입력받아 데이터베이스에 저장
    function registerData(string memory _dataHash) public returns (uint) {
        // 중복 데이터 확인
        for (uint i = 1; i <= dataCount; i++) {
            require(
                keccak256(abi.encodePacked(dataRegistry[i].dataHash)) != keccak256(abi.encodePacked(_dataHash)),
                "Data already exists"
            );
        }

        dataCount++; // 데이터 ID 증가
        Data storage newData = dataRegistry[dataCount]; // 새로운 데이터 구조체 생성
        newData.dataHash = _dataHash; // 해시 값 저장
        newData.submitter = msg.sender; // 제출자 주소 저장
        newData.verified = false; // 초기 검증 상태는 false
        newData.approvalCount = 0; // 초기 찬성 표 수는 0
        newData.disapprovalCount = 0; // 초기 반대 표 수는 0

        emit DataSubmitted(dataCount, _dataHash, msg.sender);

        return dataCount; // 데이터 ID 반환
    }

    // 데이터를 검증하기 위해 투표하는 함수
    function voteForData(uint _dataId, bool approve) public onlyValidator {
        Data storage data = dataRegistry[_dataId]; // 데이터베이스에서 해당 데이터를 가져옴

        require(data.submitter != address(0), "Data does not exist"); // 데이터가 존재하는지 확인
        require(!data.voters[msg.sender], "You have already voted for this data"); // 중복 투표 방지
        require(!data.verified, "Data has already been verified"); // 이미 검증된 데이터에 대한 추가 투표 방지
        
        data.voters[msg.sender] = true; // 투표자를 기록

        if (approve) {
            data.approvalCount++; // 찬성 투표 증가
        } else {
            data.disapprovalCount++; // 반대 투표 증가
        }

        // 모든 검증자가 투표를 완료했을 때 검증 여부를 결정
        if (data.approvalCount + data.disapprovalCount == 3) {
            data.verified = data.approvalCount > data.disapprovalCount; // 찬성 표가 더 많은지 여부에 따라 검증 여부 결정
            emit DataVerified(_dataId, data.verified, data.approvalCount, data.disapprovalCount); // 데이터 검증 결과 이벤트 발생
        }
    }

    // 데이터가 검증되었는지 확인하는 함수
    function isDataVerified(string memory _dataHash) public view returns (bool) {
        for (uint i = 1; i <= dataCount; i++) {
            if (keccak256(abi.encodePacked(dataRegistry[i].dataHash)) == keccak256(abi.encodePacked(_dataHash))) {
                return dataRegistry[i].verified; // 검증 상태 반환
            }
        }
        return false; // 데이터가 없거나 검증되지 않은 경우 false 반환
    }

    // 데이터의 해시 값을 반환하는 함수
    function getDataHash(uint _dataId) public view returns (string memory) {
        Data storage data = dataRegistry[_dataId]; // 데이터베이스에서 해당 데이터를 가져옴
        require(data.submitter != address(0), "Data does not exist"); // 데이터가 존재하는지 확인
        
        if (data.verified) {
            return data.dataHash; // 검증된 경우 해시 값 반환
        } else {
            return "Data not yet verified"; // 검증되지 않은 경우 메시지 반환
        }   
    }
}
