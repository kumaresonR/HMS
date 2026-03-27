package com.hms.services.opdmanagement.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OPDChargesTypeDTO {

    private String chargeTypeId;
    private String chargeType;
    private boolean isActive;
    private LocalDateTime createdAt;
    private String createdBy;
    private String lastModifiedBy;
    private LocalDateTime lastModifiedAt;

}

