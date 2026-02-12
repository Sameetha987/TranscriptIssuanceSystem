package com.academic.TranscriptSystem.service.impl;

import com.academic.TranscriptSystem.entity.Transcript;
import com.academic.TranscriptSystem.entity.Subject;
import com.academic.TranscriptSystem.repository.TranscriptRepository;
import com.academic.TranscriptSystem.repository.SubjectRepository;
import com.academic.TranscriptSystem.service.PdfService;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PdfServiceImpl implements PdfService {

    private final TranscriptRepository transcriptRepository;
    private final SubjectRepository subjectRepository;

    public PdfServiceImpl(TranscriptRepository transcriptRepository,
                          SubjectRepository subjectRepository) {
        this.transcriptRepository = transcriptRepository;
        this.subjectRepository = subjectRepository;
    }

    @Override
    public void generateTranscriptPdf(Long transcriptId, HttpServletResponse response) {

        try {

            Transcript transcript = transcriptRepository.findById(transcriptId).orElseThrow();
            List<Subject> subjects = subjectRepository.findByTranscriptId(transcriptId);

            Document document = new Document();
            PdfWriter.getInstance(document, response.getOutputStream());

            document.open();

            /* ================= HEADER ================= */
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
            Paragraph title = new Paragraph("UNIVERSITY TRANSCRIPT", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            document.add(new Paragraph(" "));

            /* ================= STUDENT DETAILS ================= */
            document.add(new Paragraph("Student Name: " + transcript.getStudentName()));
            document.add(new Paragraph("Student Email: " + transcript.getStudentEmail()));
            document.add(new Paragraph("Program: " + transcript.getProgram()));
            document.add(new Paragraph("Department: " + transcript.getDepartment()));
            document.add(new Paragraph("Semester: " + transcript.getSemester()));
            document.add(new Paragraph("CGPA: " + transcript.getCgpa()));
            document.add(new Paragraph("Blockchain TxId: " + transcript.getBlockchainTxId()));

            document.add(new Paragraph(" "));

            /* ================= SUBJECT TABLE ================= */
            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);

            table.addCell("Code");
            table.addCell("Name");
            table.addCell("Credits");
            table.addCell("Marks");
            table.addCell("Grade");

            for (Subject s : subjects) {
                table.addCell(s.getCode());
                table.addCell(s.getName());
                table.addCell(String.valueOf(s.getCredits()));
                table.addCell(String.valueOf(s.getMarks()));
                table.addCell(s.getGrade());
            }

            document.add(table);

            document.close();

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}

