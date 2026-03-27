package com.hms.services.patientmanagement.model;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EmergencyContactsDTO {

    private String emergencyContactId;
    @NotBlank(message = "PatientInfo. cannot be blank")
    private String patientId;
    @NotBlank(message = "ContactName cannot be blank")
    private String contactName;
    @NotBlank(message = "RelationShip cannot be blank")
    private String relationShip;
    @NotBlank(message = "ContactNumber cannot be blank")
    private String contactNumber;
    private Boolean isActive;
}

