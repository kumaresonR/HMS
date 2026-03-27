package com.hms.services.adminmanagement.controller;


import com.hms.services.adminmanagement.entity.HMS_TM_OperationCategory;
import com.hms.services.adminmanagement.entity.HMS_TW_Floor;
import com.hms.services.adminmanagement.entity.HMS_TW_OperationCategory;
import com.hms.services.adminmanagement.service.OperationCategoryService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/operation-category")
public class OperationCategoryController {

    private final OperationCategoryService operationCategoryService;

    @Autowired
    public OperationCategoryController(final OperationCategoryService operationCategoryService) {
        this.operationCategoryService = operationCategoryService;
    }

    @PostMapping("/work-table")
    public ResponseEntity<List<HMS_TW_OperationCategory>> createWorkEntry(@RequestBody List<HMS_TW_OperationCategory> twOperationCategory) {
        return ResponseEntity.ok(operationCategoryService.createInWorkTable(twOperationCategory));
    }

    @PatchMapping("/{id}/authorize")
    public ResponseEntity<HMS_TW_OperationCategory> updateAuthStat(
            @PathVariable("id") String id,
            @RequestParam("authStat") String authStat) {
        HMS_TW_OperationCategory updatedFloor = operationCategoryService.updateAuthStatById(id, authStat);
        return ResponseEntity.ok(updatedFloor);
    }

    @PutMapping("/work-table/{id}")
    public ResponseEntity<HMS_TW_OperationCategory> approveWorkEntry(@PathVariable String id, @RequestBody HMS_TW_OperationCategory twOperationCategory) {
        return ResponseEntity.ok(operationCategoryService.approveWorkTableEntry(id, twOperationCategory));
    }

    @GetMapping("/master-table")
    public ResponseEntity<List<HMS_TM_OperationCategory>> getAllMasterEntries() {
        return ResponseEntity.ok(operationCategoryService.getAllMasterEntries());
    }

    @GetMapping("/work-table")
    public ResponseEntity<List<HMS_TW_OperationCategory>> getAllWorkEntries() {
        return ResponseEntity.ok(operationCategoryService.getAllWorkEntries());
    }
    // Endpoint to soft delete a work operation category
    @DeleteMapping("/work-table/{categoryId}")
    public ResponseEntity<JSONObject> softDeleteWorkOperationCategory(@PathVariable String categoryId) {
        return ResponseEntity.ok(operationCategoryService.softDeleteWorkOperationCategory(categoryId));
    }

    // Endpoint to soft delete a master operation category
    @DeleteMapping("/master-table/{categoryId}")
    public ResponseEntity<JSONObject> softDeleteMasterOperationCategory(@PathVariable String categoryId) {
        return ResponseEntity.ok(operationCategoryService.softDeleteMasterOperationCategory(categoryId));
    }


}



