package com.hms.services.ipdmanagement.controller;


import com.hms.services.ipdmanagement.entity.HMS_TM_IPDChargesCategory;
import com.hms.services.ipdmanagement.service.IPDChargesCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ipd-charges-category")
public class IPDChargesCategoryController {

    private final IPDChargesCategoryService ipdChargesCategoryService;

    @Autowired
    public IPDChargesCategoryController(IPDChargesCategoryService ipdChargesCategoryService) {
        this.ipdChargesCategoryService = ipdChargesCategoryService;
    }

    // Create a new IPDChargesCategory
    @PostMapping("/add")
    public ResponseEntity<HMS_TM_IPDChargesCategory> createCategory(@RequestBody HMS_TM_IPDChargesCategory category) {
        HMS_TM_IPDChargesCategory createdCategory = ipdChargesCategoryService.createCategory(category);
        return ResponseEntity.ok(createdCategory);
    }

    // Get IPDChargesCategory by chargeTypeId
    @GetMapping("/type/{chargeTypeId}")
    public ResponseEntity<List<HMS_TM_IPDChargesCategory>> getCategoryByChargeTypeId(@PathVariable String chargeTypeId) {
        List<HMS_TM_IPDChargesCategory> categories = ipdChargesCategoryService.getCategoriesByChargeTypeId(chargeTypeId);
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{chargeCategoryId}")
    public ResponseEntity<HMS_TM_IPDChargesCategory> getByChargeCategoryId(@PathVariable String chargeCategoryId) {
        HMS_TM_IPDChargesCategory categories = ipdChargesCategoryService.getByChargeTypeId(chargeCategoryId);
        return ResponseEntity.ok(categories);
    }

    // Get all IPDChargesCategories
    @GetMapping("/all")
    public ResponseEntity<List<HMS_TM_IPDChargesCategory>> getAllCategories() {
        List<HMS_TM_IPDChargesCategory> categories = ipdChargesCategoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    // Update IPDChargesCategory
    @PutMapping("/{chargeCategoryId}")
    public ResponseEntity<HMS_TM_IPDChargesCategory> updateCategory(@PathVariable String chargeCategoryId, @RequestBody HMS_TM_IPDChargesCategory category) {
        HMS_TM_IPDChargesCategory updatedCategory = ipdChargesCategoryService.updateCategory(chargeCategoryId, category);
        return ResponseEntity.ok(updatedCategory);
    }

    // Soft delete IPDChargesCategory
    @DeleteMapping("/{chargeCategoryId}")
    public ResponseEntity<Void> softDeleteCategory(@PathVariable String chargeCategoryId) {
        ipdChargesCategoryService.softDeleteCategory(chargeCategoryId);
        return ResponseEntity.noContent().build();
    }

}

