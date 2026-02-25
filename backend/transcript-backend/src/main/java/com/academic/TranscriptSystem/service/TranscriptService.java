package com.academic.TranscriptSystem.service;

import com.academic.TranscriptSystem.dto.DashboardStatsDTO;
import com.academic.TranscriptSystem.dto.IssueTranscriptDTO;
import com.academic.TranscriptSystem.entity.Transcript;
import java.util.List;


public interface TranscriptService {

    // Issue new transcript
    Transcript issueTranscript(IssueTranscriptDTO request);

    // Get all transcripts of a student
    List<Transcript> getTranscriptsByStudentId(Long studentId);
    //Fetch all transcripts
    List<Transcript> getAllTranscripts();
    // Get transcript by email ID
    List<Transcript> getTranscriptsByStudentEmail(String email);
    long getTotalTranscripts();

    DashboardStatsDTO getDashboardStats();
}
