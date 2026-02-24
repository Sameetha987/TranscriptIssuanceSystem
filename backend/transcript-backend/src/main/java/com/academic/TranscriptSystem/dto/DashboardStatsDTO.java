package com.academic.TranscriptSystem.dto;

public class DashboardStatsDTO {

    private long total;
    private long authentic;
    private long tampered;

    public DashboardStatsDTO(long total, long authentic, long tampered) {
        this.total = total;
        this.authentic = authentic;
        this.tampered = tampered;
    }

    public long getTotal() { return total; }
    public long getAuthentic() { return authentic; }
    public long getTampered() { return tampered; }
}