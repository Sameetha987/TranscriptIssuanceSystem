package com.academic.TranscriptSystem.repository;

import com.academic.TranscriptSystem.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByEmail(String email);

    Optional<Student> findByStudentRoll(String studentRoll);
    Page<Student> findByActiveTrue(Pageable pageable);
}