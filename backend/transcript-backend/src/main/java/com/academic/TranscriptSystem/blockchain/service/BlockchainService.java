package com.academic.TranscriptSystem.blockchain.service;

import com.academic.TranscriptSystem.blockchain.dto.BlockchainResponse;

public interface BlockchainService {

    BlockchainResponse storeHash(String hash) throws Exception;
    String getHashFromBlockchain(Long recordId) throws Exception;
    Long getLatestRecordId();
}
