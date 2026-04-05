package com.academic.TranscriptSystem.controller;

import com.academic.TranscriptSystem.dto.StudentDTO;
import com.academic.TranscriptSystem.dto.StudentProfileDTO;
import com.academic.TranscriptSystem.dto.TranscriptSummaryDTO;
import com.academic.TranscriptSystem.entity.Student;
import com.academic.TranscriptSystem.exception.ResourceNotFoundException;
import com.academic.TranscriptSystem.repository.StudentRepository;
import com.academic.TranscriptSystem.response.ApiResponse;
import com.academic.TranscriptSystem.service.ActivityLogService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.academic.TranscriptSystem.dto.PasswordResetDTO;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/students")
public class AdminStudentController {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final ActivityLogService activityLogService;

    public AdminStudentController(StudentRepository studentRepository,
                                  PasswordEncoder passwordEncoder, ActivityLogService activityLogService) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
        this.activityLogService = activityLogService;
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

        // Save student first
        Student saved = studentRepository.save(student);

        // Log activity
        activityLogService.log(
                "CREATE_STUDENT",
                null,
                "Student created: Roll " + saved.getStudentRoll()
        );

        return new ApiResponse<>(true, "Student created successfully", saved);
    }

    @GetMapping
    public Page<Student> getStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id,asc") String sort) {

        String[] sortParams = sort.split(",");
        Sort.Direction direction = Sort.Direction.fromString(sortParams[1]);

        PageRequest pageable = PageRequest.of(
                page,
                size,
                Sort.by(direction, sortParams[0])
        );

        return studentRepository.findByActiveTrue(pageable);
    }
    @GetMapping("/{id}")
    public ApiResponse<StudentProfileDTO> getStudentById(@PathVariable Long id) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

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
    @PutMapping("/{id}/reset-password")
    public ApiResponse<String> resetPassword(
            @PathVariable Long id,
            @RequestBody PasswordResetDTO dto) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        student.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        studentRepository.save(student);

        return new ApiResponse<>(true, "Password reset successful", null);
    }
    @PutMapping("/{id}/archive")
    public ApiResponse<String> archiveStudent(@PathVariable Long id) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        student.setActive(false);
        studentRepository.save(student);

        activityLogService.log(
                "ARCHIVE_STUDENT",
                null,
                "Archived student: " + student.getStudentRoll()
        );

        return new ApiResponse<>(true, "Student archived successfully", null);
    }
    @PutMapping("/{id}/unarchive")
    public ApiResponse<String> unarchiveStudent(@PathVariable Long id) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        student.setActive(true);
        studentRepository.save(student);

        return new ApiResponse<>(true, "Student restored", null);
    }
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteStudent(@PathVariable Long id) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        studentRepository.delete(student);

        activityLogService.log(
                "DELETE_STUDENT",
                null,
                "Deleted student: " + student.getStudentRoll()
        );

        return new ApiResponse<>(true, "Student deleted successfully", null);
    }
}