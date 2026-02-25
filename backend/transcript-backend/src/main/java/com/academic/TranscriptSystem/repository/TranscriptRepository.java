package com.academic.TranscriptSystem.repository;

import com.academic.TranscriptSystem.entity.Transcript;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TranscriptRepository extends JpaRepository<Transcript, Long> {

    List<Transcript> findByStudent_Id(Long studentId);

    List<Transcript> findByStudent_Email(String email);
    boolean existsByStudent_StudentRollAndSemester(
            String studentRoll,
            Integer semester
    );
}