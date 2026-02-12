package com.academic.TranscriptSystem.service;

import jakarta.servlet.http.HttpServletResponse;

public interface PdfService {
    void generateTranscriptPdf(Long transcriptId, HttpServletResponse response);
}
