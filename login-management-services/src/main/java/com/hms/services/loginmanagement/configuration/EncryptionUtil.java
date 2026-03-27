package com.hms.services.loginmanagement.configuration;


import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Arrays;
import java.util.Base64;

@Component
public class EncryptionUtil {

    private static final String AES = "AES";
    @Value("${security.jwt.token.secret-key:6t3v269pisik0mgkev5uvi5jd1}")
    private String secretKey;
    private SecretKey aesKey;

    @PostConstruct
    public void init() {
        if (secretKey.length() < 16) {
            throw new IllegalArgumentException("Secret key must be at least 16 characters long");
        }
        byte[] keyBytes = Arrays.copyOf(secretKey.getBytes(), 24);
        aesKey = new SecretKeySpec(keyBytes, AES);
    }

    public String encrypt(String data) throws Exception {
        Cipher cipher = Cipher.getInstance(AES);
        cipher.init(Cipher.ENCRYPT_MODE, aesKey);
        byte[] encryptedData = cipher.doFinal(data.getBytes());
        return Base64.getEncoder().encodeToString(encryptedData);
    }

    public String decrypt(String encryptedData) throws Exception {
        Cipher cipher = Cipher.getInstance(AES);
        cipher.init(Cipher.DECRYPT_MODE, aesKey);
        byte[] decodedData = Base64.getDecoder().decode(encryptedData);
        byte[] decryptedData = cipher.doFinal(decodedData);
        return new String(decryptedData);
    }
}

