package com.hms.services.opdmanagement.configuration;

import com.hms.services.opdmanagement.model.OPDCombinedDTO;
import com.hms.services.opdmanagement.model.SearchPatientDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name="patient-management-services")
//@FeignClient(name = "patient-management-services",url = "${patient-management-services.url}")
public interface ConnectionInterface {

    @GetMapping("/patients/{patientId}")
    public ResponseEntity<OPDCombinedDTO.PatientDTO> getPatientById(@PathVariable("patientId") String id);

//    @PostMapping("/getPatientData/Ids")
//    public ResponseEntity<List<OPDCombinedDTO.PatientDTO>>  getPatientListByIds(@RequestParam List<String> patientIds);

    @GetMapping("/patients/getPatientData/searchTerm")
    public ResponseEntity<List<OPDCombinedDTO.PatientDTO>>  getPatientListBySearchTerm(@RequestParam String searchTerm);

}

