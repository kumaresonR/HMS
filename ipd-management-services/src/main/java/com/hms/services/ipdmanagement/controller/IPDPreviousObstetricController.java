package com.hms.services.ipdmanagement.controller;


import com.hms.services.ipdmanagement.entity.HMS_TM_PreviousObstetricHistory;
import com.hms.services.ipdmanagement.model.PreviousObstetricHistoryDTO;
import com.hms.services.ipdmanagement.service.PreviousObstetricHistoryService;
import org.json.simple.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/ipd-obstetric")
public class IPDPreviousObstetricController {

    private final PreviousObstetricHistoryService service;

    public IPDPreviousObstetricController(PreviousObstetricHistoryService service) {
        this.service = service;
    }

    // Create or Update
    @PostMapping("/add")
    public ResponseEntity<PreviousObstetricHistoryDTO> saveOrUpdate(
            @Valid @RequestBody PreviousObstetricHistoryDTO history) {
        return ResponseEntity.ok(service.saveOrUpdate(history));
    }

    // Get All Active
    @GetMapping("/all")
    public ResponseEntity<List<HMS_TM_PreviousObstetricHistory>> getAllActive() {
        return ResponseEntity.ok(service.getAllActive());
    }

    // Get by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        Optional<HMS_TM_PreviousObstetricHistory> history = service.getById(id);
        return history.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Get by IPD ID
    @GetMapping("/ipd/{ipdId}")
    public ResponseEntity<List<HMS_TM_PreviousObstetricHistory>> getByIpdId(@PathVariable String ipdId) {
        return ResponseEntity.ok(service.getByIpdId(ipdId));
    }

    // Soft Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<JSONObject> softDelete(@PathVariable String id) {
        JSONObject isDeleted = service.softDelete(id);
        return ResponseEntity.ok(isDeleted);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRecord(
            @PathVariable String id,
            @Valid @RequestBody PreviousObstetricHistoryDTO updatedHistory) {
        try {
            PreviousObstetricHistoryDTO result = service.updateRecord(id, updatedHistory);
            return ResponseEntity.ok(result);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating the record.");
        }
    }


}

