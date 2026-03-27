package com.hms.services.ipdmanagement.controller;


import com.hms.services.ipdmanagement.entity.HMS_TM_Vitals;
import com.hms.services.ipdmanagement.service.VitalsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/ipd-vitals")
public class IPDVitalsController {

    private final VitalsService vitalsService;

    @Autowired
    public IPDVitalsController(VitalsService vitalsService) {
        this.vitalsService = vitalsService;
    }

    @PostMapping("/add")
    public ResponseEntity<List<HMS_TM_Vitals>> addVitals(@Valid @RequestBody List<HMS_TM_Vitals> vitals) {
        List<HMS_TM_Vitals> savedVitals = vitalsService.addVitals(vitals);
        return ResponseEntity.ok(savedVitals);
    }

    @PutMapping("/update/{vitalsId}")
    public ResponseEntity<HMS_TM_Vitals> updateVitals(
            @PathVariable String vitalsId,
            @Valid @RequestBody HMS_TM_Vitals updatedVitals) {
        HMS_TM_Vitals vitals = vitalsService.updateVitals(vitalsId, updatedVitals);
        return vitals != null ? ResponseEntity.ok(vitals) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{vitalsId}")
    public ResponseEntity<Void> deleteVitals(@PathVariable String vitalsId) {
        vitalsService.deleteVitals(vitalsId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/ipd/{ipdId}")
    public ResponseEntity<List<HMS_TM_Vitals>> getVitalsByIPDId(@PathVariable String ipdId) {
        List<HMS_TM_Vitals> vitalsList = vitalsService.getVitalsByIPDId(ipdId);
        return vitalsList.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(vitalsList);
    }

    @GetMapping("/{vitalsId}")
    public ResponseEntity<HMS_TM_Vitals> getVitalsById(@PathVariable String vitalsId) {
        HMS_TM_Vitals vitals = vitalsService.getVitalsById(vitalsId);
        if (vitals != null) {
            return ResponseEntity.ok(vitals);
        } else {
            return ResponseEntity.notFound().build();
        }
    }



}

