package com.hms.services.bloodbankmanagement.model;

import lombok.Data;

import java.util.Date;

@Data
public class IssueComponentDTO {

    private String issueComponentId;
    private String patientId;
    private String caseId;
    private String ipdOrOpdId;
    private Date issueDate;
    private String hospitalDoctor;
    private String referenceName;
    private String technician;
    private String bloodGroup;
    private String components;
    private String componentId;
    private String chargeCategory;
    private String chargeName;
    private Double standardCharge;
    private String note;
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
    private Boolean deleted;
    private boolean isGstAdded;
    private String donorName;
    private String donorGender;

    private PatientsDTO patientDetails;
    private BloodComponentDTO bloodComponent;

}



