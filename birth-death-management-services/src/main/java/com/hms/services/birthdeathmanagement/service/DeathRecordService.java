package com.hms.services.birthdeathmanagement.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.services.birthdeathmanagement.entity.HMS_TM_DeathRecord;
import com.hms.services.birthdeathmanagement.exceptionhandler.CustomException;
import com.hms.services.birthdeathmanagement.repository.DeathRecordRepository;
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
public class DeathRecordService {

    @Autowired
    private DeathRecordRepository deathRecordRepository;


    public HMS_TM_DeathRecord generateDeathRecord(String deathRecordDataJson, MultipartFile attachmentFile) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        HMS_TM_DeathRecord deathRecord = objectMapper.readValue(deathRecordDataJson, HMS_TM_DeathRecord.class);

        String generatedId = generateDeathRecordId();
        deathRecord.setDeathId(generatedId);

        if (attachmentFile != null) {
            byte[] documentBytes = attachmentFile.getBytes();
            String attachmentUrl = Base64.getEncoder().encodeToString(documentBytes);
            deathRecord.setAttachment(attachmentUrl);
        }

        return deathRecordRepository.save(deathRecord);
    }

    private String generateDeathRecordId() {
        String prefix = "DEATH";

        String lastDeathId = deathRecordRepository.findMaxDeathRecordId();

        int nextId = 1;
        if (lastDeathId != null && lastDeathId.startsWith(prefix)) {
            String numericPart = lastDeathId.substring(prefix.length());
            nextId = Integer.parseInt(numericPart) + 1;
        }

        return String.format("%s%07d", prefix, nextId);

    }


    @Transactional
    public List<HMS_TM_DeathRecord> getAllDeathRecords() {
        return deathRecordRepository.findAllByDeletedFalse();
    }

    @Transactional
    public Optional<HMS_TM_DeathRecord> getDeathRecordById(String id) {
        return deathRecordRepository.findByDeathIdAndDeletedFalse(id);
    }

    public HMS_TM_DeathRecord updateDeathRecord(String id, String deathRecordDataJson, MultipartFile attachmentFile) throws IOException, CustomException {
        HMS_TM_DeathRecord existingRecord = deathRecordRepository.findById(id)
                .orElseThrow(() -> new CustomException("Death Record not found"));

        ObjectMapper objectMapper = new ObjectMapper();
        HMS_TM_DeathRecord updatedDeathRecord = objectMapper.readValue(deathRecordDataJson, HMS_TM_DeathRecord.class);

        existingRecord.setIpdOrOpdId(updatedDeathRecord.getIpdOrOpdId());
        existingRecord.setPatientName(updatedDeathRecord.getPatientName());
        existingRecord.setDateOfDeath(updatedDeathRecord.getDateOfDeath());
        existingRecord.setGuardianName(updatedDeathRecord.getGuardianName());
        existingRecord.setReport(updatedDeathRecord.getReport());
        existingRecord.setDeleted(updatedDeathRecord.isDeleted());

        if (attachmentFile != null) {
            byte[] documentBytes = attachmentFile.getBytes();
            String attachmentUrl = Base64.getEncoder().encodeToString(documentBytes);
            existingRecord.setAttachment(attachmentUrl);
        }

        return deathRecordRepository.save(existingRecord);
    }

    public void softDeleteDeathRecord(String id) throws CustomException {
        HMS_TM_DeathRecord record = deathRecordRepository.findById(id)
                .orElseThrow(() -> new CustomException("Death Record not found"));
        record.setDeleted(true);
        deathRecordRepository.save(record);
    }
@Transactional
    public List<HMS_TM_DeathRecord> getFilteredDeathRecords(String ipdOrOpdId, String patientName) {
        return deathRecordRepository.findByDeletedFalseAndIpdOrOpdIdContainingIgnoreCaseOrPatientNameContainingIgnoreCase(ipdOrOpdId, patientName);
    }

@Transactional
    public List<HMS_TM_DeathRecord> searchDeathRecord(String timeDuration, LocalDate startDate, LocalDate endDate) {
        LocalDateTime[] dateRange = calculateDateRange(timeDuration, startDate, endDate);
        LocalDateTime startDateTime = dateRange[0];
        LocalDateTime endDateTime = dateRange[1];
        return deathRecordRepository.findByDateOfDeathBetweenAndDeletedFalse(startDateTime, endDateTime);
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

    public ByteArrayInputStream generateDeathRecordExcel(List<HMS_TM_DeathRecord> deathRecords) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Death Records");

            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Death ID");
            headerRow.createCell(1).setCellValue("Patient Name");
            headerRow.createCell(2).setCellValue("Date of Death");
            headerRow.createCell(3).setCellValue("Guardian Name");
            headerRow.createCell(4).setCellValue("Patient Id");

            // Data Rows
            int rowIdx = 1;
            for (HMS_TM_DeathRecord deathRecord : deathRecords) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(deathRecord.getDeathId());
                row.createCell(1).setCellValue(deathRecord.getPatientName());
                row.createCell(2).setCellValue(deathRecord.getDateOfDeath() != null ? deathRecord.getDateOfDeath().toString() : "");
                row.createCell(3).setCellValue(deathRecord.getGuardianName());
                row.createCell(4).setCellValue(deathRecord.getIpdOrOpdId());

            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

}


