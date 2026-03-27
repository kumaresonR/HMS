package com.hms.services.ipdmanagement.controller;


import com.hms.services.ipdmanagement.model.PrescriptionDTO;
import com.hms.services.ipdmanagement.service.PrescriptionService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/ipd-prescription")
public class IPDPrescriptionController {

    private final PrescriptionService prescriptionService;

    @Autowired
    public IPDPrescriptionController(PrescriptionService prescriptionService) {
        this.prescriptionService = prescriptionService;
    }

    // Create a prescription
    @PostMapping("/add")
    public ResponseEntity<JSONObject> createPrescription(@RequestPart("prescriptionDTO") PrescriptionDTO prescriptionDTO,
                                                         @RequestPart(value ="file", required = false) MultipartFile file) {
        JSONObject prescription = prescriptionService.createPrescription(prescriptionDTO, file);
        return new ResponseEntity<>(prescription, HttpStatus.CREATED);
    }

    // Get all prescriptions
    @GetMapping("/all")
    public ResponseEntity<List<PrescriptionDTO>> getAllPrescriptions() {
        List<PrescriptionDTO> prescriptions = prescriptionService.getAllPrescriptions();
        return new ResponseEntity<>(prescriptions, HttpStatus.OK);
    }

    // Get prescription by ID
    @GetMapping("/{id}")
    public ResponseEntity<PrescriptionDTO> getPrescriptionById(@PathVariable String id) {
        PrescriptionDTO prescription = prescriptionService.getPrescriptionById(id);
        return new ResponseEntity<>(prescription, HttpStatus.OK);
    }

    // Update a prescription by ID
    @PutMapping("/update/{id}")
    public ResponseEntity<JSONObject> updatePrescription(@PathVariable String id, @RequestPart("prescriptionDTO") PrescriptionDTO prescriptionDTO,
                                                     @RequestPart(value ="file", required = false) MultipartFile file) {
        return new ResponseEntity<>(prescriptionService.updatePrescription(id, prescriptionDTO,file), HttpStatus.OK);
    }

    // Delete a prescription by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletePrescription(@PathVariable String id) {
        prescriptionService.deletePrescription(id);
        return new ResponseEntity<>("Prescription deleted successfully with ID: " + id, HttpStatus.OK);
    }


    // Get prescription by ID
    @GetMapping("/ipd/{ipdId}")
    public ResponseEntity<List<PrescriptionDTO>> getPrescriptionByIpdId(@PathVariable("ipdId") String id) {
        List<PrescriptionDTO> prescription = prescriptionService.getPrescriptionByIpdId(id);
        return new ResponseEntity<>(prescription, HttpStatus.OK);
    }

    // Get prescription by ID
    @GetMapping("/prescriptionNo/{prescriptionNo}")
    public ResponseEntity<List<PrescriptionDTO>> getPrescriptionByPrescriptionNo(@PathVariable("prescriptionNo") String number) {
        List<PrescriptionDTO> prescription = prescriptionService.getPrescriptionByNumberId(number);
        return new ResponseEntity<>(prescription, HttpStatus.OK);
    }

    @PostMapping("/prescriptionNo")
    public void addPrescriptionByPayment(
            @RequestParam("number") String number,
            @RequestParam(value="pharmacyPaid",required = false) Boolean pharmacyPaid,
            @RequestParam(value="pathologyPaid",required = false) Boolean pathologyPaid,
            @RequestParam(value="radiologyPaid",required = false) Boolean radiologyPaid){
        prescriptionService.addPrescriptionByPayment(number,pharmacyPaid,pathologyPaid,radiologyPaid);

    }
}

