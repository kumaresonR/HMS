package com.hms.services.adminmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "HMS_TM_PATIENT_PAYMENT")
public class HMS_TM_PatientPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "BILL_ID")
    private String billId;

    @Column(name = "PATIENT_ID", nullable = false, length = 50)
    private String patientId;

    @Column(name = "PATIENT_TYPE", nullable = false, length = 50)
    private String patientType;

    @Column(name = "BILL_NO", nullable = false, length = 50)
    private String billNo;

    @Column(name = "PATIENT_BILL_AMOUNT", nullable = false)
    private Double patientBillAmount;

    @Column(name = "PAYEE", nullable = false, length = 100)
    private String payee;

    @Column(name = "COMMISSION_PERCENTAGE", nullable = false)
    private Double commissionPercentage;

    @Column(name = "COMMISSION_AMOUNT", nullable = false)
    private Double commissionAmount;

//    @Column(name = "STATUS", nullable = false, length = 20)
//    private String status;

    @Column(name = "IS_ACTIVE", nullable = false)
    private boolean isActive;

    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "CREATED_BY", length = 50)
    private String createdBy;

    @Column(name = "LAST_MODIFIED_BY", length = 50)
    private String lastModifiedBy;

    @Column(name = "LAST_MODIFIED_AT")
    private LocalDateTime lastModifiedAt;



}



