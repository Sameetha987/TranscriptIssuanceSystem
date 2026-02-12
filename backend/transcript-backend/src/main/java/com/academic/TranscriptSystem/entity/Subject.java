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

    private String code;
    private String name;
    private Integer credits;
    private Integer marks;
    private String grade;
}
