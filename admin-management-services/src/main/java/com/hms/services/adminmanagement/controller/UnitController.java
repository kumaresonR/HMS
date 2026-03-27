package com.hms.services.adminmanagement.controller;

import com.hms.services.adminmanagement.entity.HMS_TM_Unit;
import com.hms.services.adminmanagement.entity.HMS_TW_Unit;
import com.hms.services.adminmanagement.service.UnitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/units")
public class UnitController {

    @Autowired
    private UnitService unitService;

    @PostMapping("/create")
    public ResponseEntity<List<HMS_TW_Unit>> createUnits(@Valid @RequestBody List<HMS_TW_Unit> units) {
        List<HMS_TW_Unit> createdUnits = unitService.createUnits(units);
        return ResponseEntity.ok(createdUnits);
    }

    @GetMapping("/tw/{id}")
    public ResponseEntity<HMS_TW_Unit> getUnitById(@PathVariable String id) {
        try {
            HMS_TW_Unit unit = unitService.getUnitById(id);
            return ResponseEntity.ok(unit);
        } catch (RuntimeException e) {
            return ResponseEntity.ok().build();
        }
    }

    @GetMapping("/tw/all")
    public ResponseEntity<List<HMS_TW_Unit>> getAllUnitsTW() {
        List<HMS_TW_Unit> units = unitService.getAllUnitsTW();
        return ResponseEntity.ok(units);
    }

    @PutMapping("/tw/{id}")
    public ResponseEntity<HMS_TW_Unit> updateUnit(
            @PathVariable String id,
            @Valid @RequestBody HMS_TW_Unit unit) {
        return ResponseEntity.ok(unitService.updateUnit(id, unit));
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<HMS_TW_Unit> approveUnit(
            @PathVariable String id) {
        return ResponseEntity.ok(unitService.approveUnit(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUnit(
            @PathVariable String id,
            @RequestParam String authStat) {
        try {
            unitService.deleteUnit(id, authStat);
            return ResponseEntity.ok("Unit deleted from TM and status updated to UNAUTHORIZED in TW.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Unit not found or cannot be deleted.");
        }
    }

    @GetMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_Unit> getUnitByIds(@PathVariable String id) {
        return ResponseEntity.ok(unitService.getUnitByIds(id));
    }

    @GetMapping("/tm/all")
    public ResponseEntity<List<HMS_TM_Unit>> getAllUnitsTM() {
        List<HMS_TM_Unit> units = unitService.getAllUnitsTM();
        return ResponseEntity.ok(units);
    }

    @PutMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_Unit> updateUnit(
            @PathVariable String id,
            @Valid @RequestBody HMS_TM_Unit unit) {
        return ResponseEntity.ok(unitService.updateUnit(id, unit));
    }

    @DeleteMapping("/tw/remove/{id}")
    public ResponseEntity<String> deleteTwUnit(@PathVariable String id) {
        try {
            unitService.deleteTwUnit(id);
            return ResponseEntity.ok("Unit marked as deleted.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Unit not found or cannot be deleted.");
        }
    }
}



