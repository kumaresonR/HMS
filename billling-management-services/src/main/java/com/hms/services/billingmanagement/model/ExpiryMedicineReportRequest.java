package com.hms.services.billingmanagement.model;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ExpiryMedicineReportRequest {
    private String timeDuration;
    private String  startDate;
    private String  endDate;
    private String medicineCategory;
}

