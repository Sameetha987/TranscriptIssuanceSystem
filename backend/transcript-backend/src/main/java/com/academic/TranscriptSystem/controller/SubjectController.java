package com.academic.TranscriptSystem.controller;

import com.academic.TranscriptSystem.dto.SubjectRequestDTO;
import com.academic.TranscriptSystem.entity.Subject;
import com.academic.TranscriptSystem.service.SubjectService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    private final SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @PostMapping("/add")
    public Subject addSubject(@RequestBody SubjectRequestDTO dto) {

        Subject subject = new Subject();
        subject.setTranscriptId(dto.getTranscriptId());
        subject.setCode(dto.getCode());
        subject.setName(dto.getName());
        subject.setCredits(dto.getCredits());
        subject.setMarks(dto.getMarks());
        subject.setGrade(dto.getGrade());

        return subjectService.addSubject(subject);
    }

    @GetMapping("/transcript/{id}")
    public List<Subject> getSubjects(@PathVariable Long id) {
        return subjectService.getSubjectsByTranscript(id);
    }
}
