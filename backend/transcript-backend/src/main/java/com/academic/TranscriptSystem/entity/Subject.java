package com.academic.TranscriptSystem.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "subjects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long transcriptId;

    private String subjectCode;
    private String subjectName;
    private Integer credits;
    private Double marks;
    private String grade;
}
