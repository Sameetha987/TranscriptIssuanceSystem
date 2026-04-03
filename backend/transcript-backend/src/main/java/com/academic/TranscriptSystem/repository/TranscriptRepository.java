package com.academic.TranscriptSystem.repository;

import com.academic.TranscriptSystem.entity.Transcript;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TranscriptRepository extends JpaRepository<Transcript, Long> {

    // Normal pagination
    Page<Transcript> findByActiveTrue(Pageable pageable);
    @Query("SELECT t FROM Transcript t " +
            "JOIN FETCH t.student " +
            "JOIN FETCH t.subjects " +
            "WHERE t.id = :id")
    Optional<Transcript> findByIdWithSubjectsAndStudent(Long id);
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
