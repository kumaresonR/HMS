package com.hms.services.ipdmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Data
@Entity
@Table(name = "HMS_TM_PREVIOUS_OBSTETRIC_HISTORY", schema = "ipd")
public class HMS_TM_PreviousObstetricHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "HISTORY_ID")
    private String historyId;

    @Column(name = "IPD_ID")
    private String ipdId;

    @Column(name = "PLACE_OF_DELIVERY", nullable = false)
    private String placeOfDelivery;

    @Column(name = "DURATION_OF_PREGNANCY", nullable = false)
    private String durationOfPregnancy;

    @Column(name = "COMPLICATIONS_IN_PREGNANCY_OR_PUERPERIUM")
    private String complicationsInPregnancyOrPuerperium;

    @Column(name = "BIRTH_WEIGHT")
    private Double birthWeight;

    @Column(name = "GENDER")
    private String gender;

    @Column(name = "INFANT_FEEDING")
    private String infantFeeding;

    @Column(name = "BIRTH_STATUS")
    private String birthStatus;

    @Column(name = "ALIVE_STATUS")
    private String aliveStatus;

    @Column(name = "DEATH_CAUSE")
    private String deathCause;

    @Column(name = "ALIVE_OR_DEAD_DATE")
    private LocalDate aliveOrDeadDate;

    @Lob
    @Column(name = "PREVIOUS_MEDICAL_HISTORY", columnDefinition = "text")
    private String previousMedicalHistory;

    @Lob
    @Column(name = "SPECIAL_INSTRUCTION", columnDefinition = "text")
    private String specialInstruction;

    @Column(name = "IS_ACTIVE")
    private boolean isActive;

    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "LAST_MODIFIED_BY")
    private String lastModifiedBy;

    @Column(name = "LAST_MODIFIED_AT")
    private LocalDateTime lastModifiedAt;
}

