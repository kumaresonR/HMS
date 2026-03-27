package com.hms.services.adminmanagement.controller;


import com.hms.services.adminmanagement.entity.HMS_TM_SymptomsType;
import com.hms.services.adminmanagement.entity.HMS_TW_SymptomsType;
import com.hms.services.adminmanagement.entity.HMS_TW_TaxCategory;
import com.hms.services.adminmanagement.service.SymptomsService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/symptoms")
public class SymptomsController {


    private final SymptomsService symptomsService;

    @Autowired
    public SymptomsController(final SymptomsService symptomsService) {
        this.symptomsService = symptomsService;
    }

    @PostMapping("/work-table")
    public ResponseEntity<List<HMS_TW_SymptomsType>> createWorkEntry(@RequestBody List<HMS_TW_SymptomsType> twSymptomsType) {
        return ResponseEntity.ok(symptomsService.createInWorkTable(twSymptomsType));
    }

    @PatchMapping("/{id}/authorize")
    public ResponseEntity<HMS_TW_SymptomsType> updateAuthStatForSymptoms(
            @PathVariable("id") String id,
            @RequestParam("authStat") String authStat) {
        HMS_TW_SymptomsType updatedTaxCategory = symptomsService.updateAuthStatById(id, authStat);
        return ResponseEntity.ok(updatedTaxCategory);
    }

    @PutMapping("/work-table/{id}")
    public ResponseEntity<HMS_TW_SymptomsType> approveWorkEntry(@PathVariable String id, @RequestBody HMS_TW_SymptomsType twSymptomsType) {
        return ResponseEntity.ok(symptomsService.approveWorkTableEntry(id, twSymptomsType));
    }

    @GetMapping("/master-table")
    public ResponseEntity<List<HMS_TM_SymptomsType>> getAllMasterEntries() {
        return ResponseEntity.ok(symptomsService.getAllMasterEntries());
    }

    @GetMapping("/work-table")
    public ResponseEntity<List<HMS_TW_SymptomsType>> getAllWorkEntries() {
        return ResponseEntity.ok(symptomsService.getAllWorkEntries());
    }

    @DeleteMapping("/work-table/symptoms-type/{symptomsTypeId}")
    public ResponseEntity<JSONObject> softDeleteWorkSymptomsType(@PathVariable String symptomsTypeId) {
        return ResponseEntity.ok(symptomsService.softDeleteWorkSymptomsType(symptomsTypeId));

    }

}


