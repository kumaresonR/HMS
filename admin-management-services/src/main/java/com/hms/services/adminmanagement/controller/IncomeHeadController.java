package com.hms.services.adminmanagement.controller;

import com.hms.services.adminmanagement.entity.HMS_TM_IncomeHead;
import com.hms.services.adminmanagement.entity.HMS_TW_Expense;
import com.hms.services.adminmanagement.entity.HMS_TW_IncomeHead;
import com.hms.services.adminmanagement.service.IncomeHeadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/income-heads")
public class IncomeHeadController {

    @Autowired
    private IncomeHeadService incomeHeadService;

    @PostMapping("/create")
    public ResponseEntity<List<HMS_TW_IncomeHead>> createTwIncomeHeads(
            @Valid @RequestBody List<HMS_TW_IncomeHead> incomeHeads) {
        return ResponseEntity.ok(incomeHeadService.createTwIncomeHeads(incomeHeads));
    }

    @GetMapping("/tw/{id}")
    public ResponseEntity<HMS_TW_IncomeHead> getTwIncomeHeadById(@PathVariable String id) {
        try {
            HMS_TW_IncomeHead incomeHead = incomeHeadService.getTwIncomeHeadById(id);
            return ResponseEntity.ok(incomeHead);
        } catch (RuntimeException e) {
            return ResponseEntity.ok().build();
        }
    }

    @GetMapping("/tw/all")
    public ResponseEntity<List<HMS_TW_IncomeHead>> getAllTwIncomeHeads() {
        List<HMS_TW_IncomeHead> incomeHeads = incomeHeadService.getAllTwIncomeHeads();
        return ResponseEntity.ok(incomeHeads);
    }

    @PutMapping("/tw/{id}")
    public ResponseEntity<HMS_TW_IncomeHead> updateTwIncomeHead(
            @PathVariable String id,
            @Valid @RequestBody HMS_TW_IncomeHead incomeHead) {
        return ResponseEntity.ok(incomeHeadService.updateTwIncomeHead(id, incomeHead));
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<HMS_TM_IncomeHead> approveTwIncomeHead(@PathVariable String id) {
        return ResponseEntity.ok(incomeHeadService.approveTwIncomeHead(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTwIncomeHeads(
            @PathVariable String id,
            @RequestParam String authStat) {
        try {
            incomeHeadService.deleteTwIncomeHeads(id, authStat);
            return ResponseEntity.ok("Income Head deleted from TM and status updated in TW.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Income head not found or cannot be deleted.");
        }
    }

    @GetMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_IncomeHead> getTmIncomeHeadById(@PathVariable String id) {
        return ResponseEntity.ok(incomeHeadService.getTmIncomeHeadById(id));
    }

    @PutMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_IncomeHead> updateTmIncomeHead(
            @PathVariable String id,
            @Valid @RequestBody HMS_TM_IncomeHead incomeHead) {
        return ResponseEntity.ok(incomeHeadService.updateTmIncomeHead(id, incomeHead));
    }

    @DeleteMapping("/tw/{id}")
    public ResponseEntity<String> deleteTwIncomeHead(@PathVariable String id) {
        incomeHeadService.deleteTwIncomeHead(id);
        return ResponseEntity.ok("Income Head marked as deleted.");
    }

    @GetMapping("/tm/all")
    public ResponseEntity<List<HMS_TM_IncomeHead>> getAllTmIncomeHeads() {
        return ResponseEntity.ok(incomeHeadService.getAllTmIncomeHeads());
    }
}




