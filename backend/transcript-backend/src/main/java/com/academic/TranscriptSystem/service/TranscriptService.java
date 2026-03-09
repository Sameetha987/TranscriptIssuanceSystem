package com.academic.TranscriptSystem.service;

import com.academic.TranscriptSystem.dto.DashboardStatsDTO;
import com.academic.TranscriptSystem.dto.IssueTranscriptDTO;
import com.academic.TranscriptSystem.dto.TranscriptDetailDTO;
import com.academic.TranscriptSystem.entity.Transcript;
import org.springframework.data.domain.Page;

import java.util.List;


public interface TranscriptService {

    // Issue new transcript
    Transcript issueTranscript(IssueTranscriptDTO request);
    //Fetch all transcripts
    Page<Transcript> getTranscripts(int page, int size, String search, String status);
    // Get transcript by email ID
    List<Transcript> getTranscriptsByStudentEmail(String email);
    long getTotalTranscripts();

    DashboardStatsDTO getDashboardStats();
    Page<Transcript> searchTranscripts(String search, int page, int size, String status);

    void deleteTranscript(Long id);

    TranscriptDetailDTO getTranscriptById(Long id);
}
