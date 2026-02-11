package com.academic.TranscriptSystem.controller;

import com.academic.TranscriptSystem.entity.Transcript;
import com.academic.TranscriptSystem.service.TranscriptService;
import com.academic.TranscriptSystem.response.ApiResponse;
import com.academic.TranscriptSystem.dto.TranscriptRequestDTO;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transcripts")
public class TranscriptController {

    private final TranscriptService transcriptService;

    public TranscriptController(TranscriptService transcriptService) {
        this.transcriptService = transcriptService;
    }

    // Issue Transcript
    @PostMapping("/issue")
    public ApiResponse<Transcript> issueTranscript(@Valid @RequestBody TranscriptRequestDTO request) {

        Transcript transcript = new Transcript();
        transcript.setStudentId(request.getStudentId());
        transcript.setSemester(request.getSemester());
        transcript.setCgpa(request.getCgpa());
        transcript.setBlockchainHash("pending");

        Transcript saved = transcriptService.issueTranscript(transcript);

        return new ApiResponse<>(true, "Transcript issued successfully", saved);
    }


    // Get Student Transcripts
    @GetMapping("/student/{studentId}")
    public List<Transcript> getStudentTranscripts(@PathVariable Long studentId) {
        return transcriptService.getStudentTranscripts(studentId);
    }

    // Get Transcript by ID
    @GetMapping("/{id}")
    public Transcript getTranscriptById(@PathVariable Long id) {
        return transcriptService.getTranscriptById(id);
    }
}
