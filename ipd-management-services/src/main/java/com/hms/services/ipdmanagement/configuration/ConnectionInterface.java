package com.hms.services.ipdmanagement.configuration;

import com.hms.services.ipdmanagement.model.IPDCombinedDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name="patient-management-services")
//@FeignClient(name="patient-management-services",url = "${patient-management-services.url}")
public interface ConnectionInterface {

    @GetMapping("/patients/{patientId}")
    public ResponseEntity<IPDCombinedDTO.PatientDTO> getPatientById(@PathVariable("patientId") String id);

    @GetMapping("/patients/getPatientData/searchTerm")
    public ResponseEntity<List<IPDCombinedDTO.PatientDTO>>  getPatientListBySearchTerm(@RequestParam String searchTerm);

}

