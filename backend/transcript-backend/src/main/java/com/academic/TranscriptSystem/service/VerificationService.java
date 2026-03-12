package com.academic.TranscriptSystem.service;

import com.academic.TranscriptSystem.dto.TranscriptVerificationResponseDTO;

public interface VerificationService {

    TranscriptVerificationResponseDTO verifyTranscript(Long transcriptId);

    TranscriptVerificationResponseDTO reverifyTranscript(Long transcriptId);
}
