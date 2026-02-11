package com.academic.TranscriptSystem.service.impl;

import com.academic.TranscriptSystem.entity.Transcript;
import com.academic.TranscriptSystem.repository.TranscriptRepository;
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
}
