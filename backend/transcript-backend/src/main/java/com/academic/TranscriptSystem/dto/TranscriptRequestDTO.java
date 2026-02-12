package com.academic.TranscriptSystem.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class TranscriptRequestDTO {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Student Email is required")
    private String studentEmail;

    @NotNull(message = "Semester is required")
    @Positive(message = "Semester must be greater than 0")
    private Integer semester;

    @NotNull(message = "CGPA is required")
    private Double cgpa;

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentEmail() {        // ADD
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {   // ADD
        this.studentEmail = studentEmail;
    }

    public Integer getSemester() {
        return semester;
    }

    public void setSemester(Integer semester) {
        this.semester = semester;
    }

    public Double getCgpa() {
        return cgpa;
    }

    public void setCgpa(Double cgpa) {
        this.cgpa = cgpa;
    }
}