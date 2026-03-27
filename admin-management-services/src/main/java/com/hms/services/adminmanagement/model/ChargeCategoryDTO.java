package com.hms.services.adminmanagement.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChargeCategoryDTO {

    private String categoryId;
    private String chargeTypeId;
    private String name;
    private String description;
    private String modNo;
    private String authStat;
    private String recordStat;
    private boolean isActive;
    private LocalDateTime createdAt;
    private String createdBy;
    private String lastModifiedBy;
    private LocalDateTime lastModifiedAt;
    private ChargeTypeDTO chargeType;
}



