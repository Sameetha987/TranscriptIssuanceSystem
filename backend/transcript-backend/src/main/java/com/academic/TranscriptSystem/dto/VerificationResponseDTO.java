package com.academic.TranscriptSystem.dto;

public class VerificationResponseDTO {

    private boolean valid;
    private String message;

    public VerificationResponseDTO(boolean valid, String message) {
        this.valid = valid;
        this.message = message;
    }

    public boolean isValid() {
        return valid;
    }

    public String getMessage() {
        return message;
    }
}
