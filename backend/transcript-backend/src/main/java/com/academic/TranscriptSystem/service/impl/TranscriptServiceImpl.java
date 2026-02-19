package com.academic.TranscriptSystem.service.impl;

import com.academic.TranscriptSystem.blockchain.service.BlockchainService;
import com.academic.TranscriptSystem.entity.Transcript;
import com.academic.TranscriptSystem.repository.TranscriptRepository;
import com.academic.TranscriptSystem.security.HashUtil;
import com.academic.TranscriptSystem.service.TranscriptService;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Service
public class TranscriptServiceImpl implements TranscriptService {

    private final TranscriptRepository transcriptRepository;
    private final BlockchainService blockchainService;
    private static final Logger log = LoggerFactory.getLogger(TranscriptServiceImpl.class);

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
        log.info("Generated hash for student {} : {}", transcript.getStudentEmail(), hash);

        transcript.setBlockchainHash(hash);

        // store hash to blockchain
        String txId = blockchainService.storeHash(hash);

        transcript.setBlockchainTxId(txId);
        log.info("Stored hash on blockchain. TxId: {}", txId);
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


}
