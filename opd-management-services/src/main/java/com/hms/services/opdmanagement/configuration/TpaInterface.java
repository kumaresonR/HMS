package com.hms.services.opdmanagement.configuration;


import com.hms.services.opdmanagement.model.TPADetailsDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@FeignClient(name="tpa-management-services")
//@FeignClient(name ="tpa-management-services",url = "${tpa-management-services.url}")
public interface TpaInterface {

    @GetMapping("/tpa-details/{id}")
    public ResponseEntity<TPADetailsDTO> getTpaDetailsById(@PathVariable String id);
}

