package com.academic.TranscriptSystem.service;

import com.academic.TranscriptSystem.entity.Transcript;
import java.util.List;

public interface TranscriptService {

    // Issue new transcript
    Transcript issueTranscript(Transcript transcript);

    // Get all transcripts of a student
    List<Transcript> getStudentTranscripts(Long studentId);

    // Get transcript by ID
    Transcript getTranscriptById(Long transcriptId);

    List<Transcript> getTranscriptsByStudentEmail(String email);
}
