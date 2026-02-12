package com.academic.TranscriptSystem.service.impl;

import com.academic.TranscriptSystem.blockchain.service.BlockchainService;
import com.academic.TranscriptSystem.dto.VerificationResponseDTO;
import com.academic.TranscriptSystem.entity.Transcript;
import com.academic.TranscriptSystem.repository.TranscriptRepository;
import com.academic.TranscriptSystem.security.HashUtil;
import com.academic.TranscriptSystem.service.TranscriptService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TranscriptServiceImpl implements TranscriptService {

    private final TranscriptRepository transcriptRepository;
    private final BlockchainService blockchainService;

    public TranscriptServiceImpl(TranscriptRepository transcriptRepository,
                                 BlockchainService blockchainService) {
        this.transcriptRepository = transcriptRepository;
        this.blockchainService = blockchainService;
    }

    @Override
    public Transcript issueTranscript(Transcript transcript) {

        String dataToHash =
                transcript.getStudentId() +
                        transcript.getStudentEmail() +
                        transcript.getSemester() +
                        transcript.getCgpa();

        String hash = HashUtil.generateHash(dataToHash);

        transcript.setBlockchainHash(hash);

        // store hash to blockchain
        String txId = blockchainService.storeHash(hash);

        transcript.setBlockchainTxId(txId);

        return transcriptRepository.save(transcript);
    }


    @Override
    public List<Transcript> getStudentTranscripts(Long studentId) {
        return transcriptRepository.findByStudentId(studentId);
    }

    @Override
    public Transcript getTranscriptById(Long transcriptId) {
        return transcriptRepository.findById(transcriptId).orElse(null);
    }

    @Override
    public List<Transcript> getTranscriptsByStudentEmail(String email) {
        return transcriptRepository.findByStudentEmail(email);
    }

    @Override
    public VerificationResponseDTO verifyTranscript(Long transcriptId) {

        Transcript transcript =
                transcriptRepository.findById(transcriptId).orElse(null);

        if (transcript == null) {
            return new VerificationResponseDTO(false, "Transcript not found");
        }

        String recalculatedHash =
                HashUtil.generateHash(
                        transcript.getStudentId() +
                                transcript.getStudentEmail() +
                                transcript.getSemester() +
                                transcript.getCgpa()
                );

        String blockchainHash =
                blockchainService.getHashFromBlockchain(transcript.getBlockchainTxId());

        if (recalculatedHash.equals(blockchainHash)) {
            return new VerificationResponseDTO(true, "Transcript VERIFIED");
        } else {
            return new VerificationResponseDTO(false, "Transcript TAMPERED");
        }
    }

}
