package com.hms.services.adminmanagement.controller;

import com.hms.services.adminmanagement.entity.HMS_TM_MedicineDosage;
import com.hms.services.adminmanagement.entity.HMS_TW_MedicineDosage;
import com.hms.services.adminmanagement.service.MedicineDosageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/medicine-dosages")
public class MedicineDosageController {

    @Autowired
    private MedicineDosageService medicineDosageService;

    @PostMapping("/create")
    public ResponseEntity<HMS_TW_MedicineDosage> createMedicineDosage(@Valid @RequestBody HMS_TW_MedicineDosage medicineDosage) {
        return ResponseEntity.ok(medicineDosageService.createMedicineDosage(medicineDosage));
    }

    @GetMapping("/tw/{id}")
    public ResponseEntity<HMS_TW_MedicineDosage> getMedicineDosageById(@PathVariable String id) {
        try {
            HMS_TW_MedicineDosage medicineDosage = medicineDosageService.getMedicineDosageById(id);
            return ResponseEntity.ok(medicineDosage);
        } catch (RuntimeException e) {
            return ResponseEntity.ok().build();
        }
    }

    @GetMapping("/tw/all")
    public ResponseEntity<List<HMS_TW_MedicineDosage>> getAllMedicineDosagesTW() {
        List<HMS_TW_MedicineDosage> medicineDosages = medicineDosageService.getAllMedicineDosagesTW();
        return ResponseEntity.ok(medicineDosages);
    }

    @PutMapping("/tw/{id}")
    public ResponseEntity<HMS_TW_MedicineDosage> updateMedicineDosage(
            @PathVariable String id, @Valid @RequestBody HMS_TW_MedicineDosage medicineDosage) {
        return ResponseEntity.ok(medicineDosageService.updateMedicineDosage(id, medicineDosage));
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<HMS_TW_MedicineDosage> approveMedicineDosage(
            @PathVariable String id) {

        HMS_TW_MedicineDosage approvedMedicineDosage = medicineDosageService.approveMedicineDosage(id);

        return ResponseEntity.ok(approvedMedicineDosage);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMedicineDosage(
            @PathVariable String id,
            @RequestParam String authStat) {
        try {
            medicineDosageService.deleteMedicineDosage(id, authStat);
            return ResponseEntity.ok("Medicine dosage deleted from TM and status updated to UNAUTHORIZED in TW.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Medicine dosage not found or cannot be deleted.");
        }
    }

    @GetMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_MedicineDosage> getMedicineDosageByIds(@PathVariable String id) {
        return ResponseEntity.ok(medicineDosageService.getMedicineDosageByIds(id));
    }

    @GetMapping("/tm/all")
    public ResponseEntity<List<HMS_TM_MedicineDosage>> getAllMedicineDosagesTM() {
        List<HMS_TM_MedicineDosage> medicineDosages = medicineDosageService.getAllMedicineDosagesTM();
        return ResponseEntity.ok(medicineDosages);
    }

    @PutMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_MedicineDosage> updateMedicineDosage(
            @PathVariable String id, @Valid @RequestBody HMS_TM_MedicineDosage medicineDosage) {
        return ResponseEntity.ok(medicineDosageService.updateMedicineDosage(id, medicineDosage));
    }

    @DeleteMapping("/tw/remove/{dosageId}")
    public ResponseEntity<String> deleteTmMedicineDosage(@PathVariable String dosageId) {
        try {
            medicineDosageService.deleteTwMedicineDosage(dosageId);
            return new ResponseEntity<>("Medicine dosage marked as deleted.", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("Medicine dosage not found or cannot be deleted.", HttpStatus.NOT_FOUND);
        }
    }
}





