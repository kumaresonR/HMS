package com.hms.services.adminmanagement.controller;

import com.hms.services.adminmanagement.entity.HMS_TM_PathologyUnit;
import com.hms.services.adminmanagement.entity.HMS_TW_PathologyParameter;
import com.hms.services.adminmanagement.entity.HMS_TW_PathologyUnit;
import com.hms.services.adminmanagement.service.PathologyUnitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/pathology-units")
public class PathologyUnitController {

    @Autowired
    private PathologyUnitService unitService;

    @PostMapping("/create")
    public ResponseEntity<HMS_TW_PathologyUnit> createPathologyUnit(@Valid @RequestBody HMS_TW_PathologyUnit unit) {
        return ResponseEntity.ok(unitService.createPathologyUnit(unit));
    }

    @GetMapping("/tw/{id}")
    public ResponseEntity<HMS_TW_PathologyUnit> getPathologyUnitById(@PathVariable String id) {
        try {
            HMS_TW_PathologyUnit parameter = unitService.getPathologyUnitById(id);
            return new ResponseEntity<>(parameter, HttpStatus.OK);
        } catch (RuntimeException e) {
            return ResponseEntity.ok().build();
        }
    }

    @GetMapping("/tw/all")
    public ResponseEntity<List<HMS_TW_PathologyUnit>> getAllPathologyUnitsTW() {
        List<HMS_TW_PathologyUnit> pathologyUnits = unitService.getAllPathologyUnitsTW();
        return ResponseEntity.ok(pathologyUnits);
    }

    @PutMapping("/tw/{id}")
    public ResponseEntity<HMS_TW_PathologyUnit> updatePathologyUnit(
            @PathVariable String id, @Valid @RequestBody HMS_TW_PathologyUnit unit) {
        return ResponseEntity.ok(unitService.updatePathologyUnit(id, unit));
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<HMS_TM_PathologyUnit> approvePathologyUnit(
            @PathVariable String id) {
        return ResponseEntity.ok(unitService.approvePathologyUnit(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePathologyUnit(
            @PathVariable String id,
            @RequestParam String authStat) {
        try {
            unitService.deletePathologyUnit(id, authStat);
            return ResponseEntity.ok("Pathology Unit deleted from TM and status updated in TW.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Pathology unit not found or cannot be deleted.");
        }
    }

    @GetMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_PathologyUnit> getPathologyUnitByIds(@PathVariable String id) {
        return ResponseEntity.ok(unitService.getPathologyUnitByIds(id));
    }

    @GetMapping("/tm/all")
    public ResponseEntity<List<HMS_TM_PathologyUnit>> getAllPathologyUnitsTM() {
        List<HMS_TM_PathologyUnit> pathologyUnits = unitService.getAllPathologyUnitsTM();
        return ResponseEntity.ok(pathologyUnits);
    }

    @PutMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_PathologyUnit> updatePathologyUnit(
            @PathVariable String id, @Valid @RequestBody HMS_TM_PathologyUnit unit) {
        return ResponseEntity.ok(unitService.updatePathologyUnit(id, unit));
    }

    @DeleteMapping("/tw/{id}")
    public ResponseEntity<String> deleteTmUnit(@PathVariable String id) {
        unitService.deleteTwUnit(id);
        return new ResponseEntity<>("Unit marked as deleted.", HttpStatus.OK);
    }
}



