package com.hms.services.ipdmanagement.model;

import lombok.Data;

import java.time.LocalDate;
import java.util.Date;

@Data
public class PaymentResponse {

    private String ipdChargeId;
    private String ipdId;
    private LocalDate date;
    private String transactionId;
    private Double amount;
    private String paymentMode;
    private String chequeNo;
    private Date chequeDate;
    private String chequeAttachment;
    private String note;
    private IPDCombinedDTO.PatientDTO patients;
}

