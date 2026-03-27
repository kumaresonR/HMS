package com.hms.services.adminmanagement.controller;


import com.hms.services.adminmanagement.entity.HMS_TM_Finding;
import com.hms.services.adminmanagement.entity.HMS_TW_Finding;
import com.hms.services.adminmanagement.entity.HMS_TW_Floor;
import com.hms.services.adminmanagement.model.FindingDTO;
import com.hms.services.adminmanagement.service.FindingService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/finding")
public class FindingController {

    private final FindingService findingService;

    @Autowired
    public FindingController(final FindingService findingService) {
        this.findingService = findingService;
    }

    @PostMapping("/work-table")
    public ResponseEntity<HMS_TW_Finding> createWorkEntries(@RequestBody HMS_TW_Finding twFindings) {
        return ResponseEntity.ok(findingService.createInWorkTable(twFindings));
    }

    @PatchMapping("/{id}/authorize")
    public ResponseEntity<HMS_TW_Finding> updateAuthStat(
            @PathVariable("id") String id,
            @RequestParam("authStat") String authStat) {
        HMS_TW_Finding updatedFloor = findingService.updateAuthStatById(id, authStat);
        return ResponseEntity.ok(updatedFloor);
    }

    @PutMapping("/work-table/{id}")
    public ResponseEntity<HMS_TW_Finding> approveWorkEntry(@PathVariable String id, @RequestBody HMS_TW_Finding twFinding) {
        return ResponseEntity.ok(findingService.approveWorkTableEntry(id, twFinding));
    }

    @GetMapping("/master-table")
    public ResponseEntity<List<FindingDTO>> getAllMasterEntries() {
        return ResponseEntity.ok(findingService.getAllMasterEntries());
    }

    @GetMapping("/work-table")
    public ResponseEntity<List<FindingDTO>> getAllWorkEntries() {
        return ResponseEntity.ok(findingService.getAllWorkEntries());
    }

    // Endpoint to soft delete a work finding
    @DeleteMapping("/work-table/{findingId}")
    public ResponseEntity<JSONObject> softDeleteWorkFinding(@PathVariable String findingId) {
        return ResponseEntity.ok(findingService.softDeleteWorkFinding(findingId));
    }

    // Endpoint to soft delete a master finding
    @DeleteMapping("/master-table/{findingId}")
    public ResponseEntity<JSONObject> softDeleteMasterFinding(@PathVariable String findingId) {
        return ResponseEntity.ok(findingService.softDeleteMasterFinding(findingId));
    }

}



