package com.academic.TranscriptSystem.controller;

import com.academic.TranscriptSystem.dto.*;
import com.academic.TranscriptSystem.entity.Transcript;
import com.academic.TranscriptSystem.service.PdfService;
import com.academic.TranscriptSystem.service.TranscriptService;
import com.academic.TranscriptSystem.response.ApiResponse;
import org.springframework.security.core.Authentication;
import com.academic.TranscriptSystem.service.VerificationService;
import com.academic.TranscriptSystem.service.PdfService;
import jakarta.servlet.http.HttpServletResponse;




import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transcripts")
public class TranscriptController {

    private final TranscriptService transcriptService;
    private final VerificationService verificationService;
    private final PdfService pdfService;

    public TranscriptController(TranscriptService transcriptService,
                                VerificationService verificationService, PdfService pdfService) {
        this.transcriptService = transcriptService;
        this.verificationService = verificationService;
        this.pdfService = pdfService;
    }


    // Issue Transcript
    @PostMapping("/issue")
    public ApiResponse<Transcript> issueTranscript(@RequestBody IssueTranscriptDTO request) {

        Transcript transcript = transcriptService.issueTranscript(request);

        return new ApiResponse<>(true, "Transcript issued successfully", transcript);
    }
    @GetMapping
    public List<Transcript> getAllTranscripts() {
        return transcriptService.getAllTranscripts();
    }

    // Get Student Transcripts
    @GetMapping("/my")
    public List<Transcript> getMyTranscripts(Authentication authentication) {

        String email = authentication.getName();

        return transcriptService.getTranscriptsByStudentEmail(email);
    }

    // Get Transcript by ID
    @GetMapping("/student/{id}")
    public List<Transcript> getStudentTranscripts(@PathVariable Long id) {
        return transcriptService.getTranscriptsByStudentId(id);
    }

    @GetMapping("/verify/{id}")
    public ApiResponse<TranscriptVerificationResponseDTO> verifyTranscript(@PathVariable Long id) {

        TranscriptVerificationResponseDTO response =
                verificationService.verifyTranscript(id);

        return new ApiResponse<>(
                true,
                "Verification completed",
                response
        );
    }


    @GetMapping("/{id}/pdf")
    public void downloadTranscript(@PathVariable Long id,
                                   HttpServletResponse response) {

        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition",
                "attachment; filename=transcript_" + id + ".pdf");

        pdfService.generateTranscriptPdf(id, response);
    }
    @GetMapping("/public/verify/{id}")
    public TranscriptVerificationResponseDTO publicVerify(@PathVariable Long id) {

        return verificationService.verifyTranscript(id);

    }
    @GetMapping("/dashboard")
    public DashboardStatsDTO getDashboardStats() {
        return transcriptService.getDashboardStats();
    }

}



