package com.hms.services.billingmanagement.model;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class RadiologyTestDTO {
    private String testId;
    private String testName;
    private String radiologyTestId;
    private Integer reportDays;
    private LocalDateTime reportDate;
    private Double tax;
    private Double amount;
    private String sampleCollected;
    private String approvedBy;
    private LocalDate collectedDate;
    private String radiologyCenter;
    private LocalDate approvedDate;
    private String uploadReport;
    private String result;
    private String billId;
    private List<RadiologyTestParameterDTO> testParameters;
}


