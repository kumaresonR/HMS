package com.hms.services.billingmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "HMS_TM_PURCHASE_BILL")
public class HMS_TM_PurchaseBill {

    @Id
    @Column(name = "PURCHASE_BILL_ID")
    private String purchaseBillId;

    @Column(name = "SUPPLIER_ID", length = 100)
    private String supplierId;

    @Column(name = "BILL_NO")
    private String billNo;

    @Column(name = "PURCHASE_DATE")
    private LocalDateTime purchaseDate;

    @Column(name = "NOTE")
    private String note;

    @Column(name = "TOTAL_AMOUNT")
    private Double totalAmount;

    @Column(name = "DISCOUNT")
    private Double discount;

    @Column(name = "TAX")
    private Double tax;

    @Column(name = "NET_AMOUNT")
    private Double netAmount;

    @Column(name = "PAYMENT_MODE", length = 50)
    private String paymentMode;

    @Column(name = "PAYMENT_AMOUNT")
    private Double paymentAmount;

    @Column(name = "PAYMENT_NOTE")
    private String paymentNote;

    @Lob
    @Column(name = "ATTACHMENT", columnDefinition = "text")
    private String attachment;

    @Column(name = "CHEQUE_NO", length = 50)
    private String chequeNo;

    @Column(name = "CHEQUE_DATE")
    private LocalDate chequeDate;

    @Lob
    @Column(name = "CHEQUE_ATTACH_DOCUMENT", columnDefinition = "text")
    private String chequeAttachDocument;

    @Column(name = "DELETED")
    private Boolean deleted = false;

    @Column(name = "STATUS", length = 50)
    private String status = "PENDING";

}


