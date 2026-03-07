package com.academic.TranscriptSystem.service.impl;

import com.academic.TranscriptSystem.entity.Subject;
import com.academic.TranscriptSystem.entity.Transcript;
import com.academic.TranscriptSystem.security.HashUtil;
import com.academic.TranscriptSystem.service.HashService;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class HashServiceImpl implements HashService {

    @Override
    public String generateTranscriptHash(Transcript transcript) {

        StringBuilder dataBuilder = new StringBuilder();

        dataBuilder.append(transcript.getStudent().getId());
        dataBuilder.append(transcript.getStudent().getEmail());
        dataBuilder.append(transcript.getSemester());
        dataBuilder.append(transcript.getCgpa());

        List<Subject> subjects = transcript.getSubjects();
        subjects.sort(Comparator.comparing(Subject::getCode));

        for (Subject s : subjects) {
            dataBuilder.append(s.getCode());
            dataBuilder.append(s.getCredits());
            dataBuilder.append(s.getGrade());
        }

        return HashUtil.generateHash(dataBuilder.toString());
    }
}