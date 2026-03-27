package com.hms.services.adminmanagement.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.services.adminmanagement.entity.HMS_TM_PatientIDCard;
import com.hms.services.adminmanagement.service.PatientIDCardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/patient-id-card")
public class PatientIDCardController  {

    private final PatientIDCardService patientIDCardService;
    private final ObjectMapper objectMapper;

    @Autowired
    public PatientIDCardController(PatientIDCardService patientIDCardService, ObjectMapper objectMapper) {
        this.patientIDCardService = patientIDCardService;
        this.objectMapper = objectMapper;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createPatientIDCard(
            @RequestPart("patientData") String patientDataJson,
            @RequestPart(value = "backgroundImage", required = false) MultipartFile backgroundImageFile,
            @RequestPart(value = "logo", required = false) MultipartFile logoFile,
            @RequestPart(value = "signature", required = false) MultipartFile signatureFile) {
        try {
            HMS_TM_PatientIDCard patientIDCard = objectMapper.readValue(patientDataJson, HMS_TM_PatientIDCard.class);
            HMS_TM_PatientIDCard savedPatientIDCard = patientIDCardService.savePatientIDCard(patientIDCard, backgroundImageFile, logoFile, signatureFile);
            return new ResponseEntity<>(savedPatientIDCard, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>("Error processing request. Please check the request format.", HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updatePatientIDCard(
            @PathVariable String id,
            @RequestPart("patientData") String patientDataJson,
            @RequestPart(value = "backgroundImage", required = false) MultipartFile backgroundImageFile,
            @RequestPart(value = "logo", required = false) MultipartFile logoFile,
            @RequestPart(value = "signature", required = false) MultipartFile signatureFile) {

        try {
            HMS_TM_PatientIDCard patientIDCard = objectMapper.readValue(patientDataJson, HMS_TM_PatientIDCard.class);
            HMS_TM_PatientIDCard updatedPatientIDCard = patientIDCardService.updatePatientIDCard(id, patientIDCard, backgroundImageFile, logoFile, signatureFile);
            return new ResponseEntity<>(updatedPatientIDCard, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>("Error processing request. Please check the request format.", HttpStatus.BAD_REQUEST);
        }
    }

    // 3. Get All API
    @GetMapping("/all")
    public ResponseEntity<List<HMS_TM_PatientIDCard>> getAllPatientIDCards() {
        List<HMS_TM_PatientIDCard> patientIDCards = patientIDCardService.getAllPatientIDCards();
        return new ResponseEntity<>(patientIDCards, HttpStatus.OK);
    }

    // 4. Get By ID API
    @GetMapping("/{id}")
    public ResponseEntity<?> getPatientIDCardById(@PathVariable String id) {
        HMS_TM_PatientIDCard patientIDCard = patientIDCardService.getPatientIDCardById(id);
        return ResponseEntity.ok(patientIDCard);
    }

    // 5. Soft Delete API
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> softDeletePatientIDCard(@PathVariable String id) {
        patientIDCardService.softDeletePatientIDCard(id);
        return new ResponseEntity<>("Patient ID Card soft deleted successfully", HttpStatus.OK);
    }


}



