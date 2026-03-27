package com.hms.services.billingmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "HMS_TM_PATHOLOGY_BILL")
public class HMS_TM_PathologyBill {

    @Id
    @Column(name = "BILL_ID", length = 10)
    private String billId;

    @Column(name = "BILL_NO")
    private String billNo;

    @Column(name = "PATIENT_ID", length = 255)
    private String patientId;

    @Column(name = "IPD_OR_OPD_ID")
    private String ipdOrOpdId;

    @Column(name = "CASE_ID", length = 255)
    private String caseId;

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

    @Column(name = "PREVIOUS_REPORT_VALUE")
    private String previousReportValue;

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

