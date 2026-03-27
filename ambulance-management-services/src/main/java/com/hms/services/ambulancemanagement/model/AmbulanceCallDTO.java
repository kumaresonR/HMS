package com.hms.services.ambulancemanagement.model;

import jakarta.persistence.Column;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class AmbulanceCallDTO {

    private String vehicleChargeId;
    private String patientId;
    private String caseId;
    private String ipdOrOpdId;
    private String vehicleId;
    private String vehicleModel;
    private String driverName;
    private String chargeCategory;
    private String chargeName;
    private Double standardCharge;
    private String note;
    private Double total;
    private Double discountAmount;
    private Double discountPercentage;
    private Double taxAmount;
    private Double taxPercentage;
    private Double netAmount;
    private Double balanceAmount;
    private boolean isGstAdded;
    private String billNo;
    private PatientsDTO patients;
    private AddVehicleDTO vehicle;
    List<AmbulanceCallTransactionDTO>transactions;

}


