package com.academic.TranscriptSystem.service;

import com.academic.TranscriptSystem.entity.Subject;
import java.util.List;

public interface SubjectService {

    Subject addSubject(Subject subject);

    List<Subject> getSubjectsByTranscript(Long transcriptId);
}
