package com.hms.services.opdmanagement.model;

import lombok.Data;

@Data
public class TaxCategoryDTO {
    private String id;
    private String name;
    private double percentage;
}

