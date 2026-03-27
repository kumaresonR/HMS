package com.hms.services.adminmanagement.controller;

import com.hms.services.adminmanagement.entity.HMS_TM_AddRadiology;
import com.hms.services.adminmanagement.entity.HMS_TW_AddRadiology;
import com.hms.services.adminmanagement.service.AddRadiologyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/Add-radiologies")
public class AddRadiologyController {

    @Autowired
    private AddRadiologyService radiologyService;

    @PostMapping("/create")
    public ResponseEntity<HMS_TW_AddRadiology> createRadiology(@Valid @RequestBody HMS_TW_AddRadiology radiology) {
        return ResponseEntity.ok(radiologyService.createRadiology(radiology));
    }

    @GetMapping("/tw/{id}")
    public ResponseEntity<HMS_TW_AddRadiology> getRadiologyById(@PathVariable String id) {
        try {
            HMS_TW_AddRadiology radiology = radiologyService.getRadiologyById(id);
            return ResponseEntity.ok(radiology);
        } catch (RuntimeException e) {
            return ResponseEntity.ok().build();
        }
    }

    @GetMapping("/tw/all")
    public ResponseEntity<List<HMS_TW_AddRadiology>> getAllRadiologiesTW() {
        List<HMS_TW_AddRadiology> radiologies = radiologyService.getAllRadiologiesTW();
        return ResponseEntity.ok(radiologies);
    }

    @PutMapping("/tw/{id}")
    public ResponseEntity<HMS_TW_AddRadiology> updateRadiology(
            @PathVariable String id, @Valid @RequestBody HMS_TW_AddRadiology radiology) {
        return ResponseEntity.ok(radiologyService.updateRadiology(id, radiology));
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<HMS_TW_AddRadiology> approveRadiology(
            @PathVariable String id) {

        HMS_TW_AddRadiology approvedRadiology = radiologyService.approveRadiology(id);
        return ResponseEntity.ok(approvedRadiology);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRadiology(
            @PathVariable String id,
            @RequestParam String authStat) {
        try {
            radiologyService.deleteRadiology(id, authStat);
            return ResponseEntity.ok("Radiology deleted from TM and status updated in TW.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Radiology not found or cannot be deleted.");
        }
    }

    @GetMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_AddRadiology> getTMRadiologyById(@PathVariable String id) {
        return ResponseEntity.ok(radiologyService.getTMRadiologyById(id));
    }

    @GetMapping("/tm/all")
    public ResponseEntity<List<HMS_TM_AddRadiology>> getAllRadiologiesTM() {
        List<HMS_TM_AddRadiology> radiologies = radiologyService.getAllRadiologiesTM();
        return new ResponseEntity<>(radiologies, HttpStatus.OK);
    }

    @PutMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_AddRadiology> updateTMRadiology(
            @PathVariable String id, @Valid @RequestBody HMS_TM_AddRadiology radiology) {
        return ResponseEntity.ok(radiologyService.updateTMRadiology(id, radiology));
    }

    @DeleteMapping("/tw/remove/{id}")
    public ResponseEntity<String> deleteTWRadiology(@PathVariable String id) {
        try {
            radiologyService.deleteTWRadiology(id);
            return new ResponseEntity<>("Radiology marked as deleted.", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("Radiology not found or cannot be deleted.", HttpStatus.NOT_FOUND);
        }
    }
}



