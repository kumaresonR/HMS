package com.hms.services.adminmanagement.controller;

import com.hms.services.adminmanagement.entity.HMS_TM_Item_Store;
import com.hms.services.adminmanagement.entity.HMS_TW_Item_Store;
import com.hms.services.adminmanagement.service.ItemStoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/item-stores")
public class ItemStoreController {

    @Autowired
    private ItemStoreService itemStoreService;

    @PostMapping("/create")
    public ResponseEntity<List<HMS_TW_Item_Store>> createTwItemStores(
            @Valid @RequestBody List<HMS_TW_Item_Store> itemStores) {
        return ResponseEntity.ok(itemStoreService.createTwItemStores(itemStores));
    }

    @GetMapping("/tw/{id}")
    public ResponseEntity<HMS_TW_Item_Store> getTwItemStoreById(@PathVariable String id) {
        try {
            HMS_TW_Item_Store itemStore = itemStoreService.getTwItemStoreById(id);
            return ResponseEntity.ok(itemStore);
        } catch (RuntimeException e) {
            return ResponseEntity.ok().build();        }
    }

    @GetMapping("/tw/all")
    public ResponseEntity<List<HMS_TW_Item_Store>> getAllTwItemStores() {
        List<HMS_TW_Item_Store> itemStores = itemStoreService.getAllTwItemStores();
        return ResponseEntity.ok(itemStores);
    }

    @PutMapping("/tw/{id}")
    public ResponseEntity<HMS_TW_Item_Store> updateTwItemStore(
            @PathVariable String id,
            @Valid @RequestBody HMS_TW_Item_Store itemStore) {
        return ResponseEntity.ok(itemStoreService.updateTwItemStore(id, itemStore));
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<HMS_TM_Item_Store> approveTwItemStore(@PathVariable String id) {
        return ResponseEntity.ok(itemStoreService.approveTwItemStore(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTwItemStores(@PathVariable String id, @RequestParam String authStat) {
        try {
            itemStoreService.deleteTwItemStores(id, authStat);
            return ResponseEntity.ok("Item Store deleted from TM and status updated in TW.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Item store not found or cannot be deleted.");
        }
    }

    @GetMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_Item_Store> getTmItemStoreById(@PathVariable String id) {
        return ResponseEntity.ok(itemStoreService.getTmItemStoreById(id));
    }

    @PutMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_Item_Store> updateTmItemStore(
            @PathVariable String id,
            @Valid @RequestBody HMS_TM_Item_Store itemStore) {
        return ResponseEntity.ok(itemStoreService.updateTmItemStore(id, itemStore));
    }

    @DeleteMapping("/tw/{id}")
    public ResponseEntity<String> deleteTwItemStore(@PathVariable String id) {
        itemStoreService.deleteTwItemStore(id);
        return ResponseEntity.ok("Item store marked as deleted.");
    }

    @GetMapping("/tm/all")
    public ResponseEntity<List<HMS_TM_Item_Store>> getAllTmItemStores() {
        return ResponseEntity.ok(itemStoreService.getAllTmItemStores());
    }
}




