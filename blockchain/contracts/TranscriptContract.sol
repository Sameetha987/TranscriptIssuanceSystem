// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TranscriptContract {

    struct TranscriptRecord {
        string hash;
        uint256 timestamp;
    }

    mapping(uint256 => TranscriptRecord) public records;
    uint256 public recordCount;

    function storeHash(string memory _hash) public returns (uint256) {
        recordCount++;
        records[recordCount] = TranscriptRecord(_hash, block.timestamp);
        return recordCount;
    }

    function getHash(uint256 _id) public view returns (string memory) {
        return records[_id].hash;
    }
}
