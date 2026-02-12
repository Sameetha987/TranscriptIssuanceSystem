package com.academic.TranscriptSystem.blockchain.service;

public interface BlockchainService {

    String storeHash(String hash);

    String getHashFromBlockchain(String txId);
}
