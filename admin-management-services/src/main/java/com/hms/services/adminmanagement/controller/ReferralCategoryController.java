package com.hms.services.adminmanagement.controller;

import com.hms.services.adminmanagement.entity.HMS_TM_ReferralCategory;
import com.hms.services.adminmanagement.entity.HMS_TW_ReferralCategory;
import com.hms.services.adminmanagement.service.ReferralCategoryService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/referral-category")
public class ReferralCategoryController {

    private final ReferralCategoryService categoryService;


    @Autowired
    public ReferralCategoryController(final ReferralCategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping("/work-table")
    public ResponseEntity<List<HMS_TW_ReferralCategory>> createWorkEntry(@RequestBody List<HMS_TW_ReferralCategory> twCategory) {
        return ResponseEntity.ok(categoryService.createInWorkTable(twCategory));
    }

    @PatchMapping("/{id}/authorize")
    public ResponseEntity<HMS_TW_ReferralCategory> updateAuthStat(
            @PathVariable("id") String id,
            @RequestParam("authStat") String authStat) {
        HMS_TW_ReferralCategory updatedCategory = categoryService.updateAuthStatById(id, authStat);
        return ResponseEntity.ok(updatedCategory);
    }

    @PutMapping("/work-table/{id}")
    public ResponseEntity<HMS_TW_ReferralCategory> approveWorkEntry(
            @PathVariable String id, @RequestBody HMS_TW_ReferralCategory twCategory) {
        return ResponseEntity.ok(categoryService.approveWorkTableEntry(id, twCategory));
    }

    @GetMapping("/master-table")
    public ResponseEntity<List<HMS_TM_ReferralCategory>> getAllMasterEntries() {
        return ResponseEntity.ok(categoryService.getAllMasterEntries());
    }

    @GetMapping("/work-table")
    public ResponseEntity<List<HMS_TW_ReferralCategory>> getAllWorkEntries() {
        return ResponseEntity.ok(categoryService.getAllWorkEntries());
    }

    @DeleteMapping("/work-table/{id}")
    public ResponseEntity<JSONObject> softDeleteWorkEntry(@PathVariable String id) {
        return ResponseEntity.ok(categoryService.softDeleteWorkTableEntry(id));
    }

    @DeleteMapping("/master-table/{id}")
    public ResponseEntity<JSONObject> softDeleteMasterEntry(@PathVariable String id) {
        return ResponseEntity.ok(categoryService.softDeleteMasterTableEntry(id));
    }

}



