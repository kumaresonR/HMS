package com.hms.services.ipdmanagement.controller;



import com.hms.services.ipdmanagement.entity.HMS_TM_IPDMedication;
import com.hms.services.ipdmanagement.model.DosageDTO;
import com.hms.services.ipdmanagement.model.MedicationDTO;
import com.hms.services.ipdmanagement.response.ApiResponse;
import com.hms.services.ipdmanagement.service.IPDMedicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ipd-medications")
public class IPDMedicationController {

    private final IPDMedicationService ipdMedicationService;

    @Autowired
    public IPDMedicationController(IPDMedicationService ipdMedicationService) {
        this.ipdMedicationService = ipdMedicationService;
    }

    // Create or update medication
    @PostMapping("/add")
    public ResponseEntity<ApiResponse> saveOrUpdate(@RequestBody MedicationDTO medication) {
        return ResponseEntity.ok(ipdMedicationService.saveOrUpdate(medication));
    }

    // Get all active medications
    @GetMapping
    public ResponseEntity<List<HMS_TM_IPDMedication>> getAllActiveMedications() {
        return ResponseEntity.ok(ipdMedicationService.getAllActiveMedications());
    }

    // Get medication by ID
    @GetMapping("/{medicationId}")
    public ResponseEntity<HMS_TM_IPDMedication> getMedicationById(@PathVariable String medicationId) {
        return ResponseEntity.ok(ipdMedicationService.getMedicationById(medicationId));
    }

    // Get medications by OPD ID
    @GetMapping("/ipd/{ipdId}")
    public ResponseEntity<List<MedicationDTO>> getMedicationsByOpdId(@PathVariable String ipdId) {
        return ResponseEntity.ok(ipdMedicationService.getMedicationsByOpdId(ipdId));
    }

    // Soft delete medication by ID
    @DeleteMapping("/{medicationId}")
    public ResponseEntity<String> softDeleteMedication(@PathVariable String medicationId) {
        ipdMedicationService.softDeleteMedication(medicationId);
        return ResponseEntity.ok("Medication with ID " + medicationId + " has been soft deleted.");
    }

    // Soft delete dosage by dosageId
    @DeleteMapping("/dosage/{dosageId}")
    public ResponseEntity<String> softDeleteDosage(@PathVariable String dosageId) {
        ipdMedicationService.softDeleteDosage(dosageId);
        return ResponseEntity.ok("Dosage with ID " + dosageId + " has been soft deleted.");
    }
    @PostMapping("/{medicationId}/dosages")
    public ResponseEntity<ApiResponse> addDosage(@PathVariable String medicationId, @RequestBody DosageDTO dosageDto) {
        ApiResponse response = ipdMedicationService.addDosageToMedication(medicationId, dosageDto);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update/{medicationId}/{dosageId}")
    public ResponseEntity<ApiResponse> updateMedicationAndDosage(
            @RequestBody MedicationDTO medicationDto,
            @PathVariable String medicationId,
            @PathVariable String dosageId) {
        ApiResponse response = ipdMedicationService.updateMedicationAndDosage(medicationDto, medicationId, dosageId);
        return new ResponseEntity<>(response, HttpStatus.OK);

    }


}

