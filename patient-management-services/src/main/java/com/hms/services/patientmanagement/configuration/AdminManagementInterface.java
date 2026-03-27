package com.hms.services.patientmanagement.configuration;



import com.hms.services.patientmanagement.model.EmployeeDetails;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

//@FeignClient(name = "admin-management-services",url = "${admin-management-services.url}")
@FeignClient(name = "admin-management-services")
public interface AdminManagementInterface {
    @GetMapping("/employees/{id}")
    public ResponseEntity<EmployeeDetails> getEmployeeById(@PathVariable String id);
}

