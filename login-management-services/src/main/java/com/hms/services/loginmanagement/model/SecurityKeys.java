package com.hms.services.loginmanagement.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class SecurityKeys {

    public String uniqueId;
    public String publicKey;
    public String privateKey;
    public String encryptedData;

}

