package com.hms.services.ipdmanagement.controller;


import com.hms.services.ipdmanagement.entity.HMS_TM_IPDOperation;
import com.hms.services.ipdmanagement.model.IPDOperationDTO;
import com.hms.services.ipdmanagement.service.IPDOperationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/ipd-operation")
public class IPDOperationController {

    private final IPDOperationService ipdOperationService;

    @Autowired
    public IPDOperationController(final IPDOperationService ipdOperationService) {
        this.ipdOperationService = ipdOperationService;
    }

    // Create or Update an operation
    @PostMapping("/add")
    public ResponseEntity<HMS_TM_IPDOperation> createOrUpdateOperation(@RequestBody HMS_TM_IPDOperation operation) {
        HMS_TM_IPDOperation savedOperation = ipdOperationService.saveOrUpdate(operation);
        return ResponseEntity.ok(savedOperation);
    }

    // Get all operations
    @GetMapping("/all")
    public ResponseEntity<List<HMS_TM_IPDOperation>> getAllOperations() {
        List<HMS_TM_IPDOperation> operations = ipdOperationService.getAllOperations();
        return ResponseEntity.ok(operations);
    }

    @GetMapping("/{operationId}")
    public ResponseEntity<IPDOperationDTO> getById(@PathVariable String operationId) {
        return ResponseEntity.ok(ipdOperationService.getOperationById(operationId));
    }

    // Delete operation by ID
    @DeleteMapping("/{operationId}")
    public ResponseEntity<Void> deleteOperation(@PathVariable String operationId) {
        ipdOperationService.deleteOperation(operationId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{operationId}")
    public ResponseEntity<HMS_TM_IPDOperation> updateById(@PathVariable String operationId,@RequestBody HMS_TM_IPDOperation operation) {
        return ResponseEntity.ok(ipdOperationService.updateOperationById(operationId,operation));
    }


    // Get operations by OPD ID
    @GetMapping("/by-ipd/{ipdId}")
    public ResponseEntity<List<HMS_TM_IPDOperation>> getDetailsByOpdId(@PathVariable String ipdId) {
        List<HMS_TM_IPDOperation> operations = ipdOperationService.getDetailsByOpdId(ipdId);
        return ResponseEntity.ok(operations);
    }

    @GetMapping("/by-otReferenceNo/{refNo}")
    public ResponseEntity<List<HMS_TM_IPDOperation>> getDetailsByRefNo(@PathVariable String refNo) {
        List<HMS_TM_IPDOperation> operations = ipdOperationService.getDetailsByOTReferenceNo(refNo);
        return ResponseEntity.ok(operations);
    }

    @GetMapping("/searchByDate")
    public List<IPDOperationDTO> searchByDate(@RequestParam String date,@RequestParam String status) {
        LocalDate operationDate = LocalDate.parse(date);
        return ipdOperationService.getOperationsByDate(operationDate,status);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateOperationById(@PathVariable String id,@RequestBody IPDOperationDTO operation) {
        return ResponseEntity.ok(ipdOperationService.updateOTOperation(id,operation));
    }

    @PutMapping("/updateStatus/{id}")
    public ResponseEntity<String> updateOperationStatusById(@PathVariable String id,@RequestParam String status) {
        return ResponseEntity.ok(ipdOperationService.updateOTOperationStatus(id,status));
    }


}

