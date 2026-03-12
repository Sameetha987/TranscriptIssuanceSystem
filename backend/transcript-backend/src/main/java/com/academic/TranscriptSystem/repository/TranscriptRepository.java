package com.academic.TranscriptSystem.repository;

import com.academic.TranscriptSystem.entity.Transcript;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TranscriptRepository extends JpaRepository<Transcript, Long> {

    // Normal pagination
    Page<Transcript> findByActiveTrue(Pageable pageable);

    // Search transcripts
    @Query("""
    SELECT t FROM Transcript t
    JOIN t.student s
    WHERE t.active = true
    AND (
        LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%'))
        OR LOWER(s.studentRoll) LIKE LOWER(CONCAT('%', :search, '%'))
    )
    """)
    Page<Transcript> searchTranscripts(
            @Param("search") String search,
            Pageable pageable
    );

    boolean existsByStudent_StudentRollAndSemesterAndActiveTrue(
            String studentRoll,
            Integer semester
    );
    List<Transcript> findByStudent_EmailAndActiveTrue(String email);
    long countByVerificationStatus(String status);
}
