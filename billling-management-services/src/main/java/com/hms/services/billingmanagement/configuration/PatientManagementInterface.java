package com.hms.services.billingmanagement.configuration;


import com.hms.services.billingmanagement.model.PatientsDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "patient-management-services")
public interface PatientManagementInterface {

    @GetMapping("/patients/{patientId}")
    public ResponseEntity<PatientsDTO> getPatientById(@PathVariable("patientId") String id);
}



