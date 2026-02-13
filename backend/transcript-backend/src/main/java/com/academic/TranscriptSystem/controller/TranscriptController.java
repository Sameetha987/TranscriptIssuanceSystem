package com.academic.TranscriptSystem.controller;

import com.academic.TranscriptSystem.dto.VerificationResponseDTO;
import com.academic.TranscriptSystem.entity.Transcript;
import com.academic.TranscriptSystem.service.PdfService;
import com.academic.TranscriptSystem.service.TranscriptService;
import com.academic.TranscriptSystem.response.ApiResponse;
import com.academic.TranscriptSystem.dto.TranscriptRequestDTO;
import org.springframework.security.core.Authentication;
import com.academic.TranscriptSystem.dto.TranscriptVerificationResponseDTO;
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
    public ApiResponse<Transcript> issueTranscript(@Valid @RequestBody TranscriptRequestDTO request) {

        Transcript transcript = new Transcript();
        transcript.setStudentId(request.getStudentId());
        transcript.setStudentEmail(request.getStudentEmail());
        transcript.setStudentName(request.getStudentName());
        transcript.setProgram(request.getProgram());
        transcript.setDepartment(request.getDepartment());
        transcript.setSemester(request.getSemester());
        transcript.setCgpa(request.getCgpa());
        transcript.setBlockchainHash("pending");

        Transcript saved = transcriptService.issueTranscript(transcript);

        return new ApiResponse<>(true, "Transcript issued successfully", saved);
    }


    // Get Student Transcripts
    @GetMapping("/my")
    public List<Transcript> getMyTranscripts(Authentication authentication) {

        String email = authentication.getName();

        return transcriptService.getTranscriptsByStudentEmail(email);
    }

    // Get Transcript by ID
    @GetMapping("/{id}")
    public Transcript getTranscriptById(@PathVariable Long id) {

        return transcriptService.getTranscriptById(id);
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


}



