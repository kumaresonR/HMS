package com.hms.services.ipdmanagement.controller;


import com.hms.services.ipdmanagement.model.PrescriptionDetailsDTO;
import com.hms.services.ipdmanagement.service.PrescriptionDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/prescription-details")
public class IPDPrescriptionDetailsController {

    private final PrescriptionDetailsService prescriptionDetailsService;

    @Autowired
    public IPDPrescriptionDetailsController(PrescriptionDetailsService prescriptionDetailsService) {
        this.prescriptionDetailsService = prescriptionDetailsService;
    }

    // Create Prescription Detail
    @PostMapping("/add")
    public ResponseEntity<PrescriptionDetailsDTO> createPrescriptionDetail(@Valid @RequestBody PrescriptionDetailsDTO prescriptionDetailsDTO) {
        PrescriptionDetailsDTO createdDetail = prescriptionDetailsService.createPrescriptionDetail(prescriptionDetailsDTO);
        return new ResponseEntity<>(createdDetail, HttpStatus.CREATED);
    }

    // Get Prescription Detail by ID
    @GetMapping("/{id}")
    public ResponseEntity<PrescriptionDetailsDTO> getPrescriptionDetailById(@PathVariable String id) {
        PrescriptionDetailsDTO detail = prescriptionDetailsService.getPrescriptionDetailById(id);
        return new ResponseEntity<>(detail, HttpStatus.OK);
    }

    // Get All Prescription Details by Prescription ID
    @GetMapping("/prescription/{prescriptionId}")
    public ResponseEntity<List<PrescriptionDetailsDTO>> getPrescriptionDetailsByPrescriptionId(@PathVariable String prescriptionId) {
        List<PrescriptionDetailsDTO> details = prescriptionDetailsService.getPrescriptionDetailsByPrescriptionId(prescriptionId);
        return new ResponseEntity<>(details, HttpStatus.OK);
    }

    // Update Prescription Detail
    @PutMapping("/update/{id}")
    public ResponseEntity<Void> updatePrescriptionDetail(@PathVariable String id, @Valid @RequestBody PrescriptionDetailsDTO prescriptionDetailsDTO) {
        prescriptionDetailsService.updatePrescriptionDetail(id, prescriptionDetailsDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // Delete (Soft Delete) Prescription Detail
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deletePrescriptionDetail(@PathVariable String id) {
        prescriptionDetailsService.deletePrescriptionDetail(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // Get Prescription Detail by ID
    @GetMapping("/ipd/{ipdId}")
    public ResponseEntity<List<PrescriptionDetailsDTO>> getPrescriptionDetailByIpdId(@PathVariable("ipdId") String id) {
        List<PrescriptionDetailsDTO> detail = prescriptionDetailsService.getPrescriptionDetailByIpdId(id);
        return new ResponseEntity<>(detail, HttpStatus.OK);
    }

}

