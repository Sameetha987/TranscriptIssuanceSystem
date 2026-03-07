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
import com.academic.TranscriptSystem.security.HashUtil;
import com.academic.TranscriptSystem.service.HashService;
import com.academic.TranscriptSystem.service.TranscriptService;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class TranscriptServiceImpl implements TranscriptService {

    private final TranscriptRepository transcriptRepository;
    private final StudentRepository studentRepository;
    private final BlockchainService blockchainService;
    private final HashService hashService;
    private static final Logger log = LoggerFactory.getLogger(TranscriptServiceImpl.class);

    public TranscriptServiceImpl(TranscriptRepository transcriptRepository,
                                 StudentRepository studentRepository,
                                 BlockchainService blockchainService, HashService hashService) {

        this.transcriptRepository = transcriptRepository;
        this.studentRepository = studentRepository;
        this.blockchainService = blockchainService;
        this.hashService = hashService;
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

        // Build blockchain hash
        String hash = hashService.generateTranscriptHash(transcript);
        transcript.setBlockchainHash(hash);

        //  Store on blockchain
        try {
            BlockchainResponse response = blockchainService.storeHash(hash);
            transcript.setBlockchainTxId(response.getTxHash());
            transcript.setBlockchainRecordId(response.getRecordId());

        } catch (Exception e) {
            log.error("Blockchain transaction failed", e);
            throw new RuntimeException("Blockchain transaction failed");
        }

        return transcriptRepository.save(transcript);
    }

    // GET ALL

    @Override
    public Page<Transcript> getAllTranscripts(int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        return transcriptRepository.findByActiveTrue(pageable);
    }

    // GET BY STUDENT ID

    @Override
    public List<Transcript> getTranscriptsByStudentId(Long studentId) {
        return transcriptRepository.findByStudent_IdAndActiveTrue(studentId);
    }

    // GET BY STUDENT EMAIL

    @Override
    public List<Transcript> getTranscriptsByStudentEmail(String email) {
        return transcriptRepository.findByStudent_EmailAndActiveTrue(email);
    }

    // DASHBOARD STATS

    @Override
    public DashboardStatsDTO getDashboardStats() {

        List<Transcript> transcripts = transcriptRepository.findAll();

        long total = transcripts.size();
        long authentic = 0;
        long tampered = 0;

        for (Transcript t : transcripts) {

            try {

                if (t.getBlockchainRecordId() == null) {
                    tampered++;
                    continue;
                }

                String blockchainHash =
                        blockchainService.getHashFromBlockchain(
                                t.getBlockchainRecordId()
                        );

                String recalculated =
                        hashService.generateTranscriptHash(t);

                if (blockchainHash != null &&
                        blockchainHash.equals(recalculated)) {

                    authentic++;

                } else {
                    tampered++;
                }

            } catch (Exception e) {
                tampered++;
            }
        }

        return new DashboardStatsDTO(total, authentic, tampered);
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