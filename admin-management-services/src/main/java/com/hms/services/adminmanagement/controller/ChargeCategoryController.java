package com.hms.services.adminmanagement.controller;


import com.hms.services.adminmanagement.entity.HMS_TM_ChargeCategory;
import com.hms.services.adminmanagement.entity.HMS_TW_ChargeCategory;
import com.hms.services.adminmanagement.model.ChargeCategoryDTO;
import com.hms.services.adminmanagement.service.ChargeCategoryService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/charge-category")
public class ChargeCategoryController {

    private final ChargeCategoryService chargeCategoryService;

    @Autowired
    public ChargeCategoryController(ChargeCategoryService chargeCategoryService) {
        this.chargeCategoryService = chargeCategoryService;
    }

    // Create in Work Table
    @PostMapping("/work-table")
    public ResponseEntity<HMS_TW_ChargeCategory> createInWorkTable(@RequestBody HMS_TW_ChargeCategory twChargeCategory) {
        HMS_TW_ChargeCategory created = chargeCategoryService.createInWorkTable(twChargeCategory);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/authorize")
    public ResponseEntity<HMS_TW_ChargeCategory> updateAuthStatForChargeCategory(
            @PathVariable("id") String id,
            @RequestParam("authStat") String authStat) {
        HMS_TW_ChargeCategory updatedChargeCategory = chargeCategoryService.updateAuthStatById(id, authStat);
        return ResponseEntity.ok(updatedChargeCategory);
    }


    // Approve Work Table Entry and Insert into Master Table
    @PutMapping("/work-table/{workId}")
    public ResponseEntity<HMS_TW_ChargeCategory> approveWorkTableEntry(
            @PathVariable String workId,
            @RequestBody HMS_TW_ChargeCategory twChargeCategory) {
        HMS_TW_ChargeCategory approved = chargeCategoryService.approveWorkTableEntry(workId, twChargeCategory);
        return ResponseEntity.ok(approved);
    }

    // Get all Master Table Entries
    @GetMapping("/master-table")
    public ResponseEntity<List<HMS_TM_ChargeCategory>> getAllMasterEntries() {
        List<HMS_TM_ChargeCategory> masterEntries = chargeCategoryService.getAllMasterEntries();
        return ResponseEntity.ok(masterEntries);
    }

    // Get all Work Table Entries
    @GetMapping("/work-table")
    public ResponseEntity<List<ChargeCategoryDTO>> getAllWorkEntries() {
        List<ChargeCategoryDTO> workEntries = chargeCategoryService.getAllWorkEntries();
        return ResponseEntity.ok(workEntries);
    }
    @DeleteMapping("/work-table/{id}")
    public ResponseEntity<JSONObject> softDeleteWorkChargeCategory(@PathVariable String id) {
        return ResponseEntity.ok(chargeCategoryService.softDeleteWorkChargeCategory(id));
    }

    @DeleteMapping("/master-table/{id}")
    public ResponseEntity<JSONObject> softDeleteMasterChargeCategory(@PathVariable String id) {
        return ResponseEntity.ok(chargeCategoryService.softDeleteMasterChargeCategory(id));
    }

    @GetMapping("/chargeType/{typeId}")
    public ResponseEntity<List<HMS_TM_ChargeCategory>> getByChargeType(@PathVariable String typeId) {
        List<HMS_TM_ChargeCategory> workEntries = chargeCategoryService.getByChargeType(typeId);
        return ResponseEntity.ok(workEntries);
    }

}



