// contracts/DataStorage.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DataStorage {
    mapping(address => string) private dataHashes;

    event DataUploaded(address indexed user, string dataHash);

    function uploadData(string memory dataHash) public {
        dataHashes[msg.sender] = dataHash;
        emit DataUploaded(msg.sender, dataHash);
    }

    function getData(address user) public view returns (string memory) {
        return dataHashes[user];
    }
}
