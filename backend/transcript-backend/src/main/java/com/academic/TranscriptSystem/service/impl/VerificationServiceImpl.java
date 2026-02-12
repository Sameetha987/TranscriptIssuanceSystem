package com.academic.TranscriptSystem.service.impl;

import com.academic.TranscriptSystem.blockchain.service.BlockchainService;
import com.academic.TranscriptSystem.dto.TranscriptVerificationResponseDTO;
import com.academic.TranscriptSystem.entity.Transcript;
import com.academic.TranscriptSystem.repository.TranscriptRepository;
import com.academic.TranscriptSystem.security.HashUtil;
import com.academic.TranscriptSystem.service.VerificationService;
import com.academic.TranscriptSystem.util.QRCodeUtil;
import org.springframework.stereotype.Service;

@Service
public class VerificationServiceImpl implements VerificationService {

    private final TranscriptRepository transcriptRepository;
    private final BlockchainService blockchainService;

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

        String blockchainHash = blockchainService.getHashFromBlockchain(transcript.getBlockchainTxId());

        String dataToHash = transcript.getStudentId() +
                transcript.getStudentEmail() +
                transcript.getSemester() +
                transcript.getCgpa();

        String recalculatedHash = HashUtil.generateHash(dataToHash);

        boolean valid = recalculatedHash.equals(blockchainHash);

        String status = valid ? "AUTHENTIC" : "TAMPERED";

        /* ---------- QR GENERATION ---------- */

        String verifyUrl = "http://localhost:8080/api/verify/" + transcriptId;

        String qrCodeBase64 = QRCodeUtil.generateBase64QRCode(verifyUrl);

        return new TranscriptVerificationResponseDTO(
                transcriptId,
                transcript.getStudentEmail(),
                status,
                qrCodeBase64
        );
    }

}
