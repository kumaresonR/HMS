package com.hms.services.birthdeathmanagement.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.hms.services.birthdeathmanagement.entity.HMS_TM_BirthRecord;
import com.hms.services.birthdeathmanagement.exceptionhandler.CustomException;
import com.hms.services.birthdeathmanagement.service.BirthRecordService;
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
import java.util.Optional;

@RestController
@RequestMapping("/birth-records")
public class BirthRecordController {

    @Autowired
    private BirthRecordService birthRecordService;

    @PostMapping("/generate")
    public ResponseEntity<HMS_TM_BirthRecord> generateBirthRecord(
//            @RequestHeader("Authorization") String authorizationHeader,
            @RequestPart("birthRecordData") String birthRecordDataJson,
            @RequestPart(value = "motherPhoto", required = false) MultipartFile motherPhotoFile,
            @RequestPart(value = "fatherPhoto", required = false) MultipartFile fatherPhotoFile,
            @RequestPart(value = "childPhoto", required = false) MultipartFile childPhotoFile,
            @RequestPart(value = "documentPhoto", required = false) MultipartFile documentPhotoFile) {

        try {
            HMS_TM_BirthRecord generatedRecord = birthRecordService.generateBirthRecord(
                    birthRecordDataJson,
                    motherPhotoFile,
                    fatherPhotoFile,
                    childPhotoFile,
                    documentPhotoFile
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(generatedRecord);
        } catch (CustomException | JsonProcessingException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<HMS_TM_BirthRecord>> getAllBirthRecords() {
        List<HMS_TM_BirthRecord> records = birthRecordService.getAllBirthRecords();
        if (records.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(records);
    }

    @GetMapping("/search")
    public ResponseEntity<List<HMS_TM_BirthRecord>> getFilteredBirthRecords(
            @RequestParam(required = false) String ipdOrOpdId,
            @RequestParam(required = false) String motherName) {

        List<HMS_TM_BirthRecord> records = birthRecordService.getFilteredBirthRecords(ipdOrOpdId, motherName);
        if (records.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(records);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HMS_TM_BirthRecord> getBirthRecordById(@PathVariable String id) {
        Optional<HMS_TM_BirthRecord> birthRecord = birthRecordService.getBirthRecordById(id);
        return birthRecord.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<HMS_TM_BirthRecord> updateBirthRecord(
//            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable String id,
            @RequestPart("birthRecordData") String birthRecordDataJson,
            @RequestPart(value = "motherPhoto", required = false) MultipartFile motherPhotoFile,
            @RequestPart(value = "fatherPhoto", required = false) MultipartFile fatherPhotoFile,
            @RequestPart(value = "childPhoto", required = false) MultipartFile childPhotoFile,
            @RequestPart(value = "documentPhoto", required = false) MultipartFile documentPhotoFile) {

        try {
            HMS_TM_BirthRecord updatedRecord = birthRecordService.updateBirthRecord(
                    id,
                    birthRecordDataJson,
                    motherPhotoFile,
                    fatherPhotoFile,
                    childPhotoFile,
                    documentPhotoFile
            );
            return updatedRecord != null
                    ? ResponseEntity.ok(updatedRecord)
                    : ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteBirthRecord(@PathVariable String id) {
        try {
            HMS_TM_BirthRecord deletedRecord = birthRecordService.softDeleteBirthRecord(id);
            return deletedRecord != null
                    ? ResponseEntity.ok("Birth Record marked as deleted successfully.")
                    : ResponseEntity.status(HttpStatus.NOT_FOUND).body("Birth Record not found.");
        } catch (Exception e) {
            return new ResponseEntity<>("Error processing request. Please try again.", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/all-search")
    public ResponseEntity<List<HMS_TM_BirthRecord>> searchBirthRecordForPatient(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<HMS_TM_BirthRecord> response = birthRecordService.searchBirthRecord(
                timeDuration,
                startDate,
                endDate
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/download-birth-records")
    public ResponseEntity<Resource> downloadBirthRecordsAsExcel(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) throws IOException {

        List<HMS_TM_BirthRecord> birthRecords = birthRecordService.searchBirthRecord(
                timeDuration,
                startDate,
                endDate
        );
        ByteArrayInputStream in = birthRecordService.generateBirthRecordExcel(birthRecords);
        InputStreamResource file = new InputStreamResource(in);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=birth_records.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(file);
    }




}



