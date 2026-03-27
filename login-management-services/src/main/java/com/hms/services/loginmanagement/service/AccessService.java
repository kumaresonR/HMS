package com.hms.services.loginmanagement.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.hms.services.loginmanagement.configuration.AdminManagementInterface;
import com.hms.services.loginmanagement.configuration.CacheRepository;
import com.hms.services.loginmanagement.configuration.EncryptionUtil;
import com.hms.services.loginmanagement.entity.HMS_TM_UserDetails;
import com.hms.services.loginmanagement.exception.CustomException;
import com.hms.services.loginmanagement.model.*;
import com.hms.services.loginmanagement.repository.UserRepository;
import com.hms.services.loginmanagement.security.TokenProvider;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.security.InvalidKeyException;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPrivateKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.time.LocalDateTime;
import java.util.Base64;
import java.security.*;
import java.util.*;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AccessService {


    private final UserRepository userRepository;

    private final EncryptionUtil encryptionUtil;

    private final TokenProvider tokenProvider;

    private final CacheRepository cacheRepository;

    private final ModelMapper modelMapper;

    private final AdminManagementInterface adminManagementInterface;


    @Value("${security.key.expire:6000}")
    private long keyExpire;

    @Value("${security.jwt.token.expire.time:3600000}")
    private long expireTime;

    @Autowired
    public AccessService(TokenProvider tokenProvider,EncryptionUtil encryptionUtil,
                         UserRepository userRepository,CacheRepository cacheRepository,ModelMapper modelMapper,AdminManagementInterface adminManagementInterface) {
        this.tokenProvider = tokenProvider;
        this.encryptionUtil = encryptionUtil;
        this.userRepository = userRepository;
        this.cacheRepository = cacheRepository;
        this.modelMapper = modelMapper;
        this.adminManagementInterface = adminManagementInterface;
    }

    public SignInResponse sendEncryptedData(String uniqueId, String encryptedData)
            throws Exception {
        try {
            log.info("UniqueId details -,:::::::::::::::::: = {}", uniqueId);
            SecurityKeys securityKeys = cacheRepository.getPublicAndPrivateKey(uniqueId);
            log.info("securityKeys details -,:::::::::::::::::: = {}", securityKeys);
            byte[] data = Base64.getDecoder().decode((securityKeys.getPrivateKey().getBytes()));
            log.info("PrivateKey details -,::::::::::::::::::::= {}", data);
            KeyFactory fact = KeyFactory.getInstance("RSA");
            log.info("KeyFactory details -,:::::::::::::: = {}", fact);
            PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(data);
            RSAPrivateKey privKey = (RSAPrivateKey) fact.generatePrivate(spec);
            log.info("RSAPrivateKey details -,::::::::::::::::= {}", privKey);
            final Cipher rsa = Cipher.getInstance("RSA/ECB/PKCS1Padding");
            rsa.init(Cipher.DECRYPT_MODE, privKey);
            log.info("Cipher details -,:::::::::::::::::::::= {}", rsa);
            byte[] encrPass = Base64.getDecoder().decode(encryptedData.getBytes());
            byte[] decreptedData = rsa.doFinal(encrPass);
            final String userData = new String(decreptedData);
            String strings[] = userData.split(":");
            String userName = strings[0];
            String password = strings[1];
            log.info("User_Name ::::::= {}", userName);
//        SignInResponse signInResponse = signInResponse(userName, password);
            HMS_TM_UserDetails user = userRepository.findByUserNameAndIsActiveTrue(userName)
                    .orElseThrow(() -> new UsernameNotFoundException("Invalid username & password"));
//        String encryptedPassword=encryptionUtil.encrypt(password);
//        System.out.println("encryptedPassword:"+encryptedPassword);
            String decryptPassword = encryptionUtil.decrypt(user.getPassword());
            boolean validation = validatePassword(decryptPassword, password);
            SignInResponse signInResponse = new SignInResponse();
            if (validation) {
                System.out.println(user.getRoleId());
                RoleDto role = adminManagementInterface.getRole(user.getRoleId()).getBody();
                String accessToken = tokenProvider.createToken(userName, TokenType.ACCESS);
                String refreshToken = tokenProvider.createToken(userName, TokenType.REFRESH);
                signInResponse.setName(user.getFirstName() + " " + user.getLastName());
                signInResponse.setAccessToken(accessToken);
                signInResponse.setRefreshToken(refreshToken);
                signInResponse.setRole(role.getRoleName());
                signInResponse.setExpireIn(expireTime);
                signInResponse.setEmailId(user.getEmail());
                signInResponse.setUserId(user.getEmployeeId());
                signInResponse.setDepartmentId(user.getDepartmentId());
                signInResponse.setReporterId(user.getReporterId());
                signInResponse.setGender(user.getGender());
                signInResponse.setRoleDto(role);
                cacheRepository.setTokenInfo(accessToken, signInResponse, expireTime);

            } else {
                throw new CustomException("Invalid username or password", HttpStatus.FORBIDDEN);
            }
            return signInResponse;
        }catch(Exception ex){
            throw new CustomException(ex.getMessage(), HttpStatus.FORBIDDEN);
        }
    }

    private boolean validatePassword(String decryptPassword, String password) {
        return decryptPassword.equals(password);
    }

    public String createPublicAndPrivateKeys(String uniqueId) throws JsonProcessingException {
        SecurityKeys SecurityKeys = new SecurityKeys();
        String publicKeyValue = null;
        PublicKey publicKey = null;
        //long keyExpire = 600;
        try {
            KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
            keyGen.initialize(2048);
            KeyPair keyPair = keyGen.generateKeyPair();
            log.info("keyPair authenticate -,:::::::::::::= {}", keyPair);
            PrivateKey privateKey = keyPair.getPrivate();
            publicKey = keyPair.getPublic();
            Base64.Encoder encoder = Base64.getEncoder();
            SecurityKeys.setUniqueId(uniqueId);
            SecurityKeys.setPublicKey(encoder.encodeToString(publicKey.getEncoded()));
            SecurityKeys.setPrivateKey(encoder.encodeToString(privateKey.getEncoded()));
            log.info("Authentication authenticate -,:::::::::::::::= {}", uniqueId, SecurityKeys, keyExpire);
            cacheRepository.setPublicAndPrivateKey(uniqueId, SecurityKeys, keyExpire);
            publicKeyValue = encoder.encodeToString(publicKey.getEncoded());
        } catch (NoSuchAlgorithmException e) {
            log.error("Error generating public key", e);
        }
        return publicKeyValue;
    }

    public void saveEmployee(EmployeeLoginDTO employeeDTO) throws Exception {
        try {
            HMS_TM_UserDetails user = userRepository.findByEmployeeIdAndIsActiveTrue(employeeDTO.getEmployeeId());
            if(user!=null){
                if(employeeDTO.getPassword() != null && !employeeDTO.getPassword().trim().isEmpty()) {
                    String encryptedPassword = encryptionUtil.encrypt(employeeDTO.getPassword());
                    employeeDTO.setPassword(encryptedPassword);
                    user.setPassword(encryptedPassword);
                    user.setUserName(employeeDTO.getUserName());
                }
                    user.setEmployeeId(employeeDTO.getEmployeeId());
                    user.setDepartmentId(employeeDTO.getDepartmentId());
                    user.setReporterId(employeeDTO.getReporterId());
                    user.setFirstName(employeeDTO.getFirstName());
                    user.setLastName(employeeDTO.getLastName());
                    user.setRoleId(employeeDTO.getRoleId());
                    user.setEmployeeId(employeeDTO.getEmployeeId());
                    user.setEmail(employeeDTO.getEmail());
                    user.setGender(employeeDTO.getGender());
                    user.setPhone(employeeDTO.getPhone());
                    user.setCreatedAt(LocalDateTime.now());
                    user.setCreatedBy(employeeDTO.getEmployeeId());
                    user.setActive(employeeDTO.isActive());
                    userRepository.save(user);
            }else{
                HMS_TM_UserDetails userData=new HMS_TM_UserDetails();
                if(employeeDTO.getPassword() != null && !employeeDTO.getPassword().trim().isEmpty()) {
                    String encryptedPassword = encryptionUtil.encrypt(employeeDTO.getPassword());
                    employeeDTO.setPassword(encryptedPassword);
                    userData.setPassword(encryptedPassword);
                }
                userData.setFirstName(employeeDTO.getFirstName());
                userData.setLastName(employeeDTO.getLastName());
                userData.setDepartmentId(employeeDTO.getDepartmentId());
                userData.setReporterId(employeeDTO.getReporterId());
                userData.setRoleId(employeeDTO.getRoleId());
                userData.setEmployeeId(employeeDTO.getEmployeeId());
                userData.setEmail(employeeDTO.getEmail());
                userData.setGender(employeeDTO.getGender());
                userData.setPhone(employeeDTO.getPhone());
                userData.setUserName(employeeDTO.getUserName());
                userData.setCreatedAt(LocalDateTime.now());
                userData.setCreatedBy(employeeDTO.getEmployeeId());
                userRepository.save(userData);
            }
        }catch(Exception ex){
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}

