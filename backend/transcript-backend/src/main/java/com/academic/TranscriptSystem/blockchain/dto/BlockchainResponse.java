package com.academic.TranscriptSystem.blockchain.dto;

public class BlockchainResponse {

    private String txHash;
    private Long recordId;

    public BlockchainResponse(String txHash, Long recordId) {
        this.txHash = txHash;
        this.recordId = recordId;
    }

    public String getTxHash() {
        return txHash;
    }

    public Long getRecordId() {
        return recordId;
    }
}