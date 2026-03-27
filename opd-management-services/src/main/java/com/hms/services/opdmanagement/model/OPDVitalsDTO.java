package com.hms.services.opdmanagement.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OPDVitalsDTO {

    private String vitalsId;
    private String opdId;
    private LocalDateTime date;
    private String vitalName;
    private String vitalValue;

}

