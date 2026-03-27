package com.hms.services.adminmanagement.controller;

import com.hms.services.adminmanagement.entity.HMS_TM_Supplier;
import com.hms.services.adminmanagement.entity.HMS_TW_Specialist;
import com.hms.services.adminmanagement.entity.HMS_TW_Supplier;
import com.hms.services.adminmanagement.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/suppliers")
public class SupplierController {

    @Autowired
    private SupplierService supplierService;

    @PostMapping("/create")
    public ResponseEntity<HMS_TW_Supplier> createSupplier(@Valid @RequestBody HMS_TW_Supplier supplier) {
        return ResponseEntity.ok(supplierService.createSupplier(supplier));
    }

    @GetMapping("/tw/{supplierId}")
    public ResponseEntity<HMS_TW_Supplier> getSupplierByIds(@PathVariable String supplierId) {
        try {
            HMS_TW_Supplier supplier = supplierService.getSupplierByIds(supplierId);
            return ResponseEntity.ok(supplier);
        } catch (RuntimeException e) {
            return ResponseEntity.ok().build();
        }
    }

    @GetMapping("/tw/all")
    public ResponseEntity<List<HMS_TW_Supplier>> getAllSuppliersTW() {
        List<HMS_TW_Supplier> suppliers = supplierService.getAllSuppliersTW();
        return ResponseEntity.ok(suppliers);
    }

    @PutMapping("/tw/{id}")
    public ResponseEntity<HMS_TW_Supplier> updateSupplier(
            @PathVariable String id, @Valid @RequestBody HMS_TW_Supplier supplier) {
        return ResponseEntity.ok(supplierService.updateSupplier(id, supplier));
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<HMS_TW_Supplier> approveSupplier(
            @PathVariable String id) {

        HMS_TW_Supplier approvedSupplier = supplierService.approveSupplier(id);

        return ResponseEntity.ok(approvedSupplier);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSupplier(
            @PathVariable String id,
            @RequestParam String authStat) {
        try {
            supplierService.deleteSupplier(id, authStat);
            return ResponseEntity.ok("Supplier deleted from TM and status updated to UNAUTHORIZED in TW.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Supplier not found or cannot be deleted.");
        }
    }

    @GetMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_Supplier> getSupplierById(@PathVariable String id) {
        return ResponseEntity.ok(supplierService.getSupplierById(id));
    }

    @GetMapping("/tm/all")
    public ResponseEntity<List<HMS_TM_Supplier>> getAllSuppliersTM() {
        List<HMS_TM_Supplier> suppliers = supplierService.getAllSuppliersTM();
        return ResponseEntity.ok(suppliers);
    }

    @PutMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_Supplier> updateSupplier(
            @PathVariable String id, @Valid @RequestBody HMS_TM_Supplier supplier) {
        return ResponseEntity.ok(supplierService.updateSupplier(id, supplier));
    }

    @DeleteMapping("/tw/remove/{supplierId}")
    public ResponseEntity<String> deleteTwSupplier(@PathVariable String supplierId) {
        try {
            supplierService.deleteTwSupplier(supplierId);
            return new ResponseEntity<>("Supplier marked as deleted.", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("Supplier not found or cannot be deleted.", HttpStatus.NOT_FOUND);
        }
    }
}



