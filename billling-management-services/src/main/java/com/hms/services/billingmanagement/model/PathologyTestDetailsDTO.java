package com.hms.services.billingmanagement.model;

import lombok.Data;

import java.util.List;

@Data
public class PathologyTestDetailsDTO {
    private String pathologyTestId;
    private String categoryName;
    private String testName;
    private List<PathologyTestParameterDTO> testParameters;
}


