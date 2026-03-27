package com.hms.services.billingmanagement.model;

import lombok.Data;

import java.time.LocalDate;

@Data
public class RadiologyTestUpdateDTO {
    private String testId;
    private String approvedBy;
    private LocalDate approvedDate;
    private String uploadReport;
    private String result;
    private String reportValue;
}


