package com.academic.TranscriptSystem.controller;

import com.academic.TranscriptSystem.dto.StudentDTO;
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
    public ApiResponse<Student> getStudentById(@PathVariable Long id) {

        return new ApiResponse<>(
                true,
                "Student fetched",
                studentRepository.findById(id).orElse(null)
        );
    }
}