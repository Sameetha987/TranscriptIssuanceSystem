package com.academic.TranscriptSystem.dto;

import lombok.Data;
import java.util.List;

@Data
public class StudentProfileDTO {

    private Long id;
    private String studentRoll;
    private String name;
    private String email;
    private String department;
    private List<TranscriptSummaryDTO> transcripts;

}