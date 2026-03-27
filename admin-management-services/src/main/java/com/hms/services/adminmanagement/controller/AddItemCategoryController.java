package com.hms.services.adminmanagement.controller;

import com.hms.services.adminmanagement.entity.HMS_TM_Add_Item_Category;
import com.hms.services.adminmanagement.entity.HMS_TW_Add_Item_Category;
import com.hms.services.adminmanagement.service.AddItemCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/item-categories")
public class AddItemCategoryController {

    @Autowired
    private AddItemCategoryService addItemCategoryService;

    @PostMapping("/create")
    public ResponseEntity<List<HMS_TW_Add_Item_Category>> createItemCategories(
            @Valid @RequestBody List<HMS_TW_Add_Item_Category> categories) {
        List<HMS_TW_Add_Item_Category> createdCategories = addItemCategoryService.createItemCategories(categories);
        return ResponseEntity.ok(createdCategories);
    }

    @GetMapping("/tw/{id}")
    public ResponseEntity<HMS_TW_Add_Item_Category> getItemCategoryById(@PathVariable String id) {
        HMS_TW_Add_Item_Category category = addItemCategoryService.getItemCategoryById(id);
        if (category != null) {
            return ResponseEntity.ok(category);
        } else {
            return ResponseEntity.ok().build();
        }
    }

    @GetMapping("/tw/all")
    public ResponseEntity<List<HMS_TW_Add_Item_Category>> getAllTwItemCategories() {
        List<HMS_TW_Add_Item_Category> categories = addItemCategoryService.getAllTwItemCategories();
        return ResponseEntity.ok(categories);
    }

    @PutMapping("/tw/{id}")
    public ResponseEntity<HMS_TW_Add_Item_Category> updateItemCategory(
            @PathVariable String id,
            @Valid @RequestBody HMS_TW_Add_Item_Category category) {
        return ResponseEntity.ok(addItemCategoryService.updateItemCategory(id, category));
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<HMS_TW_Add_Item_Category> approveItemCategory(@PathVariable String id) {
        return ResponseEntity.ok(addItemCategoryService.approveItemCategory(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteItemCategory(@PathVariable String id, @RequestParam String authStat) {
        try {
            addItemCategoryService.deleteItemCategory(id, authStat);
            return ResponseEntity.ok("Item category deleted from TM and status updated in TW.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Item category not found or cannot be deleted.");
        }
    }

    @GetMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_Add_Item_Category> getItemCategoryByIds(@PathVariable String id) {
        return ResponseEntity.ok(addItemCategoryService.getItemCategoryByIds(id));
    }

    @GetMapping("/tm/all")
    public ResponseEntity<List<HMS_TM_Add_Item_Category>> getAllTmItemCategories() {
        List<HMS_TM_Add_Item_Category> categories = addItemCategoryService.getAllTmItemCategories();
        return ResponseEntity.ok(categories);
    }

    @PutMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_Add_Item_Category> updateItemCategory(
            @PathVariable String id,
            @Valid @RequestBody HMS_TM_Add_Item_Category category) {
        return ResponseEntity.ok(addItemCategoryService.updateItemCategory(id, category));
    }

    @DeleteMapping("/tw/remove/{id}")
    public ResponseEntity<String> deleteTwItemCategory(@PathVariable String id) {
        try {
            addItemCategoryService.deleteTwItemCategory(id);
            return ResponseEntity.ok("Item category marked as deleted.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Item category not found or cannot be deleted.");
        }
    }
}



