package com.hms.services.adminmanagement.controller;

import com.hms.services.adminmanagement.entity.HMS_TM_Item_Supplier;
import com.hms.services.adminmanagement.entity.HMS_TW_Item_Supplier;
import com.hms.services.adminmanagement.service.ItemSupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/item-suppliers")
public class ItemSupplierController {

    @Autowired
    private ItemSupplierService itemSupplierService;

    @PostMapping("/create")
    public ResponseEntity<List<HMS_TW_Item_Supplier>> createTwItemSuppliers(
            @Valid @RequestBody List<HMS_TW_Item_Supplier> itemSuppliers) {
        return ResponseEntity.ok(itemSupplierService.createTwItemSuppliers(itemSuppliers));
    }

    @GetMapping("/tw/{id}")
    public ResponseEntity<HMS_TW_Item_Supplier> getTwItemSupplierById(@PathVariable String id) {
        try {
            HMS_TW_Item_Supplier itemSupplier = itemSupplierService.getTwItemSupplierById(id);
            return ResponseEntity.ok(itemSupplier);
        } catch (RuntimeException e) {
            return ResponseEntity.ok().build();        }
    }

    @GetMapping("/tw/all")
    public ResponseEntity<List<HMS_TW_Item_Supplier>> getAllTwItemSuppliers() {
        List<HMS_TW_Item_Supplier> itemSuppliers = itemSupplierService.getAllTwItemSuppliers();
        return ResponseEntity.ok(itemSuppliers);
    }

    @PutMapping("/tw/{id}")
    public ResponseEntity<HMS_TW_Item_Supplier> updateTwItemSupplier(
            @PathVariable String id,
            @Valid @RequestBody HMS_TW_Item_Supplier itemSupplier) {
        return ResponseEntity.ok(itemSupplierService.updateTwItemSupplier(id, itemSupplier));
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<HMS_TM_Item_Supplier> approveTwItemSupplier(@PathVariable String id) {
        return ResponseEntity.ok(itemSupplierService.approveTwItemSupplier(id));
    }

    @GetMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_Item_Supplier> getTmItemSupplierById(@PathVariable String id) {
        return ResponseEntity.ok(itemSupplierService.getTmItemSupplierById(id));
    }

    @PutMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_Item_Supplier> updateTmItemSupplier(
            @PathVariable String id,
            @Valid @RequestBody HMS_TM_Item_Supplier itemSupplier) {
        return ResponseEntity.ok(itemSupplierService.updateTmItemSupplier(id, itemSupplier));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTwItemSuppliers(@PathVariable String id ,@RequestParam String authStat) {
        try {
            itemSupplierService.deleteTwItemSuppliers(id, authStat);
            return ResponseEntity.ok("Item Supplier deleted from TM and status updated in TW.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Item supplier not found or cannot be deleted.");
        }
    }

    @DeleteMapping("/tw/{id}")
    public ResponseEntity<String> deleteTwItemSupplier(@PathVariable String id) {
        itemSupplierService.deleteTwItemSupplier(id);
        return ResponseEntity.ok("Item supplier marked as deleted.");
    }

    @GetMapping("/tm/all")
    public ResponseEntity<List<HMS_TM_Item_Supplier>> getAllTmItemSuppliers() {
        return ResponseEntity.ok(itemSupplierService.getAllTmItemSuppliers());
    }
}




