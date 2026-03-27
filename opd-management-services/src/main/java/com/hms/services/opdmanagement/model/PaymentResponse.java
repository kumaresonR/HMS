package com.hms.services.opdmanagement.model;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Data
public class PaymentResponse {

    private String opdChargeId;
    private String opdId;
    private LocalDate date;
    private String transactionId;
    private Double amount;
    private String paymentMode;
    private String chequeNo;
    private Date chequeDate;
    private String chequeAttachment;
    private String note;
    private boolean isActive;
    private LocalDateTime createdAt;
    private String createdBy;
    private String lastModifiedBy;
    private LocalDateTime lastModifiedAt;
    private OPDCombinedDTO.PatientDTO patients;


}

