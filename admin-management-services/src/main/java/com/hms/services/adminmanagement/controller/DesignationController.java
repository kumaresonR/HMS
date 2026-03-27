package com.hms.services.adminmanagement.controller;

import com.hms.services.adminmanagement.entity.HMS_TM_Designation;
import com.hms.services.adminmanagement.entity.HMS_TW_Designation;
import com.hms.services.adminmanagement.service.DesignationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/designation")
public class DesignationController {

    @Autowired
    private DesignationService designationService;

    @PostMapping("/create")
    public ResponseEntity<HMS_TW_Designation> createDesignation(@Valid @RequestBody HMS_TW_Designation designation) {
        HMS_TW_Designation createdDesignation = designationService.createDesignation(designation);
        return new ResponseEntity<>(createdDesignation, HttpStatus.CREATED);
    }

    @GetMapping("/tw/{id}")
    public ResponseEntity<HMS_TW_Designation> getDesignationById(@PathVariable String id) {
        try {
            HMS_TW_Designation designation = designationService.getDesignationById(id);
            return ResponseEntity.ok(designation);
        } catch (RuntimeException e) {
            return ResponseEntity.ok().build();
        }
    }

    @GetMapping("/tw/all")
    public ResponseEntity<List<HMS_TW_Designation>> getAllDesignations() {
        List<HMS_TW_Designation> designations = designationService.getAllDesignations();
        return ResponseEntity.ok(designations);
    }

    @PutMapping("/tw/update/{id}")
    public ResponseEntity<HMS_TW_Designation> updateDesignation(
            @PathVariable String id, @Valid @RequestBody HMS_TW_Designation updatedDesignation) {
        HMS_TW_Designation updated = designationService.updateDesignation(id, updatedDesignation);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<HMS_TM_Designation> approveDesignation(
            @PathVariable String id) {
        HMS_TM_Designation approvedDesignation = designationService.approveDesignation(id);
        return new ResponseEntity<>(approvedDesignation, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDesignation(
            @PathVariable String id,
            @RequestParam String authStat) {
        try {
            designationService.deleteDesignation(id, authStat);
            return ResponseEntity.ok("Designation deleted from TM and status updated to UNAUTHORIZED in TW.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Designation not found or cannot be deleted.");
        }
    }

    @GetMapping("/tm/all")
    public ResponseEntity<List<HMS_TM_Designation>> getAllDesignationsTm() {
        List<HMS_TM_Designation> designations = designationService.getAllDesignationsTm();
        return new ResponseEntity<>(designations, HttpStatus.OK);
    }

    @GetMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_Designation> getDesignationByIds(@PathVariable String id) {
        HMS_TM_Designation designation = designationService.getDesignationByIds(id);
        return new ResponseEntity<>(designation, HttpStatus.OK);
    }

    @PutMapping("/tm/update/{id}")
    public ResponseEntity<HMS_TM_Designation> updateDesignation(
            @PathVariable String id, @Valid @RequestBody HMS_TM_Designation updatedDesignation) {
        HMS_TM_Designation updated = designationService.updateDesignation(id, updatedDesignation);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/tw/{id}/delete")
    public ResponseEntity<Void> deleteTwDesignation(@PathVariable String id) {
        designationService.deleteTwDesignation(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}



