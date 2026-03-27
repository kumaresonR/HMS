package com.hms.services.opdmanagement.model;

import lombok.Data;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
public class InsuranceProvidersDTO {

    private String insuranceId;
    private String providerName;
    private String policyNumber;
    private String coverageDetails;
    private String status;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalTime time;
    private Boolean isActive;
    private String lastModifiedBy;
    private LocalDateTime lastModifiedAt;
}

