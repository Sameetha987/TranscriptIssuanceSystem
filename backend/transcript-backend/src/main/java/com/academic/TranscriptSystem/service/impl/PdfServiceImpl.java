package com.academic.TranscriptSystem.service.impl;

import com.academic.TranscriptSystem.entity.Transcript;
import com.academic.TranscriptSystem.entity.Subject;
import com.academic.TranscriptSystem.repository.TranscriptRepository;
import com.academic.TranscriptSystem.repository.SubjectRepository;
import com.academic.TranscriptSystem.service.PdfService;
import com.academic.TranscriptSystem.util.QRCodeUtil;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;

import com.lowagie.text.pdf.draw.LineSeparator;
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

            Document document = new Document(PageSize.A4, 50, 50, 60, 50);
            PdfWriter.getInstance(document, response.getOutputStream());
            document.open();

            /* ================= HEADER ================= */

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20);
            Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 12);
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);

            Paragraph university = new Paragraph("UNIVERSITY TRANSCRIPT", titleFont);
            university.setAlignment(Element.ALIGN_CENTER);
            university.setSpacingAfter(10f);
            document.add(university);

            document.add(new LineSeparator());
            document.add(new Paragraph(" "));

            /* ================= STUDENT DETAILS ================= */

            document.add(new Paragraph("Student Name: " + transcript.getStudentName(), normalFont));
            document.add(new Paragraph("Student Email: " + transcript.getStudentEmail(), normalFont));
            document.add(new Paragraph("Program: " + transcript.getProgram(), normalFont));
            document.add(new Paragraph("Department: " + transcript.getDepartment(), normalFont));
            document.add(new Paragraph("Semester: " + transcript.getSemester(), normalFont));
            document.add(new Paragraph("CGPA: " + transcript.getCgpa(), boldFont));
            document.add(new Paragraph("Blockchain TxId: " + transcript.getBlockchainTxId(), normalFont));

            document.add(new Paragraph(" "));
            document.add(new Paragraph(" "));

            /* ================= SUBJECT TABLE ================= */

            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10f);
            table.setWidths(new float[]{2f, 4f, 2f, 2f});

            // Header cells
            String[] headers = {"Code", "Subject Name", "Credits", "Grade"};

            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, boldFont));
                cell.setBackgroundColor(new java.awt.Color(230, 240, 255));
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setPadding(8);
                table.addCell(cell);
            }

            // Subject rows
            for (Subject s : subjects) {

                PdfPCell codeCell = new PdfPCell(new Phrase(s.getCode(), normalFont));
                codeCell.setPadding(6);
                table.addCell(codeCell);

                PdfPCell nameCell = new PdfPCell(new Phrase(s.getName(), normalFont));
                nameCell.setPadding(6);
                table.addCell(nameCell);

                PdfPCell creditCell = new PdfPCell(
                        new Phrase(String.valueOf(s.getCredits()), normalFont));
                creditCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                creditCell.setPadding(6);
                table.addCell(creditCell);

                PdfPCell gradeCell = new PdfPCell(
                        new Phrase(s.getGrade(), boldFont));
                gradeCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                gradeCell.setPadding(6);
                table.addCell(gradeCell);
            }

            document.add(table);

            document.add(new Paragraph(" "));
            document.add(new Paragraph(" "));

            /* ================= QR SECTION ================= */

            String verifyUrl =
                    "http://localhost:8080/api/transcripts/public/verify/" + transcript.getId();

            byte[] qrImage = QRCodeUtil.generateQrCodeImage(verifyUrl, 150, 150);

            Image qr = Image.getInstance(qrImage);
            qr.setAlignment(Image.ALIGN_RIGHT);
            document.add(qr);

            document.close();

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}

