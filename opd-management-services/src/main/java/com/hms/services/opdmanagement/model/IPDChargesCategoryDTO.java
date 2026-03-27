package com.hms.services.opdmanagement.model;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class IPDChargesCategoryDTO {

    private String chargeCategoryId;
    private String chargeTypeId;
    private String chargeCategory;
    private boolean isActive;
    private LocalDateTime createdAt;
    private String createdBy;
    private String lastModifiedBy;
    private LocalDateTime lastModifiedAt;
//    private List<IPDChargesNameDTO> chargesNames;
}

