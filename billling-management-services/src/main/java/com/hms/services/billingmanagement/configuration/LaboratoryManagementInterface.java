package com.hms.services.billingmanagement.configuration;

import com.hms.services.billingmanagement.model.PathologyTestDetailsDTO;
import com.hms.services.billingmanagement.model.RadiologyTestDetailsDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient("laboratory-management-services")
public interface LaboratoryManagementInterface {
    @GetMapping("/pathology-tests/{Id}")
    public ResponseEntity<PathologyTestDetailsDTO> getLabTestById(@PathVariable String Id);

    @GetMapping("/radiology-tests/{Id}")
    public ResponseEntity<RadiologyTestDetailsDTO> getRadiologyTestById(@PathVariable String Id);

}


