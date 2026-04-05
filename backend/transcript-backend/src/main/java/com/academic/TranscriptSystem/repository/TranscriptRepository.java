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
    @Query("""
    SELECT t FROM Transcript t
    JOIN t.student s
    WHERE (:search IS NULL OR s.name LIKE %:search%)
    ORDER BY 
      CASE WHEN :sortField = 'studentRoll' AND :direction = 'asc' THEN s.studentRoll END ASC,
      CASE WHEN :sortField = 'studentRoll' AND :direction = 'desc' THEN s.studentRoll END DESC,
      CASE WHEN :sortField = 'studentName' AND :direction = 'asc' THEN s.name END ASC,
      CASE WHEN :sortField = 'studentName' AND :direction = 'desc' THEN s.name END DESC,
      CASE WHEN :sortField = 'cgpa' AND :direction = 'asc' THEN t.cgpa END ASC,
      CASE WHEN :sortField = 'cgpa' AND :direction = 'desc' THEN t.cgpa END DESC
""")
    Page<Transcript> findAllWithStudentSorting(
            @Param("sortField") String sortField,
            @Param("direction") String direction,
            @Param("search") String search,
            Pageable pageable
    );

    boolean existsByStudent_StudentRollAndSemesterAndActiveTrue(
            String studentRoll,
            Integer semester
    );
    List<Transcript> findByStudent_EmailAndActiveTrue(String email);
    long countByVerificationStatus(String status);
    List<Transcript> findByStudentId(Long studentId);
}
