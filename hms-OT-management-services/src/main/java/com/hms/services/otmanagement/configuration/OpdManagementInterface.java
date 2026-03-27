package com.hms.services.otmanagement.configuration;


import com.hms.services.otmanagement.model.IPDOperationDTO;
import com.hms.services.otmanagement.model.OPDOperationDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name="opd-management-services")
//@FeignClient(name="opd-management-services",url = "${opd-management-services.url}")
public interface OpdManagementInterface {

    @GetMapping("/opd-operation/searchByDate")
    public List<OPDOperationDTO> searchByDate(@RequestParam String date,@RequestParam String status);
    @PutMapping("/opd-operation/update/{id}")
    public ResponseEntity<String> updateOperationById(@PathVariable String id, @RequestBody IPDOperationDTO operation);
    @PutMapping("/opd-operation/updateStatus/{id}")
    public ResponseEntity<String> updateOperationStatusById(@PathVariable String id,@RequestParam String status);
}

