package com.hms.services.opdmanagement.controller;


import com.hms.services.opdmanagement.entity.HMS_TM_OPDMedication;
import com.hms.services.opdmanagement.model.DosageDTO;
import com.hms.services.opdmanagement.model.MedicationDTO;
import com.hms.services.opdmanagement.response.ApiResponse;
import com.hms.services.opdmanagement.service.OPDMedicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/opd-medications")
public class OPDMedicationController {

    private final OPDMedicationService opdMedicationService;

    @Autowired
    public OPDMedicationController(OPDMedicationService opdMedicationService) {
        this.opdMedicationService = opdMedicationService;
    }

    // Create or update medication
    @PostMapping("/add")
    public ResponseEntity<ApiResponse> saveOrUpdate(@Valid @RequestBody MedicationDTO medication) {
        return ResponseEntity.ok(opdMedicationService.saveOrUpdate(medication));
    }

    // Get all active medications
    @GetMapping("/all")
    public ResponseEntity<List<HMS_TM_OPDMedication>> getAllActiveMedications() {
        return ResponseEntity.ok(opdMedicationService.getAllActiveMedications());
    }

    // Get medication by ID
    @GetMapping("/{medicationId}")
    public ResponseEntity<HMS_TM_OPDMedication> getMedicationById(@PathVariable String medicationId) {
        return ResponseEntity.ok(opdMedicationService.getMedicationById(medicationId));
    }

    @GetMapping("/opd/{opdId}")
    public ResponseEntity<List<MedicationDTO>> getMedicationsByOpdId(@PathVariable String opdId) {
        List<MedicationDTO> medicationDTOList = opdMedicationService.getMedicationsByOpdId(opdId);
        return ResponseEntity.ok(medicationDTOList);
    }

    // Soft delete medication by ID
    @DeleteMapping("/{medicationId}")
    public ResponseEntity<String> softDeleteMedication(@PathVariable String medicationId) {
        opdMedicationService.softDeleteMedication(medicationId);
        return ResponseEntity.ok("Medication with ID " + medicationId + " has been soft deleted.");
    }

    // Soft delete dosage by dosageId
    @DeleteMapping("/dosage/{dosageId}")
    public ResponseEntity<String> softDeleteDosage(@PathVariable String dosageId) {
        opdMedicationService.softDeleteDosage(dosageId);
        return ResponseEntity.ok("Dosage with ID " + dosageId + " has been soft deleted.");
    }
    @PostMapping("/{medicationId}/dosages")
    public ResponseEntity<ApiResponse> addDosage(@PathVariable String medicationId, @Valid @RequestBody DosageDTO dosageDto) {
        ApiResponse response = opdMedicationService.addDosageToMedication(medicationId, dosageDto);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update/{medicationId}/{dosageId}")
    public ResponseEntity<ApiResponse> updateMedicationAndDosage(
            @Valid @RequestBody MedicationDTO medicationDto,
            @PathVariable String medicationId,
            @PathVariable String dosageId) {
        ApiResponse response = opdMedicationService.updateMedicationAndDosage(medicationDto, medicationId, dosageId);
        return new ResponseEntity<>(response, HttpStatus.OK);

    }



}

