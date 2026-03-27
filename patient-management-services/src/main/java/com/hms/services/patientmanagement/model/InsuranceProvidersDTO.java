package com.hms.services.patientmanagement.model;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
public class InsuranceProvidersDTO {

    private String insuranceId;
    @NotBlank(message = "ProviderName cannot be blank")
    private String providerName;
    @NotBlank(message = "PolicyNumber cannot be blank")
    private String policyNumber;
    @NotBlank(message = "CoverageDetails cannot be blank")
    private String coverageDetails;
    private String status;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalTime time;
    private Boolean isActive;
    private String lastModifiedBy;
    private LocalDateTime lastModifiedAt;
}

