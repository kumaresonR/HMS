package com.hms.services.bloodbankmanagement.controller;

import com.hms.services.bloodbankmanagement.entity.HMS_TM_BagStock;
import com.hms.services.bloodbankmanagement.model.BagStockDTO;
import com.hms.services.bloodbankmanagement.model.DonorWithBagStockDTO;
import com.hms.services.bloodbankmanagement.service.BagStockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/bag-stock")
public class BagStockController {

    @Autowired
    private BagStockService bagStockService;

    @PostMapping("/create")
    public ResponseEntity<HMS_TM_BagStock> createBagStock(
            @RequestPart("bagStockData") String bagStockDataJson,
            @RequestPart(value = "attachment", required = false) MultipartFile attachmentFile) {

        try {
            HMS_TM_BagStock newBagStock = bagStockService.createBagStock(bagStockDataJson, attachmentFile);
            return ResponseEntity.status(HttpStatus.CREATED).body(newBagStock);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<HMS_TM_BagStock> updateBagStock(
            @PathVariable String id,
            @RequestPart("bagStockData") String bagStockDataJson,
            @RequestPart(value = "attachment", required = false) MultipartFile attachmentFile) {

        try {
            HMS_TM_BagStock updatedBagStock = bagStockService.updateBagStock(id, bagStockDataJson, attachmentFile);
            return ResponseEntity.ok(updatedBagStock);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<BagStockDTO> getBagStockById(@PathVariable String id) {
        BagStockDTO dto = bagStockService.getBagStockById(id);
        return ResponseEntity.ok(dto);
    }

    @GetMapping
    public ResponseEntity<List<BagStockDTO>> getAllBagStocks() {
        List<BagStockDTO> bagStocks = bagStockService.getAllBagStocks();
        return ResponseEntity.ok(bagStocks);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteBagStock(@PathVariable String id) {
        try {
            HMS_TM_BagStock deletedBagStock = bagStockService.softDeleteBagStock(id);
            return ResponseEntity.ok("Bag Stock marked as deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Bag Stock not found.");
        }
    }

    @GetMapping("/{donorId}/bag-stocks")
    public ResponseEntity<DonorWithBagStockDTO> getDonorWithBagStocks(@PathVariable String donorId) {
        try {
            DonorWithBagStockDTO donorWithBagStocks = bagStockService.getDonorWithBagStocks(donorId);
            return ResponseEntity.ok(donorWithBagStocks);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}


