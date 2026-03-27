package com.hms.services.adminmanagement.controller;


import com.hms.services.adminmanagement.entity.HMS_TM_ComplaintType;
import com.hms.services.adminmanagement.entity.HMS_TW_ComplaintType;
import com.hms.services.adminmanagement.service.ComplaintTypeService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/complaint-type")
public class ComplaintTypeController {


    private final ComplaintTypeService complaintTypeService;

    @Autowired
    public ComplaintTypeController(final ComplaintTypeService complaintTypeService) {
        this.complaintTypeService = complaintTypeService;
    }

    @PostMapping("/work-table")
    public ResponseEntity<List<HMS_TW_ComplaintType>> createWorkEntries(@RequestBody List<HMS_TW_ComplaintType> twComplaintTypes) {
        return ResponseEntity.ok(complaintTypeService.createInWorkTable(twComplaintTypes));
    }

    @PatchMapping("/work-table/{id}/authorize")
    public ResponseEntity<HMS_TW_ComplaintType> updateAuthStat(
            @PathVariable("id") String id,
            @RequestParam("authStat") String authStat) {
        HMS_TW_ComplaintType updatedComplaintType = complaintTypeService.updateAuthStatById(id, authStat);
        return ResponseEntity.ok(updatedComplaintType);
    }

    @PutMapping("/work-table/{id}")
    public ResponseEntity<HMS_TW_ComplaintType> approveWorkEntry(@PathVariable String id, @RequestBody HMS_TW_ComplaintType twComplaintType) {
        return ResponseEntity.ok(complaintTypeService.approveWorkTableEntry(id, twComplaintType));
    }

    @GetMapping("/master-table")
    public ResponseEntity<List<HMS_TM_ComplaintType>> getAllMasterEntries() {
        return ResponseEntity.ok(complaintTypeService.getAllMasterEntries());
    }

    @GetMapping("/work-table")
    public ResponseEntity<List<HMS_TW_ComplaintType>> getAllWorkEntries() {
        return ResponseEntity.ok(complaintTypeService.getAllWorkEntries());
    }

    @DeleteMapping("/work-table/{id}")
    public ResponseEntity<JSONObject> softDeleteWorkEntry(@PathVariable String id) {
        return ResponseEntity.ok(complaintTypeService.softDeleteWorkEntry(id));
    }

    @DeleteMapping("/master-table/{id}")
    public ResponseEntity<JSONObject> softDeleteMasterEntry(@PathVariable String id) {
        return ResponseEntity.ok(complaintTypeService.softDeleteMasterEntry(id));
    }

}



