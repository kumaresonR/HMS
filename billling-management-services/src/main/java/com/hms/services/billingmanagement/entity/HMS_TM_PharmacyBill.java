package com.hms.services.billingmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Data
@Entity
@Table(name = "HMS_TM_PHARMACY_BILL")
public class HMS_TM_PharmacyBill {

    @Id
    @Column(name = "PHARMACY_BILL_ID")
    private String pharmacyBillId;

    @Column(name = "BILL_NO")
    private String billNo;

    @Column(name = "PATIENT_ID", length = 255)
    private String patientId;

    @Column(name = "CASE_ID", length = 255)
    private String caseId;

    @Column(name = "IPD_OR_OPD_ID")
    private String ipdOrOpdId;

    @Column(name = "PRESCRIPTION_NO")
    private String prescriptionNo;

    @Column(name = "DATE_TIME")
    private LocalDateTime dateTime;

    @Column(name = "HOSPITAL_DOCTOR", length = 100)
    private String hospitalDoctor;

    @Column(name = "DOCTOR_NAME", length = 100)
    private String doctorName;

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

    @Column(name = "BALANCE_AMOUNT")
    private Double balanceAmount;

    @Column(name = "CHEQUE_NO", length = 50)
    private String chequeNo;

    @Column(name = "CHEQUE_DATE")
    private LocalDate chequeDate;

    @Lob
    @Column(name = "ATTACH_DOCUMENT", columnDefinition = "text")
    private String attachDocument;

    @Column(name = "DELETED")
    private Boolean deleted = false;

}


