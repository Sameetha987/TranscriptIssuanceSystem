package com.academic.TranscriptSystem.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class TranscriptRequestDTO {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Student Email is required")
    private String studentEmail;

    @NotNull(message = "Student Name is required")
    private String studentName;

    @NotNull(message = "Program is required")
    private String program;

    @NotNull(message = "Department is required")
    private String department;


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
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getProgram() { return program; }
    public void setProgram(String program) { this.program = program; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

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