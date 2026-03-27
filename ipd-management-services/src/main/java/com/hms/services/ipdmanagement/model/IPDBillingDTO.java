package com.hms.services.ipdmanagement.model;

import lombok.Data;

import java.time.LocalDate;

@Data
public class IPDBillingDTO {

    private String billingId;
    private String patientId;
    private String admissionId;
    private LocalDate billingDate;
    private Double totalAmount;
    private Double netAmount;
    private Double paidAmount;
    private Double tax;
    private String paymentStatus;
    private String paymentMethod;
    private boolean isActive;
    private String status;
    private String createdBy;
    private String lastModifiedBy;


}

