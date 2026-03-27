package com.hms.services.opdmanagement.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class PathologyTestDetailsDTO {
//    private String pathologyTestId;
//    private String testName;
//    private String shortName;
//    private String testType;
//    private String categoryName;
//    private String subCategory;
//    private String method;
//    private int reportDays;
//    private String chargeCategory;
//    private String chargeName;
//    private double taxPercentage;
//    private double standardCharge;
//    private double amount;

    private String testId;
    private String testName;
    private String pathologyTestId;
    private Integer reportDays;
    private LocalDate reportDate;
    private Double tax;
    private Double amount;
    private String sampleCollected;
    private String approvedBy;
    private LocalDate collectedDate;
    private String pathologyCenter;
    private LocalDate approvedDate;
    private String uploadReport;
    private String result;
    private String billId;
    private List<PathologyTestParameterDTO> testParameters;
}



