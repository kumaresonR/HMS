package com.hms.services.adminmanagement.configuration;


import com.hms.services.adminmanagement.model.EmployeeLoginDTO;
import com.hms.services.adminmanagement.model.SignInResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

//@FeignClient(name = "login-management-services",url = "${login-management-services.url}")
@FeignClient(name = "login-management-services")
public interface LoginManagementInterface {

    @PostMapping(value = "/api/auth/create")
    ResponseEntity<String> saveEmployee(@RequestBody EmployeeLoginDTO employeeDTO);

    @GetMapping(value = "/api/auth/token-info/{accessToken}")
    public ResponseEntity<SignInResponse> getTokenInfo(@PathVariable String accessToken);

}


