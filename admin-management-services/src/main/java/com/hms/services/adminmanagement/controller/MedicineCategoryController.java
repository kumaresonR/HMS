package com.hms.services.adminmanagement.controller;

import com.hms.services.adminmanagement.entity.HMS_TM_MedicineCategory;
import com.hms.services.adminmanagement.entity.HMS_TW_MedicineCategory;
import com.hms.services.adminmanagement.service.MedicineCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/medicine-categories")
public class MedicineCategoryController {

    @Autowired
    private MedicineCategoryService medicineCategoryService;

    @PostMapping("/create")
    public ResponseEntity<HMS_TW_MedicineCategory> createMedicineCategory(@Valid @RequestBody HMS_TW_MedicineCategory medicineCategory) {
        return ResponseEntity.ok(medicineCategoryService.createMedicineCategory(medicineCategory));
    }

    @GetMapping("/tw/{id}")
    public ResponseEntity<HMS_TW_MedicineCategory> getMedicineCategoryById(@PathVariable String id) {
        HMS_TW_MedicineCategory medicineCategory = medicineCategoryService.getMedicineCategoryById(id);
        if (medicineCategory == null) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/tw/all")
    public ResponseEntity<List<HMS_TW_MedicineCategory>> getAllMedicineCategories() {
        List<HMS_TW_MedicineCategory> categories = medicineCategoryService.getAllMedicineCategories();
        return ResponseEntity.ok(categories);
    }

    @PutMapping("/tw/{id}")
    public ResponseEntity<HMS_TW_MedicineCategory> updateMedicineCategory(
            @PathVariable String id, @Valid @RequestBody HMS_TW_MedicineCategory medicineCategory) {
        return ResponseEntity.ok(medicineCategoryService.updateMedicineCategory(id, medicineCategory));
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<HMS_TW_MedicineCategory> approveMedicineCategory(
            @PathVariable String id) {

        HMS_TW_MedicineCategory approvedCategory = medicineCategoryService.approveMedicineCategory(id);

        return ResponseEntity.ok(approvedCategory);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMedicineCategory(
            @PathVariable String id,
            @RequestParam String authStat) {
        try {
            medicineCategoryService.deleteMedicineCategory(id, authStat);
            return ResponseEntity.ok("Medicine category deleted from TM and status updated to UNAUTHORIZED in TW.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Medicine category not found or cannot be deleted.");
        }
    }

    @GetMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_MedicineCategory> getMedicineCategoryByIds(@PathVariable String id) {
        return ResponseEntity.ok(medicineCategoryService.getMedicineCategoryByIds(id));
    }

    @PutMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_MedicineCategory> updateMedicineCategory(
            @PathVariable String id, @Valid @RequestBody HMS_TM_MedicineCategory medicineCategory) {
        return ResponseEntity.ok(medicineCategoryService.updateMedicineCategory(id, medicineCategory));
    }

    @GetMapping("/tm/all")
    public ResponseEntity<List<HMS_TM_MedicineCategory>> getAllMedicineCategoriesTM() {
        List<HMS_TM_MedicineCategory> categories = medicineCategoryService.getAllMedicineCategoriesTM();
        return ResponseEntity.ok(categories);
    }

    @DeleteMapping("/tw/remove/{categoryId}")
    public ResponseEntity<String> deleteTwMedicineCategory(@PathVariable String categoryId) {
        try {
            medicineCategoryService.deleteTwMedicineCategory(categoryId);
            return new ResponseEntity<>("Medicine category marked as deleted.", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("Medicine category not found or cannot be deleted.", HttpStatus.NOT_FOUND);
        }
    }
}




