package com.hms.services.opdmanagement.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OPDChargesDTO {

    private String opdChargeId;
    private String opdId;
    private String chargeTypeId;
    private String chargeCategoryId;
    private String chargeNameId;
    private Double standardCharge;
    private Double tpaCharge;
    private Float qty;
    private Float total;
    private Double discountAmount;
    private Double discountPercentage;
    private Double taxAmount;
    private Double taxPercentage;
    private Double netAmount;
    private String chargeNote;
    private LocalDateTime date;
    private boolean applyTpa;
    private boolean isGstAdded;
    private boolean isActive;
    private LocalDateTime createdAt;
    private String createdBy;
    private String lastModifiedBy;
    private LocalDateTime lastModifiedAt;


}

