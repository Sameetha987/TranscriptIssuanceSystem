package com.academic.TranscriptSystem.blockchain.service.impl;

import com.academic.TranscriptSystem.blockchain.service.BlockchainService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class BlockchainServiceImpl implements BlockchainService {

    private final Map<String, String> blockchainStorage = new HashMap<>();

    @Override
    public String storeHash(String hash) {
        String txId = "TX-" + UUID.randomUUID();
        blockchainStorage.put(txId, hash);
        return txId;
    }

    @Override
    public String getHashFromBlockchain(String txId) {
        return blockchainStorage.get(txId);
    }
}
