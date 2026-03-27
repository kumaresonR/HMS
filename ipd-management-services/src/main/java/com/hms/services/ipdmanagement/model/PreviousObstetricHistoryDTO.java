package com.hms.services.ipdmanagement.model;


import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Data
public class PreviousObstetricHistoryDTO {

    private String historyId;
    private String ipdId;
    private String placeOfDelivery;
    private String durationOfPregnancy;
    private String complicationsInPregnancyOrPuerperium;
    private Double birthWeight;
    private String gender;
    private String infantFeeding;
    private String birthStatus;
    private String aliveStatus;
    private String deathCause;
    private LocalDate aliveOrDeadDate;
    private String previousMedicalHistory;
    private String specialInstruction;
//    private boolean isActive;
//    private LocalDateTime createdAt;
//    private String createdBy;
//    private String lastModifiedBy;
//    private LocalDateTime lastModifiedAt;
}

