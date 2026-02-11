package com.academic.TranscriptSystem.repository;

import com.academic.TranscriptSystem.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findByTranscriptId(Long transcriptId);
}
