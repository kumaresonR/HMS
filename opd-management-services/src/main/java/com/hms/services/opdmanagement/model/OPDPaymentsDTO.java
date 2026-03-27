package com.hms.services.opdmanagement.model;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class OPDPaymentsDTO {

    private String opdChargeId;
    private String opdId;
    private LocalDate date;
    private String transactionId;
    private Double amount;
    private String paymentMode;
    private String note;
    private boolean isActive;
    private LocalDateTime createdAt;
    private String createdBy;
    private String lastModifiedBy;
    private LocalDateTime lastModifiedAt;
}

