package com.academic.TranscriptSystem.service.impl;

import com.academic.TranscriptSystem.blockchain.service.BlockchainService;
import com.academic.TranscriptSystem.dto.DashboardStatsDTO;
import com.academic.TranscriptSystem.entity.Subject;
import com.academic.TranscriptSystem.entity.Transcript;
import com.academic.TranscriptSystem.repository.SubjectRepository;
import com.academic.TranscriptSystem.repository.TranscriptRepository;
import com.academic.TranscriptSystem.security.HashUtil;
import com.academic.TranscriptSystem.service.TranscriptService;
import com.academic.TranscriptSystem.dto.IssueTranscriptDTO;
import com.academic.TranscriptSystem.dto.SubjectRequestDTO;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import java.util.List;

@Service
public class TranscriptServiceImpl implements TranscriptService {

    private final TranscriptRepository transcriptRepository;
    private final BlockchainService blockchainService;
    private final SubjectRepository subjectRepository;
    private static final Logger log = LoggerFactory.getLogger(TranscriptServiceImpl.class);

    public TranscriptServiceImpl(TranscriptRepository transcriptRepository,
                                 BlockchainService blockchainService,
                                 SubjectRepository subjectRepository) {

        this.transcriptRepository = transcriptRepository;
        this.blockchainService = blockchainService;
        this.subjectRepository = subjectRepository;
    }

    @Override
    @Transactional
    public Transcript issueTranscript(IssueTranscriptDTO request)  {

        //  Create transcript
        Transcript transcript = new Transcript();
        transcript.setStudentId(request.getStudentId());
        transcript.setStudentEmail(request.getStudentEmail());
        transcript.setStudentName(request.getStudentName());
        transcript.setProgram(request.getProgram());
        transcript.setDepartment(request.getDepartment());
        transcript.setSemester(request.getSemester());
        transcript.setCgpa(request.getCgpa());

        transcript = transcriptRepository.save(transcript);

        //  Save subjects
        for (SubjectRequestDTO s : request.getSubjects()) {

            Subject subject = new Subject();
            subject.setTranscriptId(transcript.getId());
            subject.setCode(s.getCode());
            subject.setName(s.getName());
            subject.setCredits(s.getCredits());
            subject.setMarks(s.getMarks());
            subject.setGrade(s.getGrade());

            subjectRepository.save(subject);
        }

        //  Build full hash INCLUDING subjects
        StringBuilder dataBuilder = new StringBuilder();

        dataBuilder.append(transcript.getStudentId());
        dataBuilder.append(transcript.getStudentEmail());
        dataBuilder.append(transcript.getSemester());
        dataBuilder.append(transcript.getCgpa());

        List<Subject> subjects =
                subjectRepository.findByTranscriptId(transcript.getId());

        for (Subject s : subjects) {
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

    @Override
    public List<Transcript> getAllTranscripts() {
        return transcriptRepository.findAll();
    }

    @Override
    public List<Transcript> getStudentTranscripts(Long studentId) {
        return transcriptRepository.findByStudentId(studentId);
    }

    @Override
    public Transcript getTranscriptById(Long transcriptId) {
        return transcriptRepository.findById(transcriptId).orElse(null);
    }

    @Override
    public List<Transcript> getTranscriptsByStudentEmail(String email) {
        return transcriptRepository.findByStudentEmail(email);
    }

    @Override
    public long getTotalTranscripts() {
        return transcriptRepository.count();
    }

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

                //  Build full hash INCLUDING subjects
                StringBuilder dataBuilder = new StringBuilder();

                dataBuilder.append(t.getStudentId());
                dataBuilder.append(t.getStudentEmail());
                dataBuilder.append(t.getSemester());
                dataBuilder.append(t.getCgpa());

                List<Subject> subjects =
                        subjectRepository.findByTranscriptId(t.getId());

                for (Subject s : subjects) {
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

}
