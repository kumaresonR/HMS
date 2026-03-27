//package com.hms.services.ipdmanagement.entity;
//
//import jakarta.persistence.*;
//import lombok.Data;
//
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//
//@Data
//@Entity
//@Table
//public class HMS_TM_IPDBilling {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.UUID)
//    @Column(name = "BILLING_ID")
//    private String billingId;
//
//    @Column(name = "PATIENT_ID", nullable = false)
//    private String patientId;
//
//    @Column(name = "ADMISSION_ID", nullable = false)
//    private String admissionId;
//
//    @Column(name = "BILLING_DATE", columnDefinition = "TIMESTAMP", nullable = false)
//    private LocalDate billingDate;
//
//    @Column(name = "TOTAL_AMOUNT",nullable = false)
//    private Double totalAmount;
//
//    @Column(name = "NET_AMOUNT",nullable = false)
//    private Double netAmount;
//
//    @Column(name = "PAID_AMOUNT",nullable = false)
//    private Double paidAmount;
//
//    @Column(name = "TAX",nullable = false)
//    private Double tax;
//
//    @Column(name = "PAYMENT_STATUS", length = 20, nullable = false)
//    private String paymentStatus;
//
//    @Column(name = "PAYMENT_METHOD", length = 20)
//    private String paymentMethod;
//
//    @Column(name = "IS_ACTIVE")
//    private boolean isActive;
//
//    @Column(name = "STATUS", nullable = false, length = 20)
//    private String status;
//
//    @Column(name = "CREATED_AT", updatable = false)
//    private LocalDateTime createdAt;
//
//    @Column(name = "CREATED_BY")
//    private String createdBy;
//
//    @Column(name = "LAST_MODIFIED_BY")
//    private String lastModifiedBy;
//
//    @Column(name = "LAST_MODIFIED_AT")
//    private LocalDateTime lastModifiedAt;
//
//
//}

