package com.hms.services.opdmanagement.model;

import lombok.Data;

@Data
public class ChargeCategoryDTO {
    private String categoryId;
    private String name;
    private String description;
    private ChargeTypeDTO chargeType;
}

