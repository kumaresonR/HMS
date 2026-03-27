package com.hms.services.adminmanagement.controller;

import com.hms.services.adminmanagement.entity.HMS_TM_Specialist;
import com.hms.services.adminmanagement.entity.HMS_TW_Specialist;
import com.hms.services.adminmanagement.service.SpecialistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/specialist")
public class SpecialistController {

    @Autowired
    private SpecialistService specialistService;

    @PostMapping("/create")
    public ResponseEntity<HMS_TW_Specialist> createSpecialist(@Valid @RequestBody HMS_TW_Specialist specialist) {
        HMS_TW_Specialist createdSpecialist = specialistService.createSpecialist(specialist);
        return new ResponseEntity<>(createdSpecialist, HttpStatus.CREATED);
    }

    @GetMapping("/tw/{specialistId}")
    public ResponseEntity<HMS_TW_Specialist> getSpecialistById(@PathVariable String specialistId) {
        try {
            HMS_TW_Specialist specialist = specialistService.getSpecialistById(specialistId);
            return ResponseEntity.ok(specialist);
        } catch (RuntimeException e) {
            return ResponseEntity.ok().build();
        }
    }

    @GetMapping("/tw/all")
    public ResponseEntity<List<HMS_TW_Specialist>> getAllSpecialistsTW() {
        List<HMS_TW_Specialist> specialists = specialistService.getAllSpecialistsTW();
        return new ResponseEntity<>(specialists, HttpStatus.OK);
    }

    @PutMapping("/tw/update/{id}")
    public ResponseEntity<HMS_TW_Specialist> updateSpecialist(
            @PathVariable String id, @Valid @RequestBody HMS_TW_Specialist updatedSpecialist) {
        HMS_TW_Specialist updated = specialistService.updateSpecialist(id, updatedSpecialist);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<HMS_TM_Specialist> approveSpecialist(
            @PathVariable String id) {
        HMS_TM_Specialist approvedSpecialist = specialistService.approveSpecialist(id);
        return new ResponseEntity<>(approvedSpecialist, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSpecialist(
            @PathVariable String id,
            @RequestParam String authStat) {
        try {
            specialistService.deleteSpecialist(id, authStat);
            return ResponseEntity.ok("Specialist deleted from TM and status updated to UNAUTHORIZED in TW.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Specialist not found or cannot be deleted.");
        }
    }

    @GetMapping("/tm/all")
    public ResponseEntity<List<HMS_TM_Specialist>> getAllSpecialistsTM() {
        List<HMS_TM_Specialist> specialists = specialistService.getAllSpecialistsTM();
        return new ResponseEntity<>(specialists, HttpStatus.OK);
    }

    @GetMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_Specialist> getSpecialistByIds(@PathVariable String id) {
        HMS_TM_Specialist specialist = specialistService.getSpecialistByIds(id);
        return new ResponseEntity<>(specialist, HttpStatus.OK);
    }

    @PutMapping("/tm/update/{id}")
    public ResponseEntity<HMS_TM_Specialist> updateSpecialist(
            @PathVariable String id, @Valid @RequestBody HMS_TM_Specialist updatedSpecialist) {
        HMS_TM_Specialist updated = specialistService.updateSpecialist(id, updatedSpecialist);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }


    @DeleteMapping("/tw/{id}/delete")
    public ResponseEntity<Void> deleteTwSpecialist(@PathVariable String id) {
        specialistService.deleteTwSpecialist(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}




