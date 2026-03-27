package com.hms.services.bloodbankmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Entity
@Table(name = "HMS_TM_ISSUE_COMPONENT")
public class HMS_TM_IssueComponent {

    @Id
    @Column(name = "ISSUE_COMPONENT_ID")
    private String issueComponentId;

    @Column(name = "PATIENT_ID", length = 255)
    private String patientId;

    @Column(name = "CASE_ID", length = 255)
    private String caseId;

    @Column(name = "IPD_OR_OPD_ID")
    private String ipdOrOpdId;

    @Column(name = "ISSUE_DATE")
    private Date issueDate;

    @Column(name = "HOSPITAL_DOCTOR", length = 100)
    private String hospitalDoctor;

    @Column(name = "REFERENCE_NAME", length = 100)
    private String referenceName;

    @Column(name = "TECHNICIAN", length = 100)
    private String technician;

    @Column(name = "BLOOD_GROUP", length = 10)
    private String bloodGroup;

    @Column(name = "COMPONENTS", length = 100)
    private String components;

    @Column(name = "COMPONENT_ID")
    private String componentId;

    @Column(name = "CHARGE_CATEGORY", length = 100)
    private String chargeCategory;

    @Column(name = "CHARGE_NAME", length = 100)
    private String chargeName;

    @Column(name = "STANDARD_CHARGE")
    private Double standardCharge;

    @Column(name = "NOTE", length = 255)
    private String note;

    @Column(name = "TOTAL")
    private Double total;

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
    private Date chequeDate;

    @Lob
    @Column(name = "ATTACH_DOCUMENT", columnDefinition = "text")
    private String attachDocument;

    @Column(name = "IS_GST_ADDED")
    private boolean isGstAdded;

    @Column(name = "DELETED")
    private Boolean deleted = false;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;
}


