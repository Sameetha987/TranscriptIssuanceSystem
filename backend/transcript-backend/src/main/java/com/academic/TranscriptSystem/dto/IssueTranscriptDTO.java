package com.academic.TranscriptSystem.dto;

import java.util.List;

public class IssueTranscriptDTO {

    private Long studentId;
    private String studentEmail;
    private String studentName;
    private String program;

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getProgram() {
        return program;
    }

    public void setProgram(String program) {
        this.program = program;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
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

    public List<SubjectRequestDTO> getSubjects() {
        return subjects;
    }

    public void setSubjects(List<SubjectRequestDTO> subjects) {
        this.subjects = subjects;
    }

    private String department;
    private Integer semester;
    private Double cgpa;

    private List<SubjectRequestDTO> subjects;

    // getters & setters
}
