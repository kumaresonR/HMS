package com.hms.services.ambulancemanagement.model;

import lombok.Data;

import java.util.Date;

@Data
public class AmbulanceCallTransactionDTO {

    private String paymentId;
    private String vehicleChargeId;
    private Date date;
    private String paymentMode;
    private String checkNo;
    private Date checkDate;
    private String attachment;
    private Double paymentAmount;

}


