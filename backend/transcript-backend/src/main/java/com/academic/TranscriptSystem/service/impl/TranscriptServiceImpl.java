package com.academic.TranscriptSystem.service.impl;

import com.academic.TranscriptSystem.blockchain.service.BlockchainService;
import com.academic.TranscriptSystem.dto.DashboardStatsDTO;
import com.academic.TranscriptSystem.dto.IssueTranscriptDTO;
import com.academic.TranscriptSystem.dto.SubjectRequestDTO;
import com.academic.TranscriptSystem.entity.Student;
import com.academic.TranscriptSystem.entity.Subject;
import com.academic.TranscriptSystem.entity.Transcript;
import com.academic.TranscriptSystem.repository.StudentRepository;
import com.academic.TranscriptSystem.repository.TranscriptRepository;
import com.academic.TranscriptSystem.security.HashUtil;
import com.academic.TranscriptSystem.service.TranscriptService;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TranscriptServiceImpl implements TranscriptService {

    private final TranscriptRepository transcriptRepository;
    private final StudentRepository studentRepository;
    private final BlockchainService blockchainService;

    private static final Logger log = LoggerFactory.getLogger(TranscriptServiceImpl.class);

    public TranscriptServiceImpl(TranscriptRepository transcriptRepository,
                                 StudentRepository studentRepository,
                                 BlockchainService blockchainService) {

        this.transcriptRepository = transcriptRepository;
        this.studentRepository = studentRepository;
        this.blockchainService = blockchainService;
    }

    // ISSUE TRANSCRIPT

    @Override
    @Transactional
    public Transcript issueTranscript(IssueTranscriptDTO request) {

        // Find student by roll
        Student student = studentRepository
                .findByStudentRoll(request.getStudentRoll())
                .orElseThrow(() -> new RuntimeException("Student not found"));
        boolean exists = transcriptRepository
                .existsByStudent_StudentRollAndSemester(
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

        // Build blockchain hash (student + transcript + subjects)
        StringBuilder dataBuilder = new StringBuilder();

        dataBuilder.append(student.getId());
        dataBuilder.append(student.getEmail());
        dataBuilder.append(transcript.getSemester());
        dataBuilder.append(transcript.getCgpa());

        for (Subject s : transcript.getSubjects()) {
            dataBuilder.append(s.getCode());
            dataBuilder.append(s.getCredits());
            dataBuilder.append(s.getGrade());
        }

        String hash = HashUtil.generateHash(dataBuilder.toString());
        transcript.setBlockchainHash(hash);

        //  Store on blockchain
        try {
            String txId = blockchainService.storeHash(hash);
            transcript.setBlockchainTxId(txId);

            Long recordId = blockchainService.getLatestRecordId();
            transcript.setBlockchainRecordId(recordId);

        } catch (Exception e) {
            log.error("Blockchain transaction failed", e);
            throw new RuntimeException("Blockchain transaction failed");
        }

        return transcriptRepository.save(transcript);
    }

    // GET ALL

    @Override
    public List<Transcript> getAllTranscripts() {
        return transcriptRepository.findAll();
    }

    // GET BY STUDENT ID

    @Override
    public List<Transcript> getTranscriptsByStudentId(Long studentId) {
        return transcriptRepository.findByStudent_Id(studentId);
    }

    // GET BY STUDENT EMAIL

    @Override
    public List<Transcript> getTranscriptsByStudentEmail(String email) {
        return transcriptRepository.findByStudent_Email(email);
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

                StringBuilder dataBuilder = new StringBuilder();

                dataBuilder.append(t.getStudent().getId());
                dataBuilder.append(t.getStudent().getEmail());
                dataBuilder.append(t.getSemester());
                dataBuilder.append(t.getCgpa());

                for (Subject s : t.getSubjects()) {
                    dataBuilder.append(s.getCode());
                    dataBuilder.append(s.getCredits());
                    dataBuilder.append(s.getGrade());
                }

                String recalculated =
                        HashUtil.generateHash(dataBuilder.toString());

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
}