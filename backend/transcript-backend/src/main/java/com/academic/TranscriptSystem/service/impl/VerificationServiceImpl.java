package com.academic.TranscriptSystem.service.impl;

import com.academic.TranscriptSystem.blockchain.service.BlockchainService;
import com.academic.TranscriptSystem.dto.TranscriptVerificationResponseDTO;
import com.academic.TranscriptSystem.entity.Transcript;
import com.academic.TranscriptSystem.repository.TranscriptRepository;
import com.academic.TranscriptSystem.security.HashUtil;
import com.academic.TranscriptSystem.service.VerificationService;
import com.academic.TranscriptSystem.util.QRCodeUtil;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class VerificationServiceImpl implements VerificationService {

    private final TranscriptRepository transcriptRepository;
    private final BlockchainService blockchainService;
    private static final Logger log = LoggerFactory.getLogger(VerificationServiceImpl.class);
    public VerificationServiceImpl(TranscriptRepository transcriptRepository,
                                   BlockchainService blockchainService) {
        this.transcriptRepository = transcriptRepository;
        this.blockchainService = blockchainService;
    }

    @Override
    public TranscriptVerificationResponseDTO verifyTranscript(Long transcriptId) {

        Transcript transcript = transcriptRepository.findById(transcriptId).orElse(null);

        if (transcript == null) {
            return new TranscriptVerificationResponseDTO(
                    transcriptId,
                    null,
                    "NOT_FOUND",
                    null
            );
        }

        if (transcript.getBlockchainRecordId() == null) {
            return new TranscriptVerificationResponseDTO(
                    transcriptId,
                    transcript.getStudent().getEmail(),
                    "BLOCKCHAIN_NOT_FOUND",
                    null
            );
        }

        log.info("Verifying transcript ID: {}", transcriptId);

        String blockchainHash;

        try {

            blockchainHash =
                    blockchainService.getHashFromBlockchain(
                            transcript.getBlockchainRecordId()
                    );
        } catch (Exception e) {
            log.error("Blockchain verification failed", e);

            return new TranscriptVerificationResponseDTO(
                    transcriptId,
                    transcript.getStudent().getEmail(),
                    "BLOCKCHAIN_ERROR",
                    null
            );
        }

        String dataToHash =
                transcript.getStudent().getId() +
                        transcript.getStudent().getEmail() +
                        transcript.getSemester() +
                        transcript.getCgpa();

        String recalculatedHash = HashUtil.generateHash(dataToHash);

        log.info("Blockchain Hash: {}", blockchainHash);
        log.info("Recalculated Hash: {}", recalculatedHash);

        boolean valid = recalculatedHash.equals(blockchainHash);

        log.info("Verification result: {}", valid);

        String status = valid ? "AUTHENTIC" : "TAMPERED";

        String verifyUrl =
                "http://localhost:8080/api/transcripts/public/verify/" + transcriptId;

        String qrCodeBase64 =
                QRCodeUtil.generateBase64QRCode(verifyUrl);

        return new TranscriptVerificationResponseDTO(
                transcriptId,
                transcript.getStudent().getEmail(),
                status,
                qrCodeBase64
        );
    }


}
