package com.hms.services.ambulancemanagement.configuration;


import com.hms.services.ambulancemanagement.model.SignInResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "login-management-services",url = "${login-management-services.url:http://localhost:8099}")
//@FeignClient(name = "login-management-services")
public interface LoginInterface {

    @GetMapping(value = "/api/auth/token-info/{accessToken}")
    public ResponseEntity<SignInResponse> getTokenInfo(@PathVariable String accessToken);
}


