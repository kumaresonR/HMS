package com.hms.services.billingmanagement.model;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PathologyTestDTO {
    private String testId;
    private String testName;
    private String pathologyTestId;
    private Integer reportDays;
    private LocalDateTime reportDate;
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


