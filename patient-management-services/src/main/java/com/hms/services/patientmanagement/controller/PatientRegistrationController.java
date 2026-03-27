package com.hms.services.patientmanagement.controller;

import com.hms.services.patientmanagement.entity.HMS_TM_Patients;
import com.hms.services.patientmanagement.model.PatientsDTO;
import com.hms.services.patientmanagement.model.SearchPatientDTO;
import com.hms.services.patientmanagement.response.ApiResponse;
import com.hms.services.patientmanagement.service.PatientRegistrationService;
import jakarta.validation.Valid;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/patients")
public class PatientRegistrationController{


    private final PatientRegistrationService patientRegistrationService;

    @Autowired
    public PatientRegistrationController(final PatientRegistrationService patientRegistrationService) {
        this.patientRegistrationService = patientRegistrationService;
    }


    @PostMapping("/add")
    public ResponseEntity<ApiResponse> createPatient(@RequestBody @Valid PatientsDTO patientsDTO) {
        ApiResponse registeredPatient = patientRegistrationService.registerPatient(patientsDTO);
        return ResponseEntity.ok(registeredPatient);
    }


    @DeleteMapping("delete/{patientId}")
    public ResponseEntity<ApiResponse> deletePatientById(@PathVariable("patientId") String id) {
        ApiResponse deletedPatient = patientRegistrationService.deletePatient(id);
        return ResponseEntity.ok(deletedPatient);
    }


    @GetMapping("/all")
    public ResponseEntity<List<PatientsDTO>> getAllPatients(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size
    ) {
        List<PatientsDTO> listOfPatient = patientRegistrationService.getAllPatients(page,size);
        return ResponseEntity.ok(listOfPatient);
    }


    @GetMapping("/{patientId}")
    public ResponseEntity<PatientsDTO> getPatientById(@PathVariable("patientId") String id) {
        PatientsDTO patientDto=patientRegistrationService.getPatientById(id);
        return ResponseEntity.ok(patientDto);
    }


    @PutMapping("update/{id}")
    public ResponseEntity<JSONObject> updatePatientById(@PathVariable("id") String id, @Valid @RequestBody PatientsDTO patientInfo) {
        JSONObject patientDto=patientRegistrationService.updatePatientById(id,patientInfo);
        return ResponseEntity.ok(patientDto);
    }

    @GetMapping("/individualPatient")
    public ResponseEntity<List<PatientsDTO>> getIndividualPatient(
            @RequestParam(required = false) String patientId,
            @RequestParam(required = false) String dateOfBirth,
            @RequestParam(required = false) String contactNumber,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) String lastName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<PatientsDTO> patient = patientRegistrationService.getIndividualPatient(patientId, dateOfBirth, contactNumber, email,firstName,lastName,page,size);
        if (patient != null) {
            return ResponseEntity.ok(patient);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @PostMapping("/getPatientData")
    public ResponseEntity<List<SearchPatientDTO>>  getPatientList(@RequestParam String searchTerm) {
        List<SearchPatientDTO> patients = patientRegistrationService.getPatientsBySearchTerm(searchTerm);
        return ResponseEntity.ok(patients);
    }

    @PostMapping("/getPatientData/Ids")
    public ResponseEntity<List<PatientsDTO>>  getPatientListByIds(@RequestParam List<String> patientIds) {
        List<PatientsDTO> patients = patientRegistrationService.getPatientsByPatientIds(patientIds);
        return ResponseEntity.ok(patients);
    }

    @GetMapping("/getPatientData/searchTerm")
    public ResponseEntity<List<PatientsDTO>>  getPatientListBySearchTerm(@RequestParam String searchTerm) {
        List<PatientsDTO> patients = patientRegistrationService.getPatientsBySearch(searchTerm);
        return ResponseEntity.ok(patients);
    }

    @PatchMapping(value = "/old-prescription/{id}")
    public ResponseEntity<String> uploadOldPrescription(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file) throws IOException {
        String uploaded=patientRegistrationService.storePrescription(id,file);
        return ResponseEntity.ok(uploaded);
    }



}

