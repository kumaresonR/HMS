package com.hms.services.adminmanagement.controller;


import com.hms.services.adminmanagement.entity.HMS_TM_Vital;
import com.hms.services.adminmanagement.entity.HMS_TW_UnitType;
import com.hms.services.adminmanagement.entity.HMS_TW_Vital;
import com.hms.services.adminmanagement.service.VitalService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/vital")
public class VitalController {

    private final VitalService vitalService;

    @Autowired
    public VitalController(final VitalService vitalService) {
        this.vitalService = vitalService;
    }

    @PostMapping("/work-table")
    public ResponseEntity<HMS_TW_Vital> createWorkEntry(@Valid @RequestBody HMS_TW_Vital twVital) {
        return ResponseEntity.ok(vitalService.createInWorkTable(twVital));
    }

    @PatchMapping("/{id}/authorize")
    public ResponseEntity<HMS_TW_Vital> updateAuthStatForUnitType(
            @PathVariable("id") String id,
            @RequestParam("authStat") String authStat) {
        HMS_TW_Vital updatedUnitType = vitalService.updateAuthStatById(id, authStat);
        return ResponseEntity.ok(updatedUnitType);
    }


    @PutMapping("/work-table/{id}")
    public ResponseEntity<HMS_TW_Vital> approveWorkEntry(@PathVariable String id, @Valid @RequestBody HMS_TW_Vital twVital) {
        return ResponseEntity.ok(vitalService.approveWorkTableEntry(id, twVital));
    }

    @GetMapping("/master-table")
    public ResponseEntity<List<HMS_TM_Vital>> getAllMasterEntries() {
        return ResponseEntity.ok(vitalService.getAllMasterEntries());
    }

    @GetMapping("/work-table")
    public ResponseEntity<List<HMS_TW_Vital>> getAllWorkEntries() {
        return ResponseEntity.ok(vitalService.getAllWorkEntries());
    }

    @DeleteMapping("/work-table/{vitalId}")
    public ResponseEntity<JSONObject> softDeleteWorkUnitType(@PathVariable String vitalId) {
        return ResponseEntity.ok(vitalService.softDeleteWorkUnitType(vitalId));
    }

}



