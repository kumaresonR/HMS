package com.hms.services.opdmanagement.configuration;


import com.hms.services.opdmanagement.model.OPDCombinedDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name="admin-management-services")
//@FeignClient(name="admin-management-services",url = "${admin-management-services.url}")
public interface AdminManagementInterface {
    @GetMapping("/employees/{id}")
    public ResponseEntity<com.hms.services.opdmanagement.model.EmployeeDetails> getEmployeeById(@PathVariable String id);
    @GetMapping("/charges/master-table/{chargeId}")
    public ResponseEntity<OPDCombinedDTO.CombinedCharges> getAllByChargeId(@PathVariable("chargeId") String chargeId, @RequestParam(value = "insuranceId", required = false) String insuranceId);

}

