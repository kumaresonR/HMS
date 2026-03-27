package com.hms.services.opdmanagement.controller;

import com.hms.services.opdmanagement.entity.HMS_TM_Commission;
import com.hms.services.opdmanagement.model.CommissionDTO;
import com.hms.services.opdmanagement.service.CommissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/commission")
public class OPDCommissionController {

    @Autowired
    private CommissionService service;



    // Get all active records
    @GetMapping
    public ResponseEntity<List<CommissionDTO>> getAllCommissions(@RequestParam(value = "isPaid", required = false) Boolean isPaid) {
        List<CommissionDTO> commissions = service.getAllCommissions(isPaid);
        return ResponseEntity.ok(commissions);
    }

    // Get a record by ID
    @GetMapping("/{id}")
    public ResponseEntity<CommissionDTO> getCommissionById(@PathVariable String id) {
        Optional<CommissionDTO> commission = service.getCommissionById(id);
        return commission.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create a new record
    @PostMapping
    public ResponseEntity<HMS_TM_Commission> createCommission(@Valid @RequestBody HMS_TM_Commission commission) {
        HMS_TM_Commission savedCommission = service.createCommission(commission);
        return ResponseEntity.ok(savedCommission);
    }

    // Soft delete a record (set isActive=false)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> softDeleteCommission(@PathVariable String id) {
        boolean isDeleted = service.softDeleteCommission(id);
        if (isDeleted) {
            return ResponseEntity.ok("Commission deleted successfully.");
        }
        return ResponseEntity.notFound().build();
    }

    // Get all active records or filter by commissionCategory
    @GetMapping("/category")
    public ResponseEntity<List<CommissionDTO>> getAllCommissions(
            @RequestParam(required = false) String commissionCategory) {
        List<CommissionDTO> commissions=null;
        if (commissionCategory != null && !commissionCategory.isEmpty()) {
            commissions = service.getCommissionsByCategory(commissionCategory);
        }
        return ResponseEntity.ok(commissions);
    }


    @GetMapping("/allDoctorInfo")
    public ResponseEntity<List<CommissionDTO>> getAllDoctorCommissions(
            @RequestParam(required = false) String doctorId) {
        List<CommissionDTO> commissions =null;
        if (doctorId != null && !doctorId.isEmpty()) {
            commissions = service.getCommissionsByDoctorId(doctorId);
        }
        return ResponseEntity.ok(commissions);
    }

    @PatchMapping("/{commissionId}/status")
    public ResponseEntity<String> updateCommissionStatus(@PathVariable String commissionId, @RequestParam boolean isPaid) {
        boolean updated = service.updateCommissionStatus(commissionId, isPaid);
        if (updated) {
            return ResponseEntity.ok("Commission status updated successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Commission not found.");
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<HMS_TM_Commission> updateCommission(
            @PathVariable String id,
            @Valid @RequestBody HMS_TM_Commission updatedCommission
    ) {
        HMS_TM_Commission savedCommission = service.updateCommission(id, updatedCommission);
        return ResponseEntity.ok(savedCommission);
    }



}

