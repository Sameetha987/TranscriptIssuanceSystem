package com.academic.TranscriptSystem.service.impl;

import com.academic.TranscriptSystem.entity.Subject;
import com.academic.TranscriptSystem.repository.SubjectRepository;
import com.academic.TranscriptSystem.service.SubjectService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;

    public SubjectServiceImpl(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    @Override
    public Subject addSubject(Subject subject) {
        return subjectRepository.save(subject);
    }

    @Override
    public List<Subject> getSubjectsByTranscript(Long transcriptId) {
        return subjectRepository.findByTranscriptId(transcriptId);
    }
}
