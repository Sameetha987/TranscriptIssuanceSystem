package com.academic.TranscriptSystem.service;

import com.academic.TranscriptSystem.entity.Transcript;

public interface HashService {

    String generateTranscriptHash(Transcript transcript);

}