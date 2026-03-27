package com.hms.services.ambulancemanagement.model;


import lombok.Data;

import java.util.Date;

@Data
public class AmbulancePaymentResponse {

    private String paymentId;
    private String vehicleChargeId;
    private String paymentMode;
    private Double paymentAmount;
    private String checkNo;
    private Date checkDate;
    private String attachment;
    private Date date;

    private String vehicleModel;
    private String vehicleNumber;
    private String driverName;

    private String billNo;
    private Double total;
    private Double discountAmount;
    private Double netAmount;

    private PatientsDTO patient;
}


