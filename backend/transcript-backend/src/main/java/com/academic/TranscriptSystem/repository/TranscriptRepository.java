package com.academic.TranscriptSystem.repository;

import com.academic.TranscriptSystem.entity.Transcript;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TranscriptRepository extends JpaRepository<Transcript, Long> {
    List<Transcript> findByStudentId(Long studentId);
}
