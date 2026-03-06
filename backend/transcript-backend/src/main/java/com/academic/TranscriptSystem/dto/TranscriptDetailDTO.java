package com.academic.TranscriptSystem.dto;

public class TranscriptDetailDTO {

    private Long id;
    private String studentName;
    private String studentEmail;
    private String department;
    private String program;
    private Integer semester;
    private Double cgpa;

    private Long blockchainRecordId;
    private String blockchainTxId;
    private String blockchainHash;

    public TranscriptDetailDTO() {}

    public TranscriptDetailDTO(Long id,
                               String studentName,
                               String studentEmail,
                               String department,
                               String program,
                               Integer semester,
                               Double cgpa,
                               Long blockchainRecordId,
                               String blockchainTxId,
                               String blockchainHash) {

        this.id = id;
        this.studentName = studentName;
        this.studentEmail = studentEmail;
        this.department = department;
        this.program = program;
        this.semester = semester;
        this.cgpa = cgpa;
        this.blockchainRecordId = blockchainRecordId;
        this.blockchainTxId = blockchainTxId;
        this.blockchainHash = blockchainHash;
    }

    public Long getId() { return id; }
    public String getStudentName() { return studentName; }
    public String getStudentEmail() { return studentEmail; }
    public String getDepartment() { return department; }
    public String getProgram() { return program; }
    public Integer getSemester() { return semester; }
    public Double getCgpa() { return cgpa; }
    public Long getBlockchainRecordId() { return blockchainRecordId; }
    public String getBlockchainTxId() { return blockchainTxId; }
    public String getBlockchainHash() { return blockchainHash; }

    public void setId(Long id) { this.id = id; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }
    public void setDepartment(String department) { this.department = department; }
    public void setProgram(String program) { this.program = program; }
    public void setSemester(Integer semester) { this.semester = semester; }
    public void setCgpa(Double cgpa) { this.cgpa = cgpa; }
    public void setBlockchainRecordId(Long blockchainRecordId) { this.blockchainRecordId = blockchainRecordId; }
    public void setBlockchainTxId(String blockchainTxId) { this.blockchainTxId = blockchainTxId; }
    public void setBlockchainHash(String blockchainHash) { this.blockchainHash = blockchainHash; }
}
