package com.academic.TranscriptSystem.blockchain.service;

public interface BlockchainService {

    String storeHash(String hash) throws Exception;
    String getHashFromBlockchain(String txId) throws Exception;
}
