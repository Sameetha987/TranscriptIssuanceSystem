package com.academic.TranscriptSystem.dto;

import java.util.List;

public class IssueTranscriptDTO {

    private String studentRoll;   //
    private String program;

    public String getStudentRoll() {
        return studentRoll;
    }

    public void setStudentRoll(String studentRoll) {
        this.studentRoll = studentRoll;
    }

    public String getProgram() {
        return program;
    }

    public void setProgram(String program) {
        this.program = program;
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

    private Integer semester;
    private Double cgpa;

    private List<SubjectRequestDTO> subjects;

}