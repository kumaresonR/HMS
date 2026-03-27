package com.hms.services.billingmanagement.model;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PathologyBillDTO {
    private String billId;
    private String billNo;
    private String patientId;
    private PatientsDTO patientDetails;
    private String ipdOrOpdId;
    private String caseId;
    private String prescriptionNo;
    private LocalDateTime dateTime;
    private String hospitalDoctor;
    private String doctorName;
    private String note;
    private String previousReportValue;
    private Double totalAmount;
    private Double discount;
    private Double tax;
    private Double netAmount;
    private String paymentMode;
    private Double paymentAmount;
    private Double balanceAmount;
    private String chequeNo;
    private LocalDate chequeDate;
    private String attachDocument;
    private List<PathologyDTO> pathologyItems;
}


