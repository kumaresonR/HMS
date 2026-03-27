package com.hms.services.opdmanagement.controller;


import com.hms.services.opdmanagement.model.*;
import com.hms.services.opdmanagement.response.ApiResponse;
import com.hms.services.opdmanagement.service.OPDAdmissionsService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/opd-admissions")
public class OPDAdmissionController {

    private final OPDAdmissionsService opdAdmissionsService;

    @Autowired
    public OPDAdmissionController(OPDAdmissionsService opdAdmissionsService) {
        this.opdAdmissionsService = opdAdmissionsService;
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> createAdmission(@RequestBody OPDAdmissionsDTO opdAdmissionsDTO) {
        ApiResponse response = opdAdmissionsService.createAdmission(opdAdmissionsDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<List<OPDAdmissionsDetailsDTO>> getAllAdmissions(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        List<OPDAdmissionsDetailsDTO> admissions = opdAdmissionsService.getAllAdmissions(page, size);
        return ResponseEntity.ok(admissions);
    }

    @GetMapping("/discharge/all")
    public ResponseEntity<List<OPDAdmissionsDetailsDTO>> getAllDischarge(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        List<OPDAdmissionsDetailsDTO> admissions = opdAdmissionsService.getAllDischarge(page, size);
        return ResponseEntity.ok(admissions);
    }

    @GetMapping("/{opdId}")
    public ResponseEntity<OPDAdmissionsDTO> getAdmissionById(@PathVariable("opdId") String opdId) {
        OPDAdmissionsDTO admissionDTO = opdAdmissionsService.getAdmissionById(opdId);
        return ResponseEntity.ok(admissionDTO);
    }

//    @GetMapping("/search")
//    public ResponseEntity<OPDAdmissionsDTO> getAdmissionByOpdIdAndPatientId(
//            @RequestParam(value = "opdId", required = false) String opdId,
//            @RequestParam(value = "patientId", required = false) String patientId) {
//        OPDAdmissionsDTO admissionDTO;
//
//        if (opdId != null && patientId != null) {
//            admissionDTO = opdAdmissionsService.getAdmissionByOpdIdAndPatientId(opdId, patientId);
//        } else if (opdId != null) {
//            admissionDTO = opdAdmissionsService.getAdmissionByOpdId(opdId);
//        } else if (patientId != null) {
//            admissionDTO = opdAdmissionsService.getAdmissionByPatientId(patientId);
//        } else {
//            return ResponseEntity.badRequest().build();
//        }
//        if (admissionDTO == null) {
//            return ResponseEntity.notFound().build();
//        }
//        return ResponseEntity.ok(admissionDTO);
//    }


    @GetMapping("/opd_patient_search/all")
    public ResponseEntity<List<OPDAdmissionsDetailsDTO>> searchAdmissions(@RequestParam("searchTerm") String searchTerm) {
        List<OPDAdmissionsDetailsDTO> results = opdAdmissionsService.searchAdmissions(searchTerm);
        if (results.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(results);
    }

    @GetMapping("/discharge/opd_patient_search")
    public ResponseEntity<List<OPDAdmissionsDetailsDTO>> searchDischargedPatients(@RequestParam String searchTerm) {
        List<OPDAdmissionsDetailsDTO> admissions = opdAdmissionsService.searchDischargedPatients(searchTerm);
        return ResponseEntity.ok(admissions);
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse> updateAdmissionById(@PathVariable String id, @RequestBody OPDAdmissionsDTO opdAdmissionsDTO) {
        ApiResponse response = opdAdmissionsService.updateAdmissionById(id, opdAdmissionsDTO);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse> deleteAdmissionById(@PathVariable String id) {
        ApiResponse response = opdAdmissionsService.deleteAdmissionById(id);
        return ResponseEntity.ok(response);
    }
//
//    @GetMapping("/combined_details/{opdId}")
//    public ResponseEntity<OPDCombinedDTO> getAdmissionCombinedById(@PathVariable("opdId") String opdId) {
//        IPDCombinedDTO admissionDTO = opdAdmissionsService.getAdmissionCombinedById(opdId);
//        return ResponseEntity.ok(admissionDTO);
//    }

        @GetMapping("/combined_details/{opdId}")
    public ResponseEntity<OPDCombinedDTO> getAdmissionCombinedById(@PathVariable("opdId") String opdId) {
            OPDCombinedDTO admissionDTO = opdAdmissionsService.getAdmissionCombinedById(opdId);
        return ResponseEntity.ok(admissionDTO);
    }

    @PatchMapping("/update_discharge/{id}")
    public ResponseEntity<JSONObject> patchUpdateAdmissionById(@PathVariable String id,
                                                               @RequestPart("dischargeDetailsDTO")DischargeDetailsDTO dischargeDetailsDTO,
                                                               @RequestPart(value ="file", required = false) MultipartFile file) {
        JSONObject response = opdAdmissionsService.patchUpdateDischargeDetails(id, dischargeDetailsDTO, file);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/visit_details/{patientId}")
    public ResponseEntity<TotalOPDVisitDTO> getCombinedVisitDetailsById(@PathVariable("patientId") String patientId) {
        TotalOPDVisitDTO admissionDTO = opdAdmissionsService.getCombinedVisitDetailsById(patientId);
        return ResponseEntity.ok(admissionDTO);
    }

    @GetMapping("/getprescription/{patientId}")
    public ResponseEntity<List<SearchPrescriptionDTO>>  getPatientPrescriptionList(@PathVariable("patientId") String id) {
        List<SearchPrescriptionDTO> patients = opdAdmissionsService.getPatientsPrescriptionBySearchTerm(id);
        return ResponseEntity.ok(patients);
    }

    @GetMapping("/check-patient-admission")
    public boolean checkPatientAdmission(@RequestParam("patientId") String patientId,
                                         @RequestParam("currentDate") LocalDateTime currentDate) {
        return opdAdmissionsService.existsByPatientIdAndIsActiveTrueAndDischargeDateAfter(patientId, currentDate);
    }

    @GetMapping("/active-ipdOrOpd/{patientId}")
    public String getActiveOpdId(@PathVariable String patientId) {
        return opdAdmissionsService.getActiveIpdIdByPatientId(patientId);
    }

    @GetMapping("/medical-history/{patientId}")
    public Integer getMedicalHistoryOpdId(@PathVariable String patientId){
        return opdAdmissionsService.getMedicalHistoryOpdId(patientId);
    }

    @GetMapping("/active-patient/{opdOrIpdId}")
    public OPDCombinedDTO getActivePatient(@PathVariable String opdOrIpdId) {
        OPDCombinedDTO admissionDTO = opdAdmissionsService.getPatientCombinedById(opdOrIpdId);
        return admissionDTO;

    }

    @GetMapping("/death-patient/{opdOrIpdId}")
    public OPDCombinedDTO getDeathPatient(@PathVariable String opdOrIpdId) {
        OPDCombinedDTO admissionDTO = opdAdmissionsService.getDeathPatientCombinedById(opdOrIpdId);
        return admissionDTO;

    }

    @GetMapping("/antenatal-patient/{opdOrIpdId}")
    public OPDCombinedDTO getAntenatalPatient(@PathVariable String opdOrIpdId) {
        OPDCombinedDTO admissionDTO = opdAdmissionsService.getAntenatalPatientCombinedById(opdOrIpdId);
        return admissionDTO;

    }

    @GetMapping("/all/opd-details")
    public ResponseEntity<List<OPDTPACombinedDTO>> getAllOPDDetailsWithPatientAndTPA() {
        List<OPDTPACombinedDTO> combinedDTOList = opdAdmissionsService.getAllOPDDetailsWithPatientAndTPA();
        return ResponseEntity.ok(combinedDTOList);
    }

    @GetMapping("/opd-details/{admissionId}")
    public ResponseEntity<OPDTPACombinedDTO> getOPDDetailsByAdmissionId(@PathVariable String admissionId) {
        OPDTPACombinedDTO combinedDTO = opdAdmissionsService.getOPDDetailsByAdmissionId(admissionId);
        return ResponseEntity.ok(combinedDTO);
    }
}

