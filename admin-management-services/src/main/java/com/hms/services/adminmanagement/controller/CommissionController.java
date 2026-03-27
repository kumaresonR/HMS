package com.hms.services.adminmanagement.controller;

import com.hms.services.adminmanagement.entity.HMS_TM_Commission;
import com.hms.services.adminmanagement.entity.HMS_TW_Commission;
import com.hms.services.adminmanagement.model.ReferralCommissionDTO;
import com.hms.services.adminmanagement.service.CommissionService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/commission")
public class CommissionController {

    private final CommissionService commissionService;

    @Autowired
    public CommissionController(final CommissionService commissionService) {
        this.commissionService = commissionService;
    }

    @PostMapping("/work-table")
    public ResponseEntity<HMS_TW_Commission> createWorkEntry(@RequestBody HMS_TW_Commission twCommission) {
        return ResponseEntity.ok(commissionService.createInWorkTable(twCommission));
    }

    @PatchMapping("/{id}/authorize")
    public ResponseEntity<HMS_TW_Commission> updateAuthStat(
            @PathVariable("id") String id,
            @RequestParam("authStat") String authStat) {
        HMS_TW_Commission updatedCommission = commissionService.updateAuthStatById(id, authStat);
        return ResponseEntity.ok(updatedCommission);
    }

    @PutMapping("/work-table/{id}")
    public ResponseEntity<HMS_TW_Commission> approveWorkEntry(
            @PathVariable String id, @RequestBody HMS_TW_Commission twCommission) {
        return ResponseEntity.ok(commissionService.approveWorkTableEntry(id, twCommission));
    }

    @GetMapping("/master-table")
    public ResponseEntity<List<ReferralCommissionDTO>> getAllMasterEntries() {
        return ResponseEntity.ok(commissionService.getAllMasterEntries());
    }

    @GetMapping("/work-table")
    public ResponseEntity<List<ReferralCommissionDTO>> getAllWorkEntries() {
        return ResponseEntity.ok(commissionService.getAllWorkEntries());
    }

    @DeleteMapping("/work-table/{commissionId}")
    public ResponseEntity<JSONObject> softDeleteWorkEntry(@PathVariable String commissionId) {
        return ResponseEntity.ok(commissionService.softDeleteWorkTableEntry(commissionId));
    }

    @DeleteMapping("/master-table/{commissionId}")
    public ResponseEntity<JSONObject> softDeleteMasterEntry(@PathVariable String commissionId) {
        return ResponseEntity.ok(commissionService.softDeleteMasterTableEntry(commissionId));
    }

}



