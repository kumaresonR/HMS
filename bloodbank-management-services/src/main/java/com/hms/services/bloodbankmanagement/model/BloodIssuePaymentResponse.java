package com.hms.services.bloodbankmanagement.model;

import lombok.Data;

import java.util.Date;

@Data
public class BloodIssuePaymentResponse {

    private String issueBloodId;
    private String patientId;
    private String ipdOrOpdId;
    private String caseId;
    private Date issueDate;
    private String hospitalDoctor;
    private String referenceName;
    private String technician;
    private String bloodGroup;
    private String bagStockId;
    private String chargeCategory;
    private String chargeName;
    private Double standardCharge;
    private String note;
    private Integer bloodQty;
    private Double total;
    private Double discount;
    private Double tax;
    private Double netAmount;
    private String paymentMode;
    private Double paymentAmount;
    private Double balanceAmount;
    private String chequeNo;
    private Date chequeDate;
    private String attachDocument;
    private boolean isGstAdded;
    private PatientsDTO patients;
}


