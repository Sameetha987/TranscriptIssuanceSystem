package com.academic.TranscriptSystem.repository;

import com.academic.TranscriptSystem.entity.Transcript;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TranscriptRepository extends JpaRepository<Transcript, Long> {

    List<Transcript> findByStudent_IdAndActiveTrue(Long studentId);

    List<Transcript> findByStudent_EmailAndActiveTrue(String email);

    Page<Transcript> findByActiveTrue(Pageable pageable);

    boolean existsByStudent_StudentRollAndSemesterAndActiveTrue(
            String studentRoll,
            Integer semester
    );
}