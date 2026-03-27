package com.hms.services.laboratorymanagement.controller;

import com.hms.services.laboratorymanagement.entity.HMS_TM_LabInvestigation;
import com.hms.services.laboratorymanagement.service.LabInvestigationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/lab-investigations")
public class LabInvestigationController {
    @Autowired
    private final LabInvestigationService service;

    public LabInvestigationController(LabInvestigationService service) {
        this.service = service;
    }

    @GetMapping("/all")
    public List<HMS_TM_LabInvestigation> getAllLabInvestigations() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<HMS_TM_LabInvestigation> getLabInvestigationById(@PathVariable String id) {
        Optional<HMS_TM_LabInvestigation> labInvestigation = service.getById(id);
        return labInvestigation.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    public ResponseEntity<HMS_TM_LabInvestigation> createLabInvestigation(@RequestBody HMS_TM_LabInvestigation labInvestigation) {
        HMS_TM_LabInvestigation created = service.create(labInvestigation);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<HMS_TM_LabInvestigation> updateLabInvestigation(
            @PathVariable String id,
            @RequestBody HMS_TM_LabInvestigation labInvestigation) {
        if (!service.getById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        HMS_TM_LabInvestigation updated = service.update(id, labInvestigation);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLabInvestigation(@PathVariable String id) {
        if (!service.getById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

