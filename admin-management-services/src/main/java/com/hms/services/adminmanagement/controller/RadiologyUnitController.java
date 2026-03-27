package com.hms.services.adminmanagement.controller;

import com.hms.services.adminmanagement.entity.HMS_TM_RadiologyUnit;
import com.hms.services.adminmanagement.entity.HMS_TW_RadiologyUnit;
import com.hms.services.adminmanagement.service.RadiologyUnitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/radiology-units")
public class RadiologyUnitController {

    @Autowired
    private RadiologyUnitService unitService;

    @PostMapping("/create")
    public ResponseEntity<HMS_TW_RadiologyUnit> createRadiologyUnit(@Valid @RequestBody HMS_TW_RadiologyUnit unit) {
        return ResponseEntity.ok(unitService.createRadiologyUnit(unit));
    }

    @GetMapping("/tw/{id}")
    public ResponseEntity<HMS_TW_RadiologyUnit> getRadiologyUnitById(@PathVariable String id) {
        try {
            HMS_TW_RadiologyUnit unit = unitService.getRadiologyUnitById(id);
            return new ResponseEntity<>(unit, HttpStatus.OK);
        } catch (RuntimeException e) {
            return ResponseEntity.ok().build();
        }
    }

    @GetMapping("/tw/all")
    public ResponseEntity<List<HMS_TW_RadiologyUnit>> getAllRadiologyUnitsTW() {
        List<HMS_TW_RadiologyUnit> radiologyUnits = unitService.getAllRadiologyUnitsTW();
        return new ResponseEntity<>(radiologyUnits, HttpStatus.OK);
    }

    @PutMapping("/tw/{id}")
    public ResponseEntity<HMS_TW_RadiologyUnit> updateRadiologyUnit(
            @PathVariable String id, @Valid @RequestBody HMS_TW_RadiologyUnit unit) {
        return ResponseEntity.ok(unitService.updateRadiologyUnit(id, unit));
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<HMS_TM_RadiologyUnit> approveRadiologyUnit(
            @PathVariable String id) {
        return ResponseEntity.ok(unitService.approveRadiologyUnit(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRadiologyUnit(
            @PathVariable String id,
            @RequestParam String authStat) {
        try {
            unitService.deleteRadiologyUnit(id, authStat);
            return ResponseEntity.ok("Radiology unit deleted from TM and status updated in TW.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Radiology unit not found or cannot be deleted.");
        }
    }

    @GetMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_RadiologyUnit> getRadiologyUnitByIds(@PathVariable String id) {
        return ResponseEntity.ok(unitService.getRadiologyUnitByIds(id));
    }

    @GetMapping("/tm/all")
    public ResponseEntity<List<HMS_TM_RadiologyUnit>> getAllRadiologyUnitsTM() {
        List<HMS_TM_RadiologyUnit> radiologyUnits = unitService.getAllRadiologyUnitsTM();
        return new ResponseEntity<>(radiologyUnits, HttpStatus.OK);
    }

    @PutMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_RadiologyUnit> updateRadiologyUnit(
            @PathVariable String id, @Valid @RequestBody HMS_TM_RadiologyUnit unit) {
        return ResponseEntity.ok(unitService.updateRadiologyUnit(id, unit));
    }

    @DeleteMapping("/tw/{id}")
    public ResponseEntity<String> deleteTwUnit(@PathVariable String id) {
        unitService.deleteTwUnit(id);
        return new ResponseEntity<>("Unit marked as deleted.", HttpStatus.OK);
    }
}



