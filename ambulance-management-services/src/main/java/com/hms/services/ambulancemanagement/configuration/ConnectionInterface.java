package com.hms.services.ambulancemanagement.configuration;

import com.hms.services.ambulancemanagement.model.PatientsDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name="patient-management-services",url = "${patient-management-services.url:http://localhost:8083}")
//@FeignClient(name="patient-management-services")
public interface ConnectionInterface {

    @GetMapping("/patients/{patientId}")
    public ResponseEntity<PatientsDTO> getPatientById(@PathVariable("patientId") String id);
}


