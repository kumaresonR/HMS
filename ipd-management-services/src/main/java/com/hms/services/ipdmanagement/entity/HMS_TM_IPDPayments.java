package com.hms.services.ipdmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Data
@Entity
@Table(name="HMS_TM_IPDPAYMENTS", schema = "ipd")
public class HMS_TM_IPDPayments {


    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "IPD_CHARGE_ID")
    private String ipdPaymentId;

    @Column(name = "IPD_ID")
    private String ipdId;

    @Column(name = "DATE", columnDefinition = "timestamp")
    private LocalDate date;

    @Column(name = "TRANSACTION_ID")
    private String transactionId;

    @Column(name = "AMOUNT", nullable = false)
    private Double amount;

    @Column(name = "PAYMENT_MODE", nullable = false)
    private String paymentMode;

    @Column(name = "CHEQUE_NO")
    private String chequeNo;

    @Column(name = "CHEQUE_DATE")
    private Date chequeDate;

    @Lob
    @Column(name = "CHEQUE_ATTACHMENT", columnDefinition = "text")
    private String chequeAttachment;

    @Lob
    @Column(name = "NOTE", columnDefinition = "text")
    private String note;

    @Column(name = "IS_ACTIVE")
    private boolean isActive;

    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "LAST_MODIFIED_BY")
    private String lastModifiedBy;

    @Column(name = "LAST_MODIFIED_AT")
    private LocalDateTime lastModifiedAt;

}

