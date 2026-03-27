package com.hms.services.billingmanagement.controller;

import com.hms.services.billingmanagement.entity.HMS_TM_BadStock;
import com.hms.services.billingmanagement.model.BadStockDTO;
import com.hms.services.billingmanagement.model.IncomeChanges;
import com.hms.services.billingmanagement.service.BadStockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/bad-stock")
public class BadStockController {

    @Autowired
    private BadStockService badStockService;

//    @PostMapping("/create")
//    public ResponseEntity<HMS_TM_BadStock> createBadStock(@RequestBody HMS_TM_BadStock badStock) {
//        HMS_TM_BadStock createdBadStock = badStockService.createBadStock(badStock);
//        return new ResponseEntity<>(createdBadStock, HttpStatus.CREATED);
//    }

    @GetMapping("/all")
    public List<BadStockDTO> getAllBadStock() {
        return badStockService.getAllBadStock();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BadStockDTO> getBadStockById(@PathVariable String id) {
        Optional<BadStockDTO> badStock = badStockService.getBadStockById(id);
        return badStock.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/medicine/{addMedicineId}")
    public ResponseEntity<List<HMS_TM_BadStock>> getBadStockByMedicineId(@PathVariable String addMedicineId) {
        List<HMS_TM_BadStock> badStocks = badStockService.getBadStockByMedicineId(addMedicineId);
        if (badStocks.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(badStocks);
    }

//    @PutMapping("/{id}")
//    public ResponseEntity<HMS_TM_BadStock> updateBadStock(@PathVariable String id, @RequestBody HMS_TM_BadStock badStock) {
//        HMS_TM_BadStock updatedBadStock = badStockService.updateBadStock(id, badStock);
//        return updatedBadStock != null ? ResponseEntity.ok(updatedBadStock) : ResponseEntity.notFound().build();
//    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBadStock(@PathVariable String id) {
        try {
            badStockService.deleteBadStock(id);
            return new ResponseEntity<>(" Bill marked as deleted.", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("Bad Stock not found or cannot be deleted.", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/totalStock")
    public Double totalBadStock() {
        return badStockService.getTotalBadStock();
    }

}










