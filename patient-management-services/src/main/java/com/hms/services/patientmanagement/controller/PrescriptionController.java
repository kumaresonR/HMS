package com.hms.services.patientmanagement.controller;


import com.hms.services.patientmanagement.model.PrescriptionDTO;
import com.hms.services.patientmanagement.response.ApiResponse;
import com.hms.services.patientmanagement.service.PrescriptionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/prescriptions")
public class PrescriptionController{

    private final PrescriptionService prescriptionService;

    @Autowired
    public PrescriptionController(final PrescriptionService prescriptionService) {
        this.prescriptionService = prescriptionService;
    }


    @PostMapping("/add")
    public ResponseEntity<ApiResponse> createPrescription(@RequestBody @Valid PrescriptionDTO prescription) {
        ApiResponse createPrescription =prescriptionService.createPrescription(prescription);
        return ResponseEntity.status(HttpStatus.CREATED).body(createPrescription);
    }

    @DeleteMapping("/delete/{prescriptionId}")
    public ResponseEntity<ApiResponse> deletePrescriptionById(@PathVariable("prescriptionId") String id) {
        ApiResponse prescription =prescriptionService.deletePrescriptionById(id);
        return ResponseEntity.ok(prescription);
    }

    @GetMapping("/all")
    public ResponseEntity<List<PrescriptionDTO>> getAllPrescriptions(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size
    ) {
        List<PrescriptionDTO> listOfPrescription = prescriptionService.getAllPrescriptions(page,size);
        return ResponseEntity.ok(listOfPrescription);
    }

//    @GetMapping("/{patientId}")
//    public ResponseEntity<PrescriptionDTO> getPrescriptionById(@PathVariable("patientId") String id) {
//        return null;
//    }

    @GetMapping("/filterPrescription")
    public ResponseEntity<List<PrescriptionDTO>> getIndividualAppointments(
            @RequestParam(required = false) String patientId,
            @RequestParam (required = false) String datePrescribed,
            @RequestParam(required = false) String doctorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<PrescriptionDTO> patient = prescriptionService.filterPrescription(patientId, datePrescribed, doctorId, page,size);
        if (patient != null) {
            return ResponseEntity.ok(patient);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/update/{prescriptionId}")
    public ResponseEntity<PrescriptionDTO> updatePrescriptionById(@PathVariable("prescriptionId") String id, @RequestBody @Valid PrescriptionDTO prescription) {
        PrescriptionDTO patientPrescription=prescriptionService.updatePrescription(id,prescription);
        return ResponseEntity.ok(patientPrescription);
    }



}

