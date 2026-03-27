package com.hms.services.birthdeathmanagement.controller;

import com.hms.services.birthdeathmanagement.entity.HMS_TM_DeathRecord;
import com.hms.services.birthdeathmanagement.exceptionhandler.CustomException;
import com.hms.services.birthdeathmanagement.service.DeathRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/death-records")
public class DeathRecordController {

    @Autowired
    private DeathRecordService deathRecordService;

    @PostMapping("/create")
    public ResponseEntity<HMS_TM_DeathRecord> createDeathRecord(
//            @RequestHeader("Authorization") String authorizationHeader,
            @RequestPart("deathRecordData") String deathRecordDataJson,
            @RequestPart(value = "attachment", required = false) MultipartFile attachmentFile) {

        try {
            HMS_TM_DeathRecord createdRecord = deathRecordService.generateDeathRecord(deathRecordDataJson, attachmentFile);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRecord);
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<HMS_TM_DeathRecord>> getAllDeathRecords() {
        List<HMS_TM_DeathRecord> records = deathRecordService.getAllDeathRecords();
        return records.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(records);
    }

    @GetMapping("/search")
    public ResponseEntity<List<HMS_TM_DeathRecord>> getFilteredDeathRecords(
            @RequestParam(required = false) String ipdOrOpdId,
            @RequestParam(required = false) String patientName) {
        List<HMS_TM_DeathRecord> records = deathRecordService.getFilteredDeathRecords(ipdOrOpdId, patientName);
        if (records.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(records);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HMS_TM_DeathRecord> getDeathRecordById(@PathVariable String id) {
        return deathRecordService.getDeathRecordById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<HMS_TM_DeathRecord> updateDeathRecord(
//            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable String id,
            @RequestPart("deathRecordData") String deathRecordDataJson,
            @RequestPart(value = "attachment", required = false) MultipartFile attachmentFile) {

        try {
            HMS_TM_DeathRecord updatedRecord = deathRecordService.updateDeathRecord(id, deathRecordDataJson, attachmentFile);
            return ResponseEntity.ok(updatedRecord);
        } catch (IOException | CustomException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDeathRecord(@PathVariable String id) {
        try {
            deathRecordService.softDeleteDeathRecord(id);
            return ResponseEntity.ok("Record marked as deleted.");
        } catch (CustomException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Death record not found or cannot be deleted.");
        }
    }

    @GetMapping("/all-search")
    public ResponseEntity<List<HMS_TM_DeathRecord>> searchDeathRecord(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<HMS_TM_DeathRecord> response = deathRecordService.searchDeathRecord(
                timeDuration,
                startDate,
                endDate
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/download-death-records")
    public ResponseEntity<Resource> downloadDeathRecordsAsExcel(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) throws IOException {

        // Get the search results from the service
        List<HMS_TM_DeathRecord> deathRecords = deathRecordService.searchDeathRecord(
                timeDuration,
                startDate,
                endDate
        );

        ByteArrayInputStream in = deathRecordService.generateDeathRecordExcel(deathRecords);
        InputStreamResource file = new InputStreamResource(in);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=death_records.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(file);
    }

}



