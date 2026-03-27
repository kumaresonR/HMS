package com.hms.services.inventorymanagement.controller;

import com.hms.services.inventorymanagement.entity.HMS_TM_ItemStock;
import com.hms.services.inventorymanagement.service.ItemStockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/item-stock")
public class ItemStockController {

    @Autowired
    private ItemStockService itemStockService;

    @PostMapping("/create")
    public ResponseEntity<HMS_TM_ItemStock> createItemStock(
            @RequestPart("itemStockData") String itemStockDataJson,
            @RequestPart(value = "attachment", required = false) MultipartFile attachmentFile) {

        try {
            HMS_TM_ItemStock createdItemStock = itemStockService.addItemStock(itemStockDataJson, attachmentFile);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdItemStock);
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<HMS_TM_ItemStock>> getAllItemStocks() {
        List<HMS_TM_ItemStock> itemStocks = itemStockService.getAllItemStocks();
        return itemStocks.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(itemStocks);
    }

    @GetMapping("/{Id}")
    public ResponseEntity<HMS_TM_ItemStock> getItemStockById(@PathVariable String itemStockId) {
        return itemStockService.getItemStockById(itemStockId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<HMS_TM_ItemStock> updateItemStock(
            @PathVariable String id,
            @RequestPart("itemStockData") String itemStockDataJson,
            @RequestPart(value = "attachment", required = false) MultipartFile attachmentFile) {

        try {
            HMS_TM_ItemStock updatedItemStock = itemStockService.updateItemStock(id, itemStockDataJson, attachmentFile);
            return ResponseEntity.ok(updatedItemStock);
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItemStock(@PathVariable String id) {
        try {
            itemStockService.deleteItemStock(id);
            return ResponseEntity.ok("Item Stock deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Item Stock not found or cannot be deleted.");
        }
    }

    @GetMapping("/all-search")
    public ResponseEntity<Map<String, Object>> searchItemStock(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Pageable pageable
    ) {
        Page<HMS_TM_ItemStock> pageResult = itemStockService.searchItemStock(timeDuration, startDate, endDate, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("data", pageResult.getContent());
        response.put("currentPage", pageResult.getNumber());
        response.put("totalItems", pageResult.getTotalElements());
        response.put("totalPages", pageResult.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/download-item-stock")
    public ResponseEntity<Resource> downloadItemStockAsExcel(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) throws IOException {

        List<HMS_TM_ItemStock> itemStocks = itemStockService.searchItemStocks(timeDuration, startDate, endDate);
        ByteArrayInputStream in = itemStockService.generateItemStockExcel(itemStocks);
        InputStreamResource file = new InputStreamResource(in);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=item_stocks.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(file);
    }

}


