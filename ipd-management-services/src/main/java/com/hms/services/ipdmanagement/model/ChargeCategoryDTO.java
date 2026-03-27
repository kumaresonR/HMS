package com.hms.services.ipdmanagement.model;

import lombok.Data;

@Data
public class ChargeCategoryDTO {
    private String categoryId;
    private String name;
    private String description;
    private ChargeTypeDTO chargeType;
}

