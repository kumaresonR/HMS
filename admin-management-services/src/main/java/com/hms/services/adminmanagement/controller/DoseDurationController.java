package com.hms.services.adminmanagement.controller;

import com.hms.services.adminmanagement.entity.HMS_TM_DoseDuration;
import com.hms.services.adminmanagement.entity.HMS_TW_DoseDuration;
import com.hms.services.adminmanagement.service.DoseDurationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/dose-durations")
public class DoseDurationController {

    @Autowired
    private DoseDurationService doseDurationService;

    @PostMapping("/create")
    public ResponseEntity<List<HMS_TW_DoseDuration>> createDoseDurations(@Valid @RequestBody List<HMS_TW_DoseDuration> doseDurations) {
        List<HMS_TW_DoseDuration> createdDoseDurations = doseDurationService.createDoseDurations(doseDurations);
        return ResponseEntity.ok(createdDoseDurations);
    }

    @GetMapping("/tw/{id}")
    public ResponseEntity<HMS_TW_DoseDuration> getDoseDurationById(@PathVariable String id) {
        try {
            HMS_TW_DoseDuration doseDuration = doseDurationService.getDoseDurationById(id);
            return ResponseEntity.ok(doseDuration);
        } catch (RuntimeException e) {
            return ResponseEntity.ok().build();
        }
    }

    @GetMapping("/tw/all")
    public ResponseEntity<List<HMS_TW_DoseDuration>> getAllDoseDurationsTW() {
        List<HMS_TW_DoseDuration> doseDurations = doseDurationService.getAllDoseDurationsTW();
        return ResponseEntity.ok(doseDurations);
    }

    @PutMapping("/tw/{id}")
    public ResponseEntity<HMS_TW_DoseDuration> updateDoseDuration(
            @PathVariable String id,
            @Valid @RequestBody HMS_TW_DoseDuration doseDuration) {
        return ResponseEntity.ok(doseDurationService.updateDoseDuration(id, doseDuration));
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<HMS_TW_DoseDuration> approveDoseDuration(
            @PathVariable String id) {
        return ResponseEntity.ok(doseDurationService.approveDoseDuration(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDoseDuration(
            @PathVariable String id,
            @RequestParam String authStat) {
        try {
            doseDurationService.deleteDoseDuration(id, authStat);
            return ResponseEntity.ok("Dose duration deleted from TM and status updated to UNAUTHORIZED in TW.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Dose duration not found or cannot be deleted.");
        }
    }

    @GetMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_DoseDuration> getDoseDurationByIds(@PathVariable String id) {
        return ResponseEntity.ok(doseDurationService.getDoseDurationByIds(id));
    }

    @GetMapping("/tm/all")
    public ResponseEntity<List<HMS_TM_DoseDuration>> getAllDoseDurationsTM() {
        List<HMS_TM_DoseDuration> doseDurations = doseDurationService.getAllDoseDurationsTM();
        return ResponseEntity.ok(doseDurations);
    }

    @PutMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_DoseDuration> updateDoseDuration(
            @PathVariable String id,
            @Valid @RequestBody HMS_TM_DoseDuration doseDuration) {
        return ResponseEntity.ok(doseDurationService.updateDoseDuration(id, doseDuration));
    }

    @DeleteMapping("/tw/remove/{id}")
    public ResponseEntity<String> deleteTwDoseDuration(@PathVariable String id) {
        try {
            doseDurationService.deleteTwDoseDuration(id);
            return ResponseEntity.ok("Dose Duration marked as deleted.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Dose duration not found or cannot be deleted.");
        }
    }
}



