package com.hms.services.billingmanagement.model;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class PathologyDTO {
    private String testId;
    private String billId;
    private String pathologyTestId;
    private PathologyTestDetailsDTO PathologyDetails;
    private Integer reportDays;
    private LocalDateTime reportDate;
    private String prescriptionNo;
    private Double tax;
    private Double amount;
    private String sampleCollected;
    private String approvedBy;
    private LocalDate collectedDate;
    private String pathologyCenter;
    private LocalDate approvedDate;
    private String result;
    private String uploadReport;
    private PathologyTestDetailsDTO pathologyTestDetails;
}


