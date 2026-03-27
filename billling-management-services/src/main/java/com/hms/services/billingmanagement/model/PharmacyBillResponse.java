package com.hms.services.billingmanagement.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PharmacyBillResponse {
    private String billNo;
    private LocalDateTime date;
    private String patientName;
    private String age;
    private String gender;
    private String prescriptionNo;
    private String doctorName;
    private Double netAmount;
    private Double paidAmount;
    private Double balanceAmount;
}

