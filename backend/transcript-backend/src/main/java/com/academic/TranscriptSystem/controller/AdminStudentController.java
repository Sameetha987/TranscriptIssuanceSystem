package com.academic.TranscriptSystem.controller;

import com.academic.TranscriptSystem.dto.StudentDTO;
import com.academic.TranscriptSystem.dto.StudentProfileDTO;
import com.academic.TranscriptSystem.dto.TranscriptSummaryDTO;
import com.academic.TranscriptSystem.entity.Student;
import com.academic.TranscriptSystem.repository.StudentRepository;
import com.academic.TranscriptSystem.response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/students")
public class AdminStudentController {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminStudentController(StudentRepository studentRepository,
                                  PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/create")
    public ApiResponse<Student> createStudent(@Valid @RequestBody StudentDTO dto) {

        if (studentRepository.findByStudentRoll(dto.getStudentRoll()).isPresent()) {
            return new ApiResponse<>(false, "Student roll already exists", null);
        }

        if (studentRepository.findByEmail(dto.getEmail()).isPresent()) {
            return new ApiResponse<>(false, "Email already exists", null);
        }

        Student student = new Student();
        student.setStudentRoll(dto.getStudentRoll());
        student.setName(dto.getName());
        student.setEmail(dto.getEmail());
        student.setDepartment(dto.getDepartment());
        student.setPassword(passwordEncoder.encode(dto.getPassword()));

        return new ApiResponse<>(true, "Student created successfully",
                studentRepository.save(student));
    }
    @GetMapping("/all")
    public ApiResponse<List<Student>> getAllStudents() {
        return new ApiResponse<>(
                true,
                "Students fetched",
                studentRepository.findAll()
        );
    }
    @GetMapping("/{id}")
    public ApiResponse<StudentProfileDTO> getStudentById(@PathVariable Long id) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        StudentProfileDTO dto = new StudentProfileDTO();
        dto.setId(student.getId());
        dto.setStudentRoll(student.getStudentRoll());
        dto.setName(student.getName());
        dto.setEmail(student.getEmail());
        dto.setDepartment(student.getDepartment());

        List<TranscriptSummaryDTO> transcriptDTOs =
                student.getTranscripts().stream().map(t -> {
                    TranscriptSummaryDTO tdto = new TranscriptSummaryDTO();
                    tdto.setId(t.getId());
                    tdto.setSemester(t.getSemester());
                    tdto.setCgpa(t.getCgpa());
                    tdto.setBlockchainRecordId(t.getBlockchainRecordId());
                    return tdto;
                }).toList();

        dto.setTranscripts(transcriptDTOs);

        return new ApiResponse<>(true, "Student fetched", dto);
    }
}