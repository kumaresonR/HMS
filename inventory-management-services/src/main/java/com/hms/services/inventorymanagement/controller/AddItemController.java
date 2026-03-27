package com.hms.services.inventorymanagement.controller;

import com.hms.services.inventorymanagement.entity.HMS_TM_AddItem;
import com.hms.services.inventorymanagement.service.AddItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/add-item")
public class AddItemController {

    @Autowired
    private AddItemService service;

    @PostMapping("/create")
    public ResponseEntity<HMS_TM_AddItem> createItem(@RequestBody HMS_TM_AddItem addItem) {
        HMS_TM_AddItem createdItem = service.createItem(addItem);
        return new ResponseEntity<>(createdItem, HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public List<HMS_TM_AddItem> getAllItems() {
        return service.getAllItems();
    }

    @GetMapping("/{id}")
    public ResponseEntity<HMS_TM_AddItem> getItemById(@PathVariable String id) {
        return service.getItemById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<HMS_TM_AddItem> updateItem(@PathVariable String id, @RequestBody HMS_TM_AddItem updatedItem) {
        HMS_TM_AddItem updated = service.updateItem(id, updatedItem);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteItem(@PathVariable String id) {
        try {
            service.deleteItem(id);
            return new ResponseEntity<>("Item deleted successfully.", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("Item not found or cannot be deleted.", HttpStatus.NOT_FOUND);
        }
    }
}

