package com.academic.TranscriptSystem.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String action;

    private Long transcriptId;

    private String description;

    private LocalDateTime timestamp;

    public ActivityLog() {}

    public ActivityLog(String action, Long transcriptId, String description) {
        this.action = action;
        this.transcriptId = transcriptId;
        this.description = description;
        this.timestamp = LocalDateTime.now();
    }

    public Long getId() { return id; }

    public String getAction() { return action; }

    public Long getTranscriptId() { return transcriptId; }

    public String getDescription() { return description; }

    public LocalDateTime getTimestamp() { return timestamp; }
}