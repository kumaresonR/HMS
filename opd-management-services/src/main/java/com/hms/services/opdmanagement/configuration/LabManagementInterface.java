package com.hms.services.opdmanagement.configuration;

import com.hms.services.opdmanagement.model.PathologyTestDetailsDTO;
import com.hms.services.opdmanagement.model.RadiologyTestDetailsDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name="billing-management-services")
//@FeignClient(name="billing-management-services",url = "${billing-management-services.url}")
public interface LabManagementInterface {

    @GetMapping("/pathology-bills/pathology-tests")
    ResponseEntity<List<PathologyTestDetailsDTO>> getPathologyTestsByIds(@RequestParam List<String> ids,@RequestParam String prescriptionNo) ;
    @GetMapping("/radiology-bills/radiology-tests")
    ResponseEntity<List<RadiologyTestDetailsDTO>> getRadiologyTestsByIds(@RequestParam List<String> ids,@RequestParam String prescriptionNo);
}

