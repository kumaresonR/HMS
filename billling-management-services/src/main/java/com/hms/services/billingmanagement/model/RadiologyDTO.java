package com.hms.services.billingmanagement.model;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class RadiologyDTO {
    private String testId;
    private String billId;
    private String radiologyTestId;
    private RadiologyTestDetailsDTO RadiologyDetails;
    private Integer reportDays;
    private LocalDateTime reportDate;
    private Double tax;
    private Double amount;
    private String prescriptionNo;
    private String sampleCollected;
    private String approvedBy;
    private LocalDate collectedDate;
    private String radiologyCenter;
    private LocalDate approvedDate;
    private String result;
    private String uploadReport;
    private RadiologyTestDetailsDTO RadiologyTestDetails;
}


