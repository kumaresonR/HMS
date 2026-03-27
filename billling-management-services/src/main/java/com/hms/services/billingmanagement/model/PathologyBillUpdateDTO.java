package com.hms.services.billingmanagement.model;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PathologyBillUpdateDTO {
    private String testId;
    private String sampleCollected;
    private LocalDate collectedDate;
    private String pathologyCenter;
}


