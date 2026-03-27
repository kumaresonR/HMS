package com.hms.services.adminmanagement.controller;


import com.hms.services.adminmanagement.entity.HMS_TM_TaxCategory;
import com.hms.services.adminmanagement.entity.HMS_TW_TaxCategory;
import com.hms.services.adminmanagement.service.TaxCategoryService;
import jakarta.validation.Valid;
import org.json.simple.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tax-category")
public class TaxCategoryController {

    private final TaxCategoryService taxCategoryService;

    public TaxCategoryController(TaxCategoryService taxCategoryService) {
        this.taxCategoryService = taxCategoryService;
    }

    @PostMapping("/work-table")
    public ResponseEntity<HMS_TW_TaxCategory> createWorkEntry(@Valid @RequestBody HMS_TW_TaxCategory twTaxCategory) {
        return ResponseEntity.ok(taxCategoryService.createInWorkTable(twTaxCategory));
    }

    @PatchMapping("/{id}/authorize")
    public ResponseEntity<HMS_TW_TaxCategory> updateAuthStatForTaxCategory(
            @PathVariable("id") String id,
            @RequestParam("authStat") String authStat) {
        HMS_TW_TaxCategory updatedTaxCategory = taxCategoryService.updateAuthStatById(id, authStat);
        return ResponseEntity.ok(updatedTaxCategory);
    }

    @PutMapping("/work-table/{id}")
    public ResponseEntity<?> updateWorkEntryStatus(@PathVariable String id, @Valid @RequestBody HMS_TW_TaxCategory twTaxCategory) {
            return ResponseEntity.ok(taxCategoryService.approveWorkTableEntry(id,twTaxCategory));

    }

    @GetMapping("/master-table")
    public ResponseEntity<List<HMS_TM_TaxCategory>> getAllMasterEntries() {
        return ResponseEntity.ok(taxCategoryService.getAllMasterEntries());
    }

    @GetMapping("/work-table")
    public ResponseEntity<List<HMS_TW_TaxCategory>> getAllWorkEntries() {
        return ResponseEntity.ok(taxCategoryService.getAllWorkEntries());
    }

    @DeleteMapping("/work-table/tax-category/{taxCategoryId}")
    public ResponseEntity<JSONObject> softDeleteWorkTaxCategory(@PathVariable String taxCategoryId) {
        return ResponseEntity.ok(taxCategoryService.softDeleteWorkTaxCategory(taxCategoryId));
    }
}



