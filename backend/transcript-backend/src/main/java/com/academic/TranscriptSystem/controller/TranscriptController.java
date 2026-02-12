package com.academic.TranscriptSystem.controller;

import com.academic.TranscriptSystem.dto.VerificationResponseDTO;
import com.academic.TranscriptSystem.entity.Transcript;
import com.academic.TranscriptSystem.service.TranscriptService;
import com.academic.TranscriptSystem.response.ApiResponse;
import com.academic.TranscriptSystem.dto.TranscriptRequestDTO;
import org.springframework.security.core.Authentication;
import com.academic.TranscriptSystem.dto.TranscriptVerificationResponseDTO;
import com.academic.TranscriptSystem.service.VerificationService;



import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transcripts")
public class TranscriptController {

    private final TranscriptService transcriptService;
    private final VerificationService verificationService;

    public TranscriptController(TranscriptService transcriptService,
                                VerificationService verificationService) {
        this.transcriptService = transcriptService;
        this.verificationService = verificationService;
    }


    // Issue Transcript
    @PostMapping("/issue")
    public ApiResponse<Transcript> issueTranscript(@Valid @RequestBody TranscriptRequestDTO request) {

        Transcript transcript = new Transcript();
        transcript.setStudentId(request.getStudentId());
        transcript.setStudentEmail(request.getStudentEmail());
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


}



