package com.hms.services.adminmanagement.controller;


import com.hms.services.adminmanagement.entity.HMS_TM_Operation;
import com.hms.services.adminmanagement.entity.HMS_TW_Operation;
import com.hms.services.adminmanagement.entity.HMS_TW_OperationCategory;
import com.hms.services.adminmanagement.model.OperationDTO;
import com.hms.services.adminmanagement.service.OperationService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/operation-details")
public class OperationController {

    private final OperationService operationService;

    @Autowired
    public OperationController(final OperationService operationService) {
        this.operationService = operationService;
    }

    @PostMapping("/work-table")
    public ResponseEntity<List<HMS_TW_Operation>> createWorkEntry(@RequestBody List<HMS_TW_Operation> twOperation) {
        return ResponseEntity.ok(operationService.createInWorkTable(twOperation));
    }

    @PatchMapping("/{id}/authorize")
    public ResponseEntity<HMS_TW_Operation> updateAuthStat(
            @PathVariable("id") String id,
            @RequestParam("authStat") String authStat) {
        HMS_TW_Operation updatedFloor = operationService.updateAuthStatById(id, authStat);
        return ResponseEntity.ok(updatedFloor);
    }

    @PutMapping("/work-table/{id}")
    public ResponseEntity<HMS_TW_Operation> approveWorkEntry(@PathVariable String id, @RequestBody HMS_TW_Operation twOperation) {
        return ResponseEntity.ok(operationService.approveWorkTableEntry(id, twOperation));
    }

    @GetMapping("/master-table")
    public ResponseEntity<List<OperationDTO>> getAllMasterEntries() {
        return ResponseEntity.ok(operationService.getAllMasterEntries());
    }

    @GetMapping("/work-table")
    public ResponseEntity<List<OperationDTO>> getAllWorkEntries() {
        return ResponseEntity.ok(operationService.getAllWorkEntries());
    }

    // Endpoint to soft delete a work operation
    @DeleteMapping("/work-table/{operationId}")
    public ResponseEntity<JSONObject> softDeleteWorkOperation(@PathVariable String operationId) {
        return ResponseEntity.ok(operationService.softDeleteWorkOperation(operationId));
    }

    // Endpoint to soft delete a master operation
    @DeleteMapping("/master-table/{operationId}")
    public ResponseEntity<JSONObject> softDeleteMasterOperation(@PathVariable String operationId) {
        return ResponseEntity.ok(operationService.softDeleteMasterOperation(operationId));
    }


}



