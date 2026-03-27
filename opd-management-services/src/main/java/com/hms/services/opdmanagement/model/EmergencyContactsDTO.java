package com.hms.services.opdmanagement.model;

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

