package com.hms.services.adminmanagement.controller;

import com.hms.services.adminmanagement.entity.HMS_TM_DoseInterval;
import com.hms.services.adminmanagement.entity.HMS_TW_DoseInterval;
import com.hms.services.adminmanagement.service.DoseIntervalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/dose-intervals")
public class DoseIntervalController {

    @Autowired
    private DoseIntervalService doseIntervalService;

    @PostMapping("/create")
    public ResponseEntity<HMS_TW_DoseInterval> createDoseInterval(@Valid @RequestBody HMS_TW_DoseInterval doseInterval) {
        return ResponseEntity.ok(doseIntervalService.createDoseInterval(doseInterval));
    }

    @GetMapping("/tw/{id}")
    public ResponseEntity<HMS_TW_DoseInterval> getDoseIntervalById(@PathVariable String id) {
        try {
            HMS_TW_DoseInterval doseInterval = doseIntervalService.getDoseIntervalById(id);
            return ResponseEntity.ok(doseInterval);
        } catch (RuntimeException e) {
            return ResponseEntity.ok().build();
        }
    }

    @GetMapping("/tw/all")
    public ResponseEntity<List<HMS_TW_DoseInterval>> getAllDoseIntervalsTW() {
        List<HMS_TW_DoseInterval> doseIntervals = doseIntervalService.getAllDoseIntervalsTW();
        return ResponseEntity.ok(doseIntervals);
    }

    @PutMapping("/tw/{id}")
    public ResponseEntity<HMS_TW_DoseInterval> updateDoseInterval(
            @PathVariable String id, @Valid @RequestBody HMS_TW_DoseInterval doseInterval) {
        return ResponseEntity.ok(doseIntervalService.updateDoseInterval(id, doseInterval));
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<HMS_TW_DoseInterval> approveDoseInterval(
            @PathVariable String id) {

        HMS_TW_DoseInterval approvedDoseInterval = doseIntervalService.approveDoseInterval(id);

        return ResponseEntity.ok(approvedDoseInterval);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDoseInterval(
            @PathVariable String id,
            @RequestParam String authStat) {
        try {
            doseIntervalService.deleteDoseInterval(id, authStat);
            return ResponseEntity.ok("Dose interval deleted from TM and status updated to UNAUTHORIZED in TW.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Dose interval not found or cannot be deleted.");
        }
    }

    @GetMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_DoseInterval> getDoseIntervalByIds(@PathVariable String id) {
        return ResponseEntity.ok(doseIntervalService.getDoseIntervalByIds(id));
    }

    @GetMapping("/tm/all")
    public ResponseEntity<List<HMS_TM_DoseInterval>> getAllDoseIntervalsTM() {
        List<HMS_TM_DoseInterval> doseIntervals = doseIntervalService.getAllDoseIntervalsTM();
        return ResponseEntity.ok(doseIntervals);
    }

    @PutMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_DoseInterval> updateDoseInterval(
            @PathVariable String id, @Valid @RequestBody HMS_TM_DoseInterval doseInterval) {
        return ResponseEntity.ok(doseIntervalService.updateDoseInterval(id, doseInterval));
    }

    @DeleteMapping("/tw/remove/{intervalId}")
    public ResponseEntity<String> deleteTwDoseInterval(@PathVariable String intervalId) {
        try {
            doseIntervalService.deleteTwDoseInterval(intervalId);
            return new ResponseEntity<>("Dose interval marked as deleted.", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("Dose interval not found or cannot be deleted.", HttpStatus.NOT_FOUND);
        }
    }
}




