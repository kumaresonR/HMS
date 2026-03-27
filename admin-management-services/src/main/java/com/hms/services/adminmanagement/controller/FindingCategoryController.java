package com.hms.services.adminmanagement.controller;


import com.hms.services.adminmanagement.entity.HMS_TM_FindingCategory;
import com.hms.services.adminmanagement.entity.HMS_TW_FindingCategory;
import com.hms.services.adminmanagement.entity.HMS_TW_Floor;
import com.hms.services.adminmanagement.service.FindingCategoryService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/finding-category")
public class FindingCategoryController {

    private final FindingCategoryService findingCategoryService;

    @Autowired
    public FindingCategoryController(FindingCategoryService findingCategoryService) {
        this.findingCategoryService = findingCategoryService;
    }

    @PostMapping("/work-table")
    public ResponseEntity<List<HMS_TW_FindingCategory>> createWorkEntry(@RequestBody List<HMS_TW_FindingCategory> twFindingCategory) {
        return ResponseEntity.ok(findingCategoryService.createInWorkTable(twFindingCategory));
    }

    @PatchMapping("/{id}/authorize")
    public ResponseEntity<HMS_TW_FindingCategory> updateAuthStat(
            @PathVariable("id") String id,
            @RequestParam("authStat") String authStat) {
        HMS_TW_FindingCategory updatedFloor = findingCategoryService.updateAuthStatById(id, authStat);
        return ResponseEntity.ok(updatedFloor);
    }

    @PutMapping("/work-table/{id}")
    public ResponseEntity<HMS_TW_FindingCategory> approveWorkEntry(@PathVariable String id, @RequestBody HMS_TW_FindingCategory twFindingCategory) {
        return ResponseEntity.ok(findingCategoryService.approveWorkTableEntry(id, twFindingCategory));
    }

    @GetMapping("/master-table")
    public ResponseEntity<List<HMS_TM_FindingCategory>> getAllMasterEntries() {
        return ResponseEntity.ok(findingCategoryService.getAllMasterEntries());
    }

    @GetMapping("/work-table")
    public ResponseEntity<List<HMS_TW_FindingCategory>> getAllWorkEntries() {
        return ResponseEntity.ok(findingCategoryService.getAllWorkEntries());
    }

    // Endpoint to soft delete a work finding category
    @DeleteMapping("/work-table/{findingCategoryId}")
    public ResponseEntity<JSONObject> softDeleteWorkFindingCategory(@PathVariable String findingCategoryId) {
        return ResponseEntity.ok(findingCategoryService.softDeleteWorkFindingCategory(findingCategoryId));
    }

    // Endpoint to soft delete a master finding category
    @DeleteMapping("/master-table/{findingCategoryId}")
    public ResponseEntity<JSONObject> softDeleteMasterFindingCategory(@PathVariable String findingCategoryId) {
        return ResponseEntity.ok(findingCategoryService.softDeleteMasterFindingCategory(findingCategoryId));
    }

}



