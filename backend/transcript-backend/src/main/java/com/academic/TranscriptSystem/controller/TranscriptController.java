package com.academic.TranscriptSystem.controller;

import com.academic.TranscriptSystem.entity.Transcript;
import com.academic.TranscriptSystem.service.TranscriptService;
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
    public Transcript issueTranscript(@RequestBody Transcript transcript) {
        return transcriptService.issueTranscript(transcript);
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
