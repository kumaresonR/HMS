package com.hms.services.patientmanagement.configuration;

import com.hms.services.patientmanagement.model.TPADetailsDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

//@FeignClient(name ="tpa-management-services",url = "${tpa-management-services.url}")
@FeignClient(name ="tpa-management-services")
public interface TpaManagementInterface {

    @GetMapping("/tpa-details/{id}")
    public ResponseEntity<TPADetailsDTO> getTpaDetailsById(@PathVariable String id);
}

