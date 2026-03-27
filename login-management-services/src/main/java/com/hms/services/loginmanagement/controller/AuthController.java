package com.hms.services.loginmanagement.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.services.loginmanagement.configuration.CacheRepository;
import com.hms.services.loginmanagement.exception.CustomException;
import com.hms.services.loginmanagement.model.*;
import com.hms.services.loginmanagement.security.TokenProvider;
import com.hms.services.loginmanagement.service.AccessService;
import com.hms.services.loginmanagement.service.TokenBlacklistService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.authentication.AuthenticationManager;
import jakarta.validation.Valid;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final TokenProvider tokenProvider;
    private final AccessService accessService;
    private final TokenBlacklistService tokenBlacklistService;
    private final CacheRepository cacheRepository;
    @Value("${security.jwt.token.expire.time:3600000}")
    private long expireTime;

    public AuthController(AuthenticationManager authenticationManager, TokenProvider tokenProvider,
                          AccessService accessService,TokenBlacklistService tokenBlacklistService,CacheRepository cacheRepository) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.accessService = accessService;
        this.tokenBlacklistService = tokenBlacklistService;
        this.cacheRepository = cacheRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<SignInResponse> getEncryptedData(final @Valid @RequestBody SecurityKeys securityKeys)
            throws Exception {
        final SignInResponse response = accessService.sendEncryptedData(securityKeys.getUniqueId(),
                securityKeys.getEncryptedData());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/uniqueId")
    public ResponseEntity<JSONObject> getUniqueId(final @Valid @RequestBody SecurityKeys securityKeys) throws  JsonProcessingException {
        final String publicKey = accessService.createPublicAndPrivateKeys(securityKeys.getUniqueId());
        JSONObject obj = new JSONObject();
        obj.put("PublicKey", publicKey);
        return ResponseEntity.ok(obj);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestHeader("Authorization") String authorizationHeader,@RequestParam String refreshToken) throws JsonProcessingException {
        authorizationHeader = authorizationHeader.substring(authorizationHeader.indexOf("Bearer ")+7);
        SignInResponse tokenValue = cacheRepository.getTokenInfo(authorizationHeader);
        if(tokenValue==null){
            throw new CustomException("Invalid access token",HttpStatus.FORBIDDEN);
        }
        boolean validation = tokenProvider.validateToken(refreshToken, TokenType.REFRESH);
        if (!validation) {
            throw new CustomException("Invalid refresh token",HttpStatus.FORBIDDEN);
        }
        String userName = tokenProvider.getUsernameFromToken(refreshToken);
        String newAccessToken = tokenProvider.createToken(userName, TokenType.ACCESS);
        String newRefreshToken = tokenProvider.createToken(userName, TokenType.REFRESH);
        cacheRepository.setTokenInfo(newAccessToken,tokenValue,expireTime);
        SignInResponse response = new SignInResponse();
        response.setAccessToken(newAccessToken);
        response.setRefreshToken(newRefreshToken);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authorizationHeader) throws JsonProcessingException {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Invalid or missing Authorization header");
        }
        String token = authorizationHeader.substring(7);
        if (!tokenProvider.validateToken(token, TokenType.ACCESS)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
        cacheRepository.signOutTokenInfo(token);
        tokenBlacklistService.blacklistToken(token);
        return ResponseEntity.ok("Successfully logged out");
    }

    @GetMapping("/token-info/{accessToken}")
    public ResponseEntity<SignInResponse> getTokenInfo(@PathVariable String accessToken) throws JsonProcessingException {
        SignInResponse response=cacheRepository.getTokenInfo(accessToken);
        if (response == null) {
            throw new CustomException("Invalid access token",HttpStatus.FORBIDDEN);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create")
    public ResponseEntity<String> saveEmployee(@Valid @RequestBody EmployeeLoginDTO employeeDTO) throws Exception {
        accessService.saveEmployee(employeeDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body("Employee saved successfully in login-management-services.");
    }

}

























//@PostMapping("/login")
//public ResponseEntity<?> authenticateUser(@RequestParam String username, @RequestParam String password) {
//
////        // Authenticate the user
////        Authentication authentication = authenticationManager.authenticate(
////                new UsernamePasswordAuthenticationToken(username, password)
////        );
////
////        // Set authentication in context
////        SecurityContextHolder.getContext().setAuthentication(authentication);
//
//    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//    UserDetails userDetails = (UserDetails) authentication.getPrincipal();
//    System.out.println("Authenticated User: " + userDetails.getUsername());
//
//    // Generate JWT token
//    String token = tokenProvider.createToken(username);
//
//    return ResponseEntity.ok(new AuthResponse(token));
//}
