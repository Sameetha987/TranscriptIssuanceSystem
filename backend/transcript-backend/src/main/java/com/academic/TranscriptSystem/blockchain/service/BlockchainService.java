package com.academic.TranscriptSystem.blockchain.service;

public interface BlockchainService {

    String storeHash(String hash) throws Exception;
    String getHashFromBlockchain(Long recordId) throws Exception;
    Long getLatestRecordId();
}
