package com.academic.TranscriptSystem.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "transcripts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Transcript {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long studentId;

    private String studentEmail;

    private String studentName;

    private String program;

    private String department;

    private Integer semester;

    private Double cgpa;

    private Long blockchainRecordId;

    private String blockchainHash;

    private String blockchainTxId;

    private String qrCodeUrl;

}
