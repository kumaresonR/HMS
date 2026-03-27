package com.hms.services.laboratorymanagement.model;

import lombok.Data;

import java.util.List;

@Data
public class PathologyTestDetailsDTO {
    private String pathologyTestId;
    private String testName;
    private String shortName;
    private String testType;
    private String categoryName;
    private String subCategory;
    private String method;
    private int reportDays;
    private String chargeCategory;
    private String chargeName;
    private double taxPercentage;
    private double standardCharge;
    private double amount;

    private List<PathologyTestParameterDTO> testParameters;
}



