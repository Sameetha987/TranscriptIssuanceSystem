package com.academic.TranscriptSystem.dto;

import lombok.Data;

@Data
public class SubjectRequestDTO {

    private Long transcriptId;
    private String code;
    private String name;
    private Integer credits;
    private Integer marks;
    private String grade;
}
