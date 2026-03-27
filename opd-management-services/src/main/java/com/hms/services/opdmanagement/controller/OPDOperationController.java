package com.hms.services.opdmanagement.controller;


import com.hms.services.opdmanagement.entity.HMS_TM_OPDOperation;
import com.hms.services.opdmanagement.model.OPDOperationDTO;
import com.hms.services.opdmanagement.service.OPDChargesService;
import com.hms.services.opdmanagement.service.OPDOperationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/opd-operation")
public class OPDOperationController {

    private final OPDOperationService opdOperationService;

    @Autowired
    public OPDOperationController(final OPDOperationService opdOperationService) {
        this.opdOperationService = opdOperationService;
    }

    // Create or Update an operation
    @PostMapping("/add")
    public ResponseEntity<HMS_TM_OPDOperation> createOrUpdateOperation(@Valid @RequestBody HMS_TM_OPDOperation operation) {
        HMS_TM_OPDOperation savedOperation = opdOperationService.saveOrUpdate(operation);
        return ResponseEntity.ok(savedOperation);
    }

    // Get all operations
    @GetMapping("/all")
    public ResponseEntity<List<HMS_TM_OPDOperation>> getAllOperations() {
        List<HMS_TM_OPDOperation> operations = opdOperationService.getAllOperations();
        return ResponseEntity.ok(operations);
    }

    @GetMapping("/{operationId}")
    public ResponseEntity<OPDOperationDTO> getById(@PathVariable String operationId) {
        return ResponseEntity.ok(opdOperationService.getOperationById(operationId));
    }

    // Delete operation by ID
    @DeleteMapping("/{operationId}")
    public ResponseEntity<Void> deleteOperation(@PathVariable String operationId) {
        opdOperationService.deleteOperation(operationId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{operationId}")
    public ResponseEntity<HMS_TM_OPDOperation> updateById(@PathVariable String operationId,@Valid @RequestBody HMS_TM_OPDOperation operation) {
        return ResponseEntity.ok(opdOperationService.updateOperationById(operationId,operation));
    }


    // Get operations by OPD ID
    @GetMapping("/by-opd/{opdId}")
    public ResponseEntity<List<HMS_TM_OPDOperation>> getDetailsByOpdId(@PathVariable String opdId) {
        List<HMS_TM_OPDOperation> operations = opdOperationService.getDetailsByOpdId(opdId);
        return ResponseEntity.ok(operations);
    }


    @GetMapping("/by-otReferenceNo/{refNo}")
    public ResponseEntity<List<HMS_TM_OPDOperation>> getDetailsByRefNo(@PathVariable String refNo) {
        List<HMS_TM_OPDOperation> operations = opdOperationService.getDetailsByOTReferenceNo(refNo);
        return ResponseEntity.ok(operations);
    }

    @GetMapping("/searchByDate")
    public List<OPDOperationDTO> searchByDate(@RequestParam String date,@RequestParam String status) {
        LocalDate operationDate = LocalDate.parse(date);
        return opdOperationService.getOperationsByDate(operationDate,status);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateOperationById(@PathVariable String id,@Valid @RequestBody OPDOperationDTO operation) {
        return ResponseEntity.ok(opdOperationService.updateOTOperation(id,operation));
    }

    @PutMapping("/updateStatus/{id}")
    public ResponseEntity<String> updateOperationStatusById(@PathVariable String id,@RequestParam String status) {
        return ResponseEntity.ok(opdOperationService.updateOTOperationStatus(id,status));
    }



}

