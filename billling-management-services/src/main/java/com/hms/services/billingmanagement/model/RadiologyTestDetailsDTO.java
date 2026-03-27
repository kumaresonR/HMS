package com.hms.services.billingmanagement.model;

import lombok.Data;

import java.util.List;

@Data
public class RadiologyTestDetailsDTO {
    private String radiologyTestId;
    private String testName;
    private String categoryName;
    private List<RadiologyTestParameterDTO> testParameters;
}




