package com.hms.services.ipdmanagement.controller;

import com.hms.services.ipdmanagement.configuration.OpdManagementInterface;
import com.hms.services.ipdmanagement.model.*;
import com.hms.services.ipdmanagement.response.ApiResponse;
import com.hms.services.ipdmanagement.service.IPDAdmissionsService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/ipd-admissions")
public class IPDAdmissionController {

    private final IPDAdmissionsService ipdAdmissionsService;
    private final OpdManagementInterface opdManagementInterface;

    @Autowired
    public IPDAdmissionController(IPDAdmissionsService ipdAdmissionsService,final OpdManagementInterface opdManagementInterface) {
        this.ipdAdmissionsService = ipdAdmissionsService;
        this.opdManagementInterface = opdManagementInterface;
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> createAdmission(@RequestBody IPDAdmissionsDTO ipdAdmissionsDTO) {
        ApiResponse response = ipdAdmissionsService.createAdmission(ipdAdmissionsDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<List<IPDAdmissionsDetailsDTO>> getAllAdmissions(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        List<IPDAdmissionsDetailsDTO> admissions = ipdAdmissionsService.getAllAdmissions(page, size);
        return ResponseEntity.ok(admissions);
    }

    @GetMapping("/discharge/all")
    public ResponseEntity<List<IPDAdmissionsDetailsDTO>> getAllDischarge(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        List<IPDAdmissionsDetailsDTO> admissions = ipdAdmissionsService.getAllDischarge(page, size);
        return ResponseEntity.ok(admissions);
    }


    @GetMapping("/ipd_patient_search/all")
    public ResponseEntity<List<IPDAdmissionsDetailsDTO>> searchAdmissions(@RequestParam("searchTerm") String searchTerm) {
        List<IPDAdmissionsDetailsDTO> results = ipdAdmissionsService.searchAdmissions(searchTerm);
        if (results.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(results);
    }

    @GetMapping("/discharge/ipd_patient_search")
    public ResponseEntity<List<IPDAdmissionsDetailsDTO>> searchDischargedPatients(@RequestParam String searchTerm) {
        List<IPDAdmissionsDetailsDTO> admissions = ipdAdmissionsService.searchDischargedPatients(searchTerm);
        return ResponseEntity.ok(admissions);
    }

    @GetMapping("/{ipdId}")
    public ResponseEntity<IPDAdmissionsDTO> getAdmissionById(@PathVariable("ipdId") String ipdId) {
        IPDAdmissionsDTO admissionDTO = ipdAdmissionsService.getAdmissionById(ipdId);
        return ResponseEntity.ok(admissionDTO);
    }

    @GetMapping("/search")
    public ResponseEntity<IPDAdmissionsDTO> getAdmissionByIpdIdOrPatientId(
            @RequestParam(value = "ipdId", required = false) String ipdId,
            @RequestParam(value = "patientId", required = false) String patientId) {

        IPDAdmissionsDTO admissionDTO;
        if (ipdId != null && patientId != null) {
            admissionDTO = ipdAdmissionsService.getAdmissionByIpdIdAndPatientId(ipdId, patientId);
        }
        else if (ipdId != null) {
            admissionDTO = ipdAdmissionsService.getAdmissionByIpdId(ipdId);
        }
        else if (patientId != null) {
            admissionDTO = ipdAdmissionsService.getAdmissionByPatientId(patientId);
        }
        else {
            return ResponseEntity.badRequest().build();
        }
        if (admissionDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(admissionDTO);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse> updateAdmissionById(@PathVariable String id, @RequestBody IPDAdmissionsDTO ipdAdmissionsDTO) {
        ApiResponse response = ipdAdmissionsService.updateAdmissionById(id, ipdAdmissionsDTO);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse> deleteAdmissionById(@PathVariable String id) {
        ApiResponse response = ipdAdmissionsService.deleteAdmissionById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/combined_details/{ipdId}")
    public ResponseEntity<IPDCombinedDTO> getAdmissionCombinedById(@PathVariable("ipdId") String ipdId) {
        IPDCombinedDTO admissionDTO = ipdAdmissionsService.getAdmissionCombinedById(ipdId);
        return ResponseEntity.ok(admissionDTO);
    }

    @PatchMapping("/update_discharge/{id}")
    public ResponseEntity<JSONObject> patchUpdateAdmissionById(@PathVariable String id,
                                                               @RequestPart("dischargeDetailsDTO")DischargeDetailsDTO dischargeDetailsDTO,
                                                               @RequestPart(value ="file", required = false) MultipartFile file) {
        JSONObject response = ipdAdmissionsService.patchUpdateDischargeDetails(id, dischargeDetailsDTO,file);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/getprescription/{patientId}")
    public ResponseEntity<List<SearchPrescriptionDTO>>  getPatientPrescriptionList(@PathVariable("patientId") String id) {
        List<SearchPrescriptionDTO> patients = ipdAdmissionsService.getPatientsPrescriptionBySearchTerm(id);
        return ResponseEntity.ok(patients);
    }

    @GetMapping("/check-patient-admission")
    public boolean checkPatientAdmission(@RequestParam("patientId") String patientId,
                                         @RequestParam("currentDate") LocalDateTime currentDate) {
        return ipdAdmissionsService.existsByPatientIdAndIsActiveTrueAndDischargeDateAfter(patientId, currentDate);
    }
    @GetMapping("/active-ipdOrOpd/{patientId}")
    public JSONObject getActiveIpdId(@PathVariable String patientId) {
        String ipdId = ipdAdmissionsService.getActiveIpdIdByPatientId(patientId);
        String opdId = opdManagementInterface.getActiveOpdId(patientId);
        JSONObject response = new JSONObject();
        if (ipdId != null) {
            response.put("id", ipdId);
            response.put("type", "IPD");
        } else if (opdId != null) {
            response.put("id", opdId);
            response.put("type", "OPD");
        }
        return response;
    }

    @GetMapping("/active-patient/{opdOrIpdId}")
    public JSONObject getActivePatient(@PathVariable String opdOrIpdId) {
        if(opdOrIpdId.startsWith("IPD")) {
            IPDCombinedDTO ipdId = ipdAdmissionsService.getActivePatientIdByIpdId(opdOrIpdId);
            JSONObject response = new JSONObject();
            response.put("ipdId", ipdId.getAdmissions().getIpdId());
            response.put("patientName", ipdId.getPatient().getFirstName() + " " + ipdId.getPatient().getLastName());
            return response;
        }else {
            OPDCombinedDTO opdId = opdManagementInterface.getActivePatient(opdOrIpdId);
            JSONObject response = new JSONObject();
            response.put("opdId", opdId.getAdmissions().getOpdId());
            response.put("patientName", opdId.getPatient().getFirstName() + " " + opdId.getPatient().getLastName());
            return response;
        }
    }

    @GetMapping("/death-patient/{opdOrIpdId}")
    public JSONObject getDeathPatient(@PathVariable String opdOrIpdId) {
        if(opdOrIpdId.startsWith("IPD")) {
            IPDCombinedDTO ipdId = ipdAdmissionsService.getDeathPatientIdByIpdId(opdOrIpdId);
            JSONObject response = new JSONObject();
            response.put("ipdId", ipdId.getAdmissions().getIpdId());
            response.put("patientName", ipdId.getPatient().getFirstName() + " " + ipdId.getPatient().getLastName());
            return response;
        }else {
            OPDCombinedDTO opdId = opdManagementInterface.getDeathPatient(opdOrIpdId);
            JSONObject response = new JSONObject();
            response.put("opdId", opdId.getAdmissions().getOpdId());
            response.put("patientName", opdId.getPatient().getFirstName() + " " + opdId.getPatient().getLastName());
            return response;
        }
    }

    @GetMapping("/antenatal-patient/{opdOrIpdId}")
    public JSONObject getAntenatalPatient(@PathVariable String opdOrIpdId) {
        if(opdOrIpdId.startsWith("IPD")) {
            IPDCombinedDTO ipdId = ipdAdmissionsService.getAntenatalPatientIdByIpdId(opdOrIpdId);
            JSONObject response = new JSONObject();
            response.put("ipdId", ipdId.getAdmissions().getIpdId());
            response.put("patientName", ipdId.getPatient().getFirstName() + " " + ipdId.getPatient().getLastName());
            return response;
        }else {
            OPDCombinedDTO opdId = opdManagementInterface.getAntenatalPatient(opdOrIpdId);
            JSONObject response = new JSONObject();
            response.put("opdId", opdId.getAdmissions().getOpdId());
            response.put("patientName", opdId.getPatient().getFirstName() + " " + opdId.getPatient().getLastName());
            return response;
        }
    }

    @GetMapping("/all/ipd-details")
    public ResponseEntity<List<IPDTPACombinedDTO>> getAllIPDDetailsWithPatientAndTPA() {
        List<IPDTPACombinedDTO> combinedDTOList = ipdAdmissionsService.getAllIPDDetailsWithPatientAndTPA();
        return ResponseEntity.ok(combinedDTOList);
    }

    @GetMapping("/ipd-details/{admissionId}")
    public ResponseEntity<IPDTPACombinedDTO> getIPDDetailsByAdmissionId(@PathVariable String admissionId) {
        IPDTPACombinedDTO combinedDTO = ipdAdmissionsService.getIPDDetailsByAdmissionId(admissionId);
        return ResponseEntity.ok(combinedDTO);
    }

}

