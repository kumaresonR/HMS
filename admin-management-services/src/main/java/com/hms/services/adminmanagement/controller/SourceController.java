package com.hms.services.adminmanagement.controller;

import com.hms.services.adminmanagement.entity.HMS_TM_Source;
import com.hms.services.adminmanagement.entity.HMS_TW_Source;
import com.hms.services.adminmanagement.service.SourceService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/source")
public class SourceController {

    private final SourceService sourceService;

    @Autowired
    public SourceController(final SourceService sourceService) {
        this.sourceService = sourceService;
    }

    @PostMapping("/work-table")
    public ResponseEntity<List<HMS_TW_Source>> createWorkEntry(@RequestBody List<HMS_TW_Source> twSource) {
        return ResponseEntity.ok(sourceService.createInWorkTable(twSource));
    }

    @PatchMapping("/{id}/authorize")
    public ResponseEntity<HMS_TW_Source> updateAuthStat(
            @PathVariable("id") String id,
            @RequestParam("authStat") String authStat) {
        HMS_TW_Source updatedSource = sourceService.updateAuthStatById(id, authStat);
        return ResponseEntity.ok(updatedSource);
    }

    @PutMapping("/work-table/{id}")
    public ResponseEntity<HMS_TW_Source> approveWorkEntry(@PathVariable String id, @RequestBody HMS_TW_Source twSource) {
        return ResponseEntity.ok(sourceService.approveWorkTableEntry(id, twSource));
    }

    @GetMapping("/master-table")
    public ResponseEntity<List<HMS_TM_Source>> getAllMasterEntries() {
        return ResponseEntity.ok(sourceService.getAllMasterEntries());
    }

    @GetMapping("/work-table")
    public ResponseEntity<List<HMS_TW_Source>> getAllWorkEntries() {
        return ResponseEntity.ok(sourceService.getAllWorkEntries());
    }

    // Endpoint to soft delete a work source
    @DeleteMapping("/work-table/{sourceId}")
    public ResponseEntity<JSONObject> softDeleteWorkSource(@PathVariable String sourceId) {
        return ResponseEntity.ok(sourceService.softDeleteWorkSource(sourceId));
    }

    // Endpoint to soft delete a master source
    @DeleteMapping("/master-table/{sourceId}")
    public ResponseEntity<JSONObject> softDeleteMasterSource(@PathVariable String sourceId) {
        return ResponseEntity.ok(sourceService.softDeleteMasterSource(sourceId));
    }

}



