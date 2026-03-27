package com.hms.services.frontofficemanagement.configuration;



import com.hms.services.frontofficemanagement.model.SignInResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.cloud.openfeign.FeignClient;

@FeignClient(name = "login-management-services",url = "${login-management-services.url:http://localhost:8099}")
public interface LoginInterface {

    @GetMapping(value = "/api/auth/token-info/{accessToken}")
    public ResponseEntity<SignInResponse> getTokenInfo(@PathVariable String accessToken);
}


