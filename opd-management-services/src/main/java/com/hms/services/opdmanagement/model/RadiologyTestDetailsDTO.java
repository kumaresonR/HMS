package com.hms.services.opdmanagement.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class RadiologyTestDetailsDTO {
//    private String radiologyTestId;
//    private String testName;
//    private String shortName;
//    private String testType;
//    private String categoryName;
//    private String subCategory;
//    private int reportDays;
//    private String chargeCategory;
//    private String chargeName;
//    private double taxPercentage;
//    private double standardCharge;
//    private double amount;

    private String testId;
    private String testName;
    private String radiologyTestId;
    private Integer reportDays;
    private LocalDate reportDate;
    private Double tax;
    private Double amount;
    private String sampleCollected;
    private String approvedBy;
    private LocalDate collectedDate;
    private String radiologyCenter;
    private LocalDate approvedDate;
    private String uploadReport;
    private String mediaType;
    private String result;
    private String billId;
    private List<RadiologyTestParameterDTO> testParameters;
}


