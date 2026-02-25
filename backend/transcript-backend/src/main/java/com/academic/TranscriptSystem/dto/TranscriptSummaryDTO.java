package com.academic.TranscriptSystem.dto;

import lombok.Data;

@Data
public class TranscriptSummaryDTO {

    private Long id;
    private Integer semester;
    private Double cgpa;
    private Long blockchainRecordId;

}