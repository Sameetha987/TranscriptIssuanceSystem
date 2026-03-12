package com.academic.TranscriptSystem.dto;

public class DashboardStatsDTO {

    private long total;
    private long authentic;
    private long tampered;
    private long students;

    public DashboardStatsDTO(long total, long authentic, long tampered, long students) {
        this.total = total;
        this.authentic = authentic;
        this.tampered = tampered;
        this.students = students;
    }

    public long getTotal() { return total; }
    public long getAuthentic() { return authentic; }
    public long getTampered() { return tampered; }

    public long getStudents() {
        return students;
    }
}