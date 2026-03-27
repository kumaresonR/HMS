package com.hms.services.opdmanagement.configuration;


import com.hms.services.opdmanagement.model.SignInResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "login-management-services")
//@FeignClient(name = "login-management-services",url = "${login-management-services.url}")
public interface LoginInterface {

    @GetMapping(value = "/api/auth/token-info/{accessToken}")
    public ResponseEntity<SignInResponse> getTokenInfo(@PathVariable String accessToken);
}

