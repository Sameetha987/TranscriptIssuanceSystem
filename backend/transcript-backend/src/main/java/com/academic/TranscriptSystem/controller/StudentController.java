package com.academic.TranscriptSystem.controller;

import com.academic.TranscriptSystem.dto.StudentProfileDTO;
import com.academic.TranscriptSystem.dto.TranscriptSummaryDTO;
import com.academic.TranscriptSystem.entity.Student;
import com.academic.TranscriptSystem.entity.Transcript;
import com.academic.TranscriptSystem.exception.ResourceNotFoundException;
import com.academic.TranscriptSystem.repository.StudentRepository;
import com.academic.TranscriptSystem.repository.TranscriptRepository;
import com.academic.TranscriptSystem.response.ApiResponse;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/student")
public class StudentController {

    private final StudentRepository studentRepository;
    private final TranscriptRepository transcriptRepository;

    public StudentController(StudentRepository studentRepository,
                             TranscriptRepository transcriptRepository) {
        this.studentRepository = studentRepository;
        this.transcriptRepository = transcriptRepository;
    }

    //  GET PROFILE
    @GetMapping("/profile")
    public ApiResponse<StudentProfileDTO> getProfile(Authentication authentication) {

        String email = authentication.getName();

        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        StudentProfileDTO dto = new StudentProfileDTO();
        dto.setId(student.getId());
        dto.setStudentRoll(student.getStudentRoll());
        dto.setName(student.getName());
        dto.setEmail(student.getEmail());
        dto.setDepartment(student.getDepartment());

        return new ApiResponse<>(true, "Profile fetched", dto);
    }

    //  GET MY TRANSCRIPTS
    @GetMapping("/transcripts")
    public ApiResponse<List<TranscriptSummaryDTO>> getMyTranscripts(Authentication authentication) {

        String email = authentication.getName();

        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        List<Transcript> transcripts =
                transcriptRepository.findByStudentId(student.getId());

        List<TranscriptSummaryDTO> result = transcripts.stream().map(t -> {
            TranscriptSummaryDTO dto = new TranscriptSummaryDTO();
            dto.setId(t.getId());
            dto.setSemester(t.getSemester());
            dto.setCgpa(t.getCgpa());
            dto.setBlockchainRecordId(t.getBlockchainRecordId());
            return dto;
        }).toList();

        return new ApiResponse<>(true, "Transcripts fetched", result);
    }
}