package com.hms.services.billingmanagement.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PathologyBillResponse {
    private String billNo;
    private LocalDateTime date;
    private String patientName;
    private String categoryName;
    private String testName;
    private String consultantDoctor;
    private String sampleCollected;
    private String previousReportValue;
    private Double amount;
}

