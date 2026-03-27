package com.hms.services.ipdmanagement.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class IPDChargesNameDTO {

    private String chargeNameId;
    private String chargeCategoryId;
    private String chargeName;
    private Double standardCharge;
    private Double tpaCharge;
    private Double taxPercentage;
    private boolean isActive;
    private LocalDateTime createdAt;
    private String createdBy;
    private String lastModifiedBy;
    private LocalDateTime lastModifiedAt;
}

