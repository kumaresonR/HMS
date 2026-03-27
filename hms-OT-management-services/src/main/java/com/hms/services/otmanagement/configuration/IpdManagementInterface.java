package com.hms.services.otmanagement.configuration;




import com.hms.services.otmanagement.model.IPDOperationDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name="ipd-management-services")
//@FeignClient(name="ipd-management-services",url = "${ipd-management-services.url}")
public interface IpdManagementInterface {

    @GetMapping("/ipd-operation/searchByDate")
    public List<IPDOperationDTO> searchByDate(@RequestParam String date,@RequestParam String status);
    @PutMapping("/ipd-operation/update/{id}")
    public ResponseEntity<String> updateOperationById(@PathVariable String id, @RequestBody IPDOperationDTO operation);
    @PutMapping("/ipd-operation/updateStatus/{id}")
    public ResponseEntity<String> updateOperationStatusById(@PathVariable String id,@RequestParam String status);

}

