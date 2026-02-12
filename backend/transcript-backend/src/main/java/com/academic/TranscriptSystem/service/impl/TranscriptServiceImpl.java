package com.academic.TranscriptSystem.service.impl;

import com.academic.TranscriptSystem.entity.Transcript;
import com.academic.TranscriptSystem.repository.TranscriptRepository;
import com.academic.TranscriptSystem.security.HashUtil;
import com.academic.TranscriptSystem.service.TranscriptService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TranscriptServiceImpl implements TranscriptService {

    private final TranscriptRepository transcriptRepository;

    public TranscriptServiceImpl(TranscriptRepository transcriptRepository) {
        this.transcriptRepository = transcriptRepository;
    }

    @Override
    public Transcript issueTranscript(Transcript transcript) {
        String dataToHash = transcript.getStudentId() +
                transcript.getStudentEmail() +
                transcript.getSemester() +
                transcript.getCgpa();

        String hash = HashUtil.generateHash(dataToHash);

        transcript.setBlockchainHash(hash);
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
