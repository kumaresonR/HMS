package com.hms.services.opdmanagement.controller;



import com.hms.services.opdmanagement.entity.HMS_TM_OPDVitals;
import com.hms.services.opdmanagement.service.VitalsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/opd-vitals")
public class OPDVitalsController {

    private final VitalsService vitalsService;

    @Autowired
    public OPDVitalsController(VitalsService vitalsService) {
        this.vitalsService = vitalsService;
    }

    @PostMapping("/add")
    public ResponseEntity<List<HMS_TM_OPDVitals>> addVitals(@Valid @RequestBody List<HMS_TM_OPDVitals> vitals) {
        List<HMS_TM_OPDVitals> savedVitals = vitalsService.addVitals(vitals);
        return ResponseEntity.ok(savedVitals);
    }

    @PutMapping("/update/{vitalsId}")
    public ResponseEntity<HMS_TM_OPDVitals> updateVitals(
            @PathVariable String vitalsId,
            @Valid @RequestBody HMS_TM_OPDVitals updatedVitals) {
        HMS_TM_OPDVitals vitals = vitalsService.updateVitals(vitalsId, updatedVitals);
        return vitals != null ? ResponseEntity.ok(vitals) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{vitalsId}")
    public ResponseEntity<Void> deleteVitals(@PathVariable String vitalsId) {
        vitalsService.deleteVitals(vitalsId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/opd/{opdId}")
    public ResponseEntity<List<HMS_TM_OPDVitals>> getVitalsByIPDId(@PathVariable String ipdId) {
        List<HMS_TM_OPDVitals> vitalsList = vitalsService.getVitalsByIPDId(ipdId);
        return vitalsList.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(vitalsList);
    }

    @GetMapping("/{vitalsId}")
    public ResponseEntity<HMS_TM_OPDVitals> getVitalsById(@PathVariable String vitalsId) {
        HMS_TM_OPDVitals vitals = vitalsService.getVitalsById(vitalsId);
        if (vitals != null) {
            return ResponseEntity.ok(vitals);
        } else {
            return ResponseEntity.notFound().build();
        }
    }



}

