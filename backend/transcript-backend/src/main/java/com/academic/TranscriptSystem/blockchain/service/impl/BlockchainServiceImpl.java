package com.academic.TranscriptSystem.blockchain.service.impl;

import com.academic.TranscriptSystem.blockchain.service.BlockchainService;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class BlockchainServiceImpl implements BlockchainService {

    @Override
    public String storeHash(String hash) {
        return "TX-" + UUID.randomUUID();
    }

    @Override
    public String getHashFromBlockchain(String txId) {
        return "samplehash"; // later will call smart contract
    }

}
