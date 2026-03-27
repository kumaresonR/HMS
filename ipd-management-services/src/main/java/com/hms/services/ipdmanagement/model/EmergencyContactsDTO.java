package com.hms.services.ipdmanagement.model;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EmergencyContactsDTO {

    private String emergencyContactId;
    private String patientId;
    private String contactName;
    private String relationShip;
    private String contactNumber;
    private Boolean isActive;
}

