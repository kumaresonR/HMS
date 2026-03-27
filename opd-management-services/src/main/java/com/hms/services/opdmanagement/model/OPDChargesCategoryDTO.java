package com.hms.services.opdmanagement.model;


import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OPDChargesCategoryDTO {

    private String chargeCategoryId;
    private String chargeTypeId;
    private String chargeCategory;
    private boolean isActive;
    private LocalDateTime createdAt;
    private String createdBy;
    private String lastModifiedBy;
    private LocalDateTime lastModifiedAt;


}

