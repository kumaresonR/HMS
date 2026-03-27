package com.hms.services.adminmanagement.controller;

import com.hms.services.adminmanagement.entity.HMS_TM_SymptomsHead;
import com.hms.services.adminmanagement.entity.HMS_TW_SymptomsHead;
import com.hms.services.adminmanagement.model.SymptomsHeadDTO;
import com.hms.services.adminmanagement.service.SymptomsHeadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/symptoms-head")
public class SymptomsHeadController {

    private final SymptomsHeadService symptomsHeadService;

    @Autowired
    public SymptomsHeadController(SymptomsHeadService symptomsHeadService) {
        this.symptomsHeadService = symptomsHeadService;
    }

    @PostMapping("/work-table")
    public ResponseEntity<List<HMS_TW_SymptomsHead>> createWorkTableEntries(@RequestBody List<HMS_TW_SymptomsHead> twSymptomsHeads) {
        return ResponseEntity.ok(symptomsHeadService.createInWorkTable(twSymptomsHeads));
    }

    @PatchMapping("/{id}/authorize")
    public ResponseEntity<HMS_TW_SymptomsHead> updateAuthStatForSymptomsHead(
            @PathVariable("id") String id,
            @RequestParam("authStat") String authStat) {
        HMS_TW_SymptomsHead updatedSymptomsHead = symptomsHeadService.updateAuthStatById(id, authStat);
        return ResponseEntity.ok(updatedSymptomsHead);
    }

    @PutMapping("/work-table/{id}")
    public ResponseEntity<HMS_TW_SymptomsHead> approveWorkTableEntry(
            @PathVariable String id,
            @RequestBody HMS_TW_SymptomsHead twSymptomsHead) {
        return ResponseEntity.ok(symptomsHeadService.approveWorkTableEntry(id, twSymptomsHead));
    }

    @GetMapping("/master-table")
    public ResponseEntity<List<SymptomsHeadDTO>> getAllMasterEntries() {
        return ResponseEntity.ok(symptomsHeadService.getAllMasterEntries());
    }

    @GetMapping("/work-table")
    public ResponseEntity<List<SymptomsHeadDTO>> getAllWorkEntries() {
        return ResponseEntity.ok(symptomsHeadService.getAllWorkEntries());
    }


}



