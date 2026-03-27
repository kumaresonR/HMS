package com.hms.services.adminmanagement.controller;


import com.hms.services.adminmanagement.entity.HMS_TM_ChargeType;
import com.hms.services.adminmanagement.entity.HMS_TW_ChargeType;
import com.hms.services.adminmanagement.service.ChargeTypeService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/charge-types")
public class ChargeTypeController {


    private final ChargeTypeService chargeTypeService;

    @Autowired
    public ChargeTypeController(ChargeTypeService chargeTypeService) {
        this.chargeTypeService = chargeTypeService;
    }

    // Create a new Work Table entry
    @PostMapping("/work-table")
    public ResponseEntity<HMS_TW_ChargeType> createWorkEntry(@RequestBody HMS_TW_ChargeType twChargeType) {
        HMS_TW_ChargeType createdEntry = chargeTypeService.createInWorkTable(twChargeType);
        return new ResponseEntity<>(createdEntry, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/authorize")
    public ResponseEntity<HMS_TW_ChargeType> updateAuthStatForChargeType(
            @PathVariable("id") String id,
            @RequestParam("authStat") String authStat) {
        HMS_TW_ChargeType updatedChargeType = chargeTypeService.updateAuthStatById(id, authStat);
        return ResponseEntity.ok(updatedChargeType);
    }

    // Approve a Work Table entry and insert into Master Table
    @PutMapping("/work-table/{workId}")
    public ResponseEntity<HMS_TW_ChargeType> approveWorkEntry(
            @PathVariable String workId,
            @RequestBody HMS_TW_ChargeType twChargeType) {
        HMS_TW_ChargeType approvedEntry = chargeTypeService.approveWorkTableEntry(workId, twChargeType);
        return new ResponseEntity<>(approvedEntry, HttpStatus.OK);
    }

    // Get all Master Table entries
    @GetMapping("/master-table")
    public ResponseEntity<List<HMS_TM_ChargeType>> getAllMasterEntries() {
        List<HMS_TM_ChargeType> masterEntries = chargeTypeService.getAllMasterEntries();
        return new ResponseEntity<>(masterEntries, HttpStatus.OK);
    }

    // Get all Work Table entries
    @GetMapping("/work-table")
    public ResponseEntity<List<HMS_TW_ChargeType>> getAllWorkEntries() {
        List<HMS_TW_ChargeType> workEntries = chargeTypeService.getAllWorkEntries();
        return new ResponseEntity<>(workEntries, HttpStatus.OK);
    }

    // Endpoint to soft delete a work charge type
    @DeleteMapping("/work-table/{chargeTypeId}")
    public ResponseEntity<JSONObject> softDeleteWorkChargeType(@PathVariable String chargeTypeId) {
        return ResponseEntity.ok(chargeTypeService.softDeleteWorkChargeType(chargeTypeId));
    }

    // Endpoint to soft delete a master charge type
    @DeleteMapping("/master-table/{chargeTypeId}")
    public ResponseEntity<JSONObject> softDeleteMasterChargeType(@PathVariable String chargeTypeId) {
        return ResponseEntity.ok(chargeTypeService.softDeleteMasterChargeType(chargeTypeId));
    }

}



