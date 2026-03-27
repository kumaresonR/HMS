package com.hms.services.birthdeathmanagement.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.services.birthdeathmanagement.entity.HMS_TM_BirthRecord;
import com.hms.services.birthdeathmanagement.repository.BirthRecordRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class BirthRecordService {

    @Autowired
    private BirthRecordRepository birthRecordRepository;

    @Autowired
    private ObjectMapper objectMapper;

    public HMS_TM_BirthRecord generateBirthRecord(String birthRecordDataJson,
                                                  MultipartFile motherPhotoFile,
                                                  MultipartFile fatherPhotoFile,
                                                  MultipartFile childPhotoFile,
                                                  MultipartFile documentPhotoFile) throws IOException {

        ObjectMapper objectMapper = new ObjectMapper();
        HMS_TM_BirthRecord birthRecord = objectMapper.readValue(birthRecordDataJson, HMS_TM_BirthRecord.class);

        String generatedId = generateBirthRecordId();
        birthRecord.setBirthRecordId(generatedId);

        if (motherPhotoFile != null) {
            byte[] motherPhotoBytes = motherPhotoFile.getBytes();
            String encodedMotherPhoto = Base64.getEncoder().encodeToString(motherPhotoBytes);
            birthRecord.setMotherPhoto(encodedMotherPhoto);
        }

        if (fatherPhotoFile != null) {
            byte[] fatherPhotoBytes = fatherPhotoFile.getBytes();
            String encodedFatherPhoto = Base64.getEncoder().encodeToString(fatherPhotoBytes);
            birthRecord.setFatherPhoto(encodedFatherPhoto);
        }

        if (childPhotoFile != null) {
            byte[] childPhotoBytes = childPhotoFile.getBytes();
            String encodedChildPhoto = Base64.getEncoder().encodeToString(childPhotoBytes);
            birthRecord.setChildPhoto(encodedChildPhoto);
        }

        if (documentPhotoFile != null) {
            byte[] documentBytes = documentPhotoFile.getBytes();
            String encodedDocument = Base64.getEncoder().encodeToString(documentBytes);
            birthRecord.setDocumentPhoto(encodedDocument);
        }

        return birthRecordRepository.save(birthRecord);
    }

    private String generateBirthRecordId() {
        String prefix = "BIR";

        String lastBirthId = birthRecordRepository.findMaxBirthRecordId();

        int nextId = 1;
        if (lastBirthId != null && lastBirthId.startsWith(prefix)) {
            String numericPart = lastBirthId.substring(prefix.length());
            nextId = Integer.parseInt(numericPart) + 1;
        }

        return String.format("%s%07d", prefix, nextId);

    }


    @Transactional
    public List<HMS_TM_BirthRecord> getAllBirthRecords() {
        return birthRecordRepository.findAllByDeletedFalse();
    }

    @Transactional
    public Optional<HMS_TM_BirthRecord> getBirthRecordById(String id) {
        return birthRecordRepository.findByBirthRecordIdAndDeletedFalse(id);
    }

    public HMS_TM_BirthRecord updateBirthRecord(String id, String birthRecordDataJson,
                                                MultipartFile motherPhotoFile,
                                                MultipartFile fatherPhotoFile,
                                                MultipartFile childPhotoFile,
                                                MultipartFile documentPhotoFile) throws IOException {

        if (!birthRecordRepository.existsById(id)) {
            throw new EntityNotFoundException("Birth Record with ID " + id + " not found.");
        }

        ObjectMapper objectMapper = new ObjectMapper();
        HMS_TM_BirthRecord birthRecord = objectMapper.readValue(birthRecordDataJson, HMS_TM_BirthRecord.class);
        HMS_TM_BirthRecord existingRecord = birthRecordRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Birth Record with ID " + id + " not found."));

        birthRecord.setBirthRecordId(id);

        if (motherPhotoFile != null) {
            byte[] motherPhotoBytes = motherPhotoFile.getBytes();
            String encodedMotherPhoto = Base64.getEncoder().encodeToString(motherPhotoBytes);
            birthRecord.setMotherPhoto(encodedMotherPhoto);
        } else {
            birthRecord.setMotherPhoto(existingRecord.getMotherPhoto());
        }

        if (fatherPhotoFile != null) {
            byte[] fatherPhotoBytes = fatherPhotoFile.getBytes();
            String encodedFatherPhoto = Base64.getEncoder().encodeToString(fatherPhotoBytes);
            birthRecord.setFatherPhoto(encodedFatherPhoto);
        } else {
            birthRecord.setFatherPhoto(existingRecord.getFatherPhoto());
        }

        if (childPhotoFile != null) {
            byte[] childPhotoBytes = childPhotoFile.getBytes();
            String encodedChildPhoto = Base64.getEncoder().encodeToString(childPhotoBytes);
            birthRecord.setChildPhoto(encodedChildPhoto);
        } else {
            birthRecord.setChildPhoto(existingRecord.getChildPhoto());
        }

        if (documentPhotoFile != null) {
            byte[] documentBytes = documentPhotoFile.getBytes();
            String encodedDocument = Base64.getEncoder().encodeToString(documentBytes);
            birthRecord.setDocumentPhoto(encodedDocument);
        } else {
            birthRecord.setDocumentPhoto(existingRecord.getDocumentPhoto());
        }

        return birthRecordRepository.save(birthRecord);
    }

    public HMS_TM_BirthRecord softDeleteBirthRecord(String id) {
        Optional<HMS_TM_BirthRecord> existingRecordOpt = birthRecordRepository.findById(id);

        if (existingRecordOpt.isPresent()) {
            HMS_TM_BirthRecord existingRecord = existingRecordOpt.get();
            existingRecord.setDeleted(true);
            return birthRecordRepository.save(existingRecord);
        } else {
            throw new RuntimeException("Birth Record not found with ID: " + id);
        }
    }
@Transactional
    public List<HMS_TM_BirthRecord> getFilteredBirthRecords(String ipdOrOpdId, String motherName) {
        return birthRecordRepository.findByDeletedFalseAndIpdOrOpdIdContainingIgnoreCaseOrMotherNameContainingIgnoreCase(ipdOrOpdId, motherName);
    }

@Transactional
    public List<HMS_TM_BirthRecord> searchBirthRecord(String timeDuration, LocalDate startDate, LocalDate endDate) {
        LocalDateTime[] dateRange = calculateDateRange(timeDuration, startDate, endDate);
        LocalDateTime startDateTime = dateRange[0];
        LocalDateTime endDateTime = dateRange[1];
        return birthRecordRepository.findByDateOfBirthBetweenAndDeletedFalse(startDateTime, endDateTime);

    }


    private LocalDateTime[] calculateDateRange(String timeDuration, LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = null;
        LocalDateTime endDateTime = null;
        LocalDateTime now = LocalDateTime.now();

        if (timeDuration != null) {
            switch (timeDuration.toUpperCase()) {
                case "DAILY":
                    startDateTime = now.toLocalDate().atStartOfDay();
                    endDateTime = now.toLocalDate().atTime(23, 59, 59);
                    break;
                case "WEEKLY":
                    startDateTime = now.toLocalDate().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).atStartOfDay();
                    endDateTime = now.toLocalDate().with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY)).atTime(23, 59, 59);
                    break;
                case "MONTHLY":
                    startDateTime = now.toLocalDate().withDayOfMonth(1).atStartOfDay();
                    endDateTime = now.toLocalDate().with(TemporalAdjusters.lastDayOfMonth()).atTime(23, 59, 59);
                    break;
                case "YEARLY":
                    startDateTime = now.toLocalDate().withDayOfYear(1).atStartOfDay();
                    endDateTime = now.toLocalDate().with(TemporalAdjusters.lastDayOfYear()).atTime(23, 59, 59);
                    break;
                case "LAST_YEAR":
                    LocalDate lastYear = now.toLocalDate().minusYears(1);
                    startDateTime = lastYear.withDayOfYear(1).atStartOfDay();
                    endDateTime = lastYear.with(TemporalAdjusters.lastDayOfYear()).atTime(23, 59, 59);
                    break;
                case "CUSTOM":
                    startDateTime = (startDate != null) ? startDate.atStartOfDay() : null;
                    endDateTime = (endDate != null) ? endDate.atTime(23, 59, 59) : null;
                    break;
            }
        } else if (startDate != null || endDate != null) {
            startDateTime = (startDate != null) ? startDate.atStartOfDay() : null;
            endDateTime = (endDate != null) ? endDate.atTime(23, 59, 59) : null;
        }

        return new LocalDateTime[]{startDateTime, endDateTime};
    }

    public ByteArrayInputStream generateBirthRecordExcel(List<HMS_TM_BirthRecord> birthRecords) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Birth Records");
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("BIRTH_RECORD_ID");
            headerRow.createCell(1).setCellValue("CHILD_NAME");
            headerRow.createCell(2).setCellValue("GENDER");
            headerRow.createCell(3).setCellValue("WEIGHT");
            headerRow.createCell(4).setCellValue("ADDRESS");
            headerRow.createCell(5).setCellValue("PHONE");
            headerRow.createCell(6).setCellValue("IPD_OR_OPD_ID");
            headerRow.createCell(7).setCellValue("DATE_OF_BIRTH");
            headerRow.createCell(8).setCellValue("MOTHER_NAME");
            headerRow.createCell(9).setCellValue("FATHER_NAME");

            // Data Rows
            int rowIdx = 1;
            for (HMS_TM_BirthRecord record : birthRecords) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(record.getBirthRecordId());
                row.createCell(1).setCellValue(record.getChildName());
                row.createCell(2).setCellValue(record.getGender());
                row.createCell(3).setCellValue(record.getWeight());
                row.createCell(4).setCellValue(record.getAddress());
                row.createCell(5).setCellValue(record.getPhone());
                row.createCell(6).setCellValue(record.getIpdOrOpdId());
                row.createCell(7).setCellValue(record.getDateOfBirth() != null ? record.getDateOfBirth().toString() : "");
                row.createCell(8).setCellValue(record.getMotherName());
                row.createCell(9).setCellValue(record.getFatherName());
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }


}


