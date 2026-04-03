package com.academic.TranscriptSystem.service.impl;

import com.academic.TranscriptSystem.blockchain.dto.BlockchainResponse;
import com.academic.TranscriptSystem.blockchain.service.BlockchainService;
import com.academic.TranscriptSystem.dto.DashboardStatsDTO;
import com.academic.TranscriptSystem.dto.IssueTranscriptDTO;
import com.academic.TranscriptSystem.dto.SubjectRequestDTO;
import com.academic.TranscriptSystem.dto.TranscriptDetailDTO;
import com.academic.TranscriptSystem.entity.Student;
import com.academic.TranscriptSystem.entity.Subject;
import com.academic.TranscriptSystem.entity.Transcript;
import com.academic.TranscriptSystem.exception.ResourceNotFoundException;
import com.academic.TranscriptSystem.repository.StudentRepository;
import com.academic.TranscriptSystem.repository.TranscriptRepository;
import com.academic.TranscriptSystem.service.ActivityLogService;
import com.academic.TranscriptSystem.service.HashService;
import com.academic.TranscriptSystem.service.TranscriptService;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class TranscriptServiceImpl implements TranscriptService {

    private final TranscriptRepository transcriptRepository;
    private final StudentRepository studentRepository;
    private final BlockchainService blockchainService;
    private final HashService hashService;
    private static final Logger log = LoggerFactory.getLogger(TranscriptServiceImpl.class);
    private final ActivityLogService activityLogService;

    public TranscriptServiceImpl(TranscriptRepository transcriptRepository,
                                 StudentRepository studentRepository,
                                 BlockchainService blockchainService, HashService hashService, ActivityLogService activityLogService) {

        this.transcriptRepository = transcriptRepository;
        this.studentRepository = studentRepository;
        this.blockchainService = blockchainService;
        this.hashService = hashService;
        this.activityLogService = activityLogService;
    }

    // ISSUE TRANSCRIPT

    @Override
    @Transactional
    public Transcript issueTranscript(IssueTranscriptDTO request) {

        // Find student by roll
        Student student = studentRepository
                .findByStudentRoll(request.getStudentRoll())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        boolean exists = transcriptRepository
                .existsByStudent_StudentRollAndSemesterAndActiveTrue(
                        request.getStudentRoll(),
                        request.getSemester()
                );

        if (exists) {
            throw new RuntimeException(
                    "Transcript already exists for this student and semester"
            );
        }
        //  Create transcript
        Transcript transcript = new Transcript();
        transcript.setStudent(student);
        transcript.setProgram(request.getProgram());
        transcript.setSemester(request.getSemester());
        transcript.setCgpa(request.getCgpa());
        transcript.setVerificationStatus("PENDING");
        //  Add subjects (relationship-based)
        List<Subject> subjectList = new ArrayList<>();

        for (SubjectRequestDTO s : request.getSubjects()) {

            Subject subject = new Subject();
            subject.setCode(s.getCode());
            subject.setName(s.getName());
            subject.setCredits(s.getCredits());
            subject.setMarks(s.getMarks());
            subject.setGrade(s.getGrade());

            subject.setTranscript(transcript); // relationship
            subjectList.add(subject);
        }

        transcript.setSubjects(subjectList);

        // Save transcript + subjects (cascade handles subjects)
        transcript = transcriptRepository.save(transcript);
        activityLogService.log(
                "ISSUE_TRANSCRIPT",
                transcript.getId(),
                "Transcript issued for Roll " + transcript.getStudent().getStudentRoll()
        );

        // Build hash
        String hash = hashService.generateTranscriptHash(transcript);
        transcript.setBlockchainHash(hash);

        try {
            System.out.println(" Calling blockchain...");

            BlockchainResponse response =
                    blockchainService.storeHash(hash);

            System.out.println(" Blockchain success");

            transcript.setBlockchainTxId(response.getTxHash());
            transcript.setBlockchainRecordId(response.getRecordId());
            transcript.setVerificationStatus("VERIFIED");
            transcript.setLastVerifiedAt(LocalDateTime.now());
        } catch (Exception e) {
            e.printStackTrace();
            log.error("Blockchain failed", e);

            transcript.setVerificationStatus("BLOCKCHAIN_ERROR");
        }
        return transcriptRepository.save(transcript);
    }

    @Override
    public Page<Transcript> searchTranscripts(String search, int page, int size, String status) {

        Pageable pageable = PageRequest.of(page, size);

        return transcriptRepository.searchTranscripts(search, pageable);
    }
    @Override
    public Page<Transcript> getTranscripts(int page, int size, String search, String status) {

        Pageable pageable = PageRequest.of(page, size);

        if (search != null && !search.isEmpty()) {
            return transcriptRepository.searchTranscripts(search, pageable);
        }

        return transcriptRepository.findByActiveTrue(pageable);
    }

    // GET BY STUDENT EMAIL

    @Override
    public List<Transcript> getTranscriptsByStudentEmail(String email) {
        return transcriptRepository.findByStudent_EmailAndActiveTrue(email);
    }

    // DASHBOARD STATS

    @Override
    public DashboardStatsDTO getDashboardStats() {

        long total = transcriptRepository.count();

        long authentic = transcriptRepository.countByVerificationStatus("VERIFIED");

        long tampered = transcriptRepository.countByVerificationStatus("TAMPERED");

        long students = studentRepository.count();

        return new DashboardStatsDTO(
                total,
                authentic,
                tampered,
                students
        );
    }
    @Override
    public long getTotalTranscripts() {
        return transcriptRepository.count();
    }
    @Override
    public void deleteTranscript(Long id) {

        Transcript transcript = transcriptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transcript not found"));

        transcript.setActive(false);
        activityLogService.log(
                "DELETE_TRANSCRIPT",
                id,
                "Transcript archived for Roll " + transcript.getStudent().getStudentRoll()
        );

        transcriptRepository.save(transcript);
    }
    @Override
    public TranscriptDetailDTO getTranscriptById(Long id) {

        Transcript t = transcriptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transcript not found"));

        TranscriptDetailDTO dto = new TranscriptDetailDTO();

        dto.setId(t.getId());
        dto.setStudentName(t.getStudent().getName());
        dto.setStudentEmail(t.getStudent().getEmail());
        dto.setDepartment(t.getStudent().getDepartment());
        dto.setProgram(t.getProgram());
        dto.setSemester(t.getSemester());
        dto.setCgpa(t.getCgpa());
        dto.setBlockchainRecordId(t.getBlockchainRecordId());
        dto.setBlockchainTxId(t.getBlockchainTxId());
        dto.setBlockchainHash(t.getBlockchainHash());

        return dto;
    }
}