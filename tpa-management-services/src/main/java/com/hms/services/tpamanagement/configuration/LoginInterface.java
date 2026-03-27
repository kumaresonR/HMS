package com.hms.services.tpamanagement.configuration;

import com.hms.services.tpamanagement.model.SignInResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(name = "login-management-services")
public interface LoginInterface {

    @GetMapping(value = "/api/auth/token-info/{accessToken}")
    public ResponseEntity<SignInResponse> getTokenInfo(@PathVariable String accessToken);
}

