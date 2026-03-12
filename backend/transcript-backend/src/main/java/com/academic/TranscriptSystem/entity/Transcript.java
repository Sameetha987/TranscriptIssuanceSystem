package com.academic.TranscriptSystem.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(
        name = "transcripts",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"student_id", "semester"})
        },
        indexes = {
                @Index(name = "idx_student", columnList = "student_id"),
                @Index(name = "idx_blockchain_record", columnList = "blockchainRecordId")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Transcript {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnoreProperties({"transcripts"})
    private Student student;

    private String program;

    private Integer semester;

    private Double cgpa;
    @Column(nullable = false)
    private boolean active = true;
    private Long blockchainRecordId;
    private String blockchainHash;
    private String blockchainTxId;

    @OneToMany(mappedBy = "transcript", cascade = CascadeType.ALL)
    private List<Subject> subjects;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String issuedBy;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
    @Column(name = "verification_status")
    private String verificationStatus;

    @Column(name = "last_verified_at")
    private LocalDateTime lastVerifiedAt;
}