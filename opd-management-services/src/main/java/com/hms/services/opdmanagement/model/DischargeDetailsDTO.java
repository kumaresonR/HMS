package com.hms.services.opdmanagement.model;


import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DischargeDetailsDTO {

    private LocalDateTime dischargeDate;
    private String dischargeStatus;
    private String dischargeSummary;
    private String operation;
    private String diagnosis;
    private String investigation;
    private String treatmentHome;
    private LocalDateTime deathDate;
    private String guardianName;
    private String report;
    private LocalDateTime referralDate;
    private String referralHospitalName;
    private String reasonForReferral;
}

