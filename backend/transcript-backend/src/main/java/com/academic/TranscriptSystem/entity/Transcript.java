package com.academic.TranscriptSystem.entity;

import com.academic.TranscriptSystem.dto.SubjectRequestDTO;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "transcripts", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"student_id", "semester"})
})
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
    private Student student;

    private String program;

    private Integer semester;

    private Double cgpa;

    private Long blockchainRecordId;
    private String blockchainHash;
    private String blockchainTxId;

    @OneToMany(mappedBy = "transcript", cascade = CascadeType.ALL)
    private List<Subject> subjects;
}