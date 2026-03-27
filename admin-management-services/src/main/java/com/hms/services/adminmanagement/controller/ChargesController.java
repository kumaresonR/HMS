package com.hms.services.adminmanagement.controller;


import com.hms.services.adminmanagement.entity.HMS_TM_Charges;
import com.hms.services.adminmanagement.entity.HMS_TW_Charges;
import com.hms.services.adminmanagement.model.ChargeDTO;
import com.hms.services.adminmanagement.model.CombinedCharges;
import com.hms.services.adminmanagement.service.ChargesService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/charges")
public class ChargesController {


    private final ChargesService chargesService;

    @Autowired
    public ChargesController(ChargesService chargesService) {
        this.chargesService = chargesService;
    }

    // Create a new entry in the Work Table
    @PostMapping("/work-table")
    public ResponseEntity<ChargeDTO> createWorkTableEntry(@Valid @RequestBody ChargeDTO chargeDTO) {
        ChargeDTO createdEntry = chargesService.createInWorkTable(chargeDTO);
        return new ResponseEntity<>(createdEntry, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/authorize")
    public ResponseEntity<ChargeDTO> updateAuthStatForCharge(
            @PathVariable("id") String id,
            @RequestParam("authStat") String authStat) {
        ChargeDTO updatedCharge = chargesService.updateAuthStatById(id, authStat);
        return ResponseEntity.ok(updatedCharge);
    }

    // Approve a Work Table entry and insert it into the Master Table
    @PutMapping("/work-table/{workId}")
    public ResponseEntity<ChargeDTO> approveWorkTableEntry(
            @PathVariable String workId,
            @Valid @RequestBody ChargeDTO chargeDTO) {
        ChargeDTO approvedEntry = chargesService.approveWorkTableEntry(workId, chargeDTO);
        return new ResponseEntity<>(approvedEntry, HttpStatus.OK);
    }

    // Get all entries from the Master Table
    @GetMapping("/master-table")
    public ResponseEntity<List<CombinedCharges>> getAllMasterEntries() {
        List<CombinedCharges> masterEntries = chargesService.getAllMasterEntries();
        return new ResponseEntity<>(masterEntries, HttpStatus.OK);
    }

    // Get all entries from the Work Table
    @GetMapping("/work-table")
    public ResponseEntity<List<CombinedCharges>> getAllWorkEntries() {
        List<CombinedCharges> workEntries = chargesService.getAllWorkEntries();
        return new ResponseEntity<>(workEntries, HttpStatus.OK);
    }

    @DeleteMapping("/work-table/{id}")
    public ResponseEntity<JSONObject> softDeleteWorkCharge(@PathVariable String id) {
        return ResponseEntity.ok(chargesService.softDeleteWorkCharge(id));
    }

    @DeleteMapping("/master-table/{id}")
    public ResponseEntity<JSONObject> softDeleteMasterCharge(@PathVariable String id) {
        return ResponseEntity.ok(chargesService.softDeleteMasterCharge(id));
    }


    @GetMapping("/charge_category/{categoryId}")
    public ResponseEntity<CombinedCharges> getAllByCategoryId(@PathVariable String categoryId) {
        CombinedCharges workEntries = chargesService.getAllByCategoryId(categoryId);
        return new ResponseEntity<>(workEntries, HttpStatus.OK);
    }

    @GetMapping("/master-table/{chargeId}")
    public ResponseEntity<CombinedCharges> getAllByChargeId(@PathVariable("chargeId") String chargeId, @RequestParam(value = "insuranceId", required = false) String insuranceId) {
        CombinedCharges masterEntries = chargesService.getAllByChargeId(chargeId,insuranceId);
        return new ResponseEntity<>(masterEntries, HttpStatus.OK);
    }

}



