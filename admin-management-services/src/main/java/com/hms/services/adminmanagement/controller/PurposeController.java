package com.hms.services.adminmanagement.controller;

import com.hms.services.adminmanagement.entity.HMS_TM_Purpose;
import com.hms.services.adminmanagement.entity.HMS_TW_Purpose;
import com.hms.services.adminmanagement.service.PurposeService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/purpose")
public class PurposeController {

    private final PurposeService purposeService;

    @Autowired
    public PurposeController(final PurposeService purposeService) {
        this.purposeService = purposeService;
    }

    @PostMapping("/work-table")
    public ResponseEntity<List<HMS_TW_Purpose>> createWorkEntry(@RequestBody List<HMS_TW_Purpose> twPurposes) {
        return ResponseEntity.ok(purposeService.createInWorkTable(twPurposes));
    }

    @PatchMapping("/{id}/authorize")
    public ResponseEntity<HMS_TW_Purpose> updateAuthStat(
            @PathVariable("id") String id,
            @RequestParam("authStat") String authStat) {
        HMS_TW_Purpose updatedPurpose = purposeService.updateAuthStatById(id, authStat);
        return ResponseEntity.ok(updatedPurpose);
    }

    @PutMapping("/work-table/{id}")
    public ResponseEntity<HMS_TW_Purpose> approveWorkEntry(@PathVariable String id, @RequestBody HMS_TW_Purpose twPurpose) {
        return ResponseEntity.ok(purposeService.approveWorkTableEntry(id, twPurpose));
    }

    @GetMapping("/master-table")
    public ResponseEntity<List<HMS_TM_Purpose>> getAllMasterEntries() {
        return ResponseEntity.ok(purposeService.getAllMasterEntries());
    }

    @GetMapping("/work-table")
    public ResponseEntity<List<HMS_TW_Purpose>> getAllWorkEntries() {
        return ResponseEntity.ok(purposeService.getAllWorkEntries());
    }

    // Endpoint to soft delete a work purpose
    @DeleteMapping("/work-table/{purposeId}")
    public ResponseEntity<JSONObject> softDeleteWorkPurpose(@PathVariable String purposeId) {
        return ResponseEntity.ok(purposeService.softDeleteWorkEntry(purposeId));
    }

    // Endpoint to soft delete a master purpose
    @DeleteMapping("/master-table/{purposeId}")
    public ResponseEntity<JSONObject> softDeleteMasterPurpose(@PathVariable String purposeId) {
        return ResponseEntity.ok(purposeService.softDeleteMasterEntry(purposeId));
    }

}



