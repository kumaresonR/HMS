package com.hms.services.laboratorymanagement.model;

import lombok.Data;

import java.util.List;

@Data
public class RadiologyTestDetailsDTO {
    private String radiologyTestId;
    private String testName;
    private String shortName;
    private String testType;
    private String categoryName;
    private String subCategory;
    private int reportDays;
    private String chargeCategory;
    private String chargeName;
    private double taxPercentage;
    private double standardCharge;
    private double amount;
    private List<RadiologyTestParameterDTO> testParameters;
}


