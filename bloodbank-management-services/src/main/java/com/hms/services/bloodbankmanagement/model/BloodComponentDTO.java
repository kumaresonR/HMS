package com.hms.services.bloodbankmanagement.model;

import lombok.Data;

@Data
public class BloodComponentDTO {
    private String componentId;
    private String bloodGroup;
    private String componentName;
    private String componentBag;
    private Double volume;
    private String unit;
    private String lot;
    private String institution;
}



