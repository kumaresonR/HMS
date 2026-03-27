package com.hms.services.opdmanagement.model;


import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class DosageDTO {

    private String dosageId;
    private String medicationId;
    private String dosage;
    private String remarks;
    private String createdBy;
    private LocalDate dosageDate;
    private LocalTime dosageTime;
    private boolean isActive;

}

