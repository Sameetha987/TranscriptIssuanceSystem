package com.academic.TranscriptSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TranscriptVerificationResponseDTO {

    private Long transcriptId;
    private String studentEmail;
    private String status;
    private String qrCode;
}
