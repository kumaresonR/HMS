package com.hms.services.birthdeathmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Entity
@Table(name = "HMS_TM_DEATH_RECORD")
public class HMS_TM_DeathRecord {

    @Id
    @Column(name = "DEATH_ID")
    private String deathId;

    @Column(name = "IPD_OR_OPD_ID")
    private String ipdOrOpdId;

    @Column(name = "PATIENT_NAME")
    private String patientName;

    @Column(name = "DATE_OF_DEATH")
    private Date dateOfDeath;

    @Column(name = "GUARDIAN_NAME")
    private String guardianName;

    @Lob
    @Column(name = "ATTACHMENT", columnDefinition = "text")
    private String attachment;

    @Column(name = "REPORT")
    private String report;

    @Column(name = "DELETED")
    private boolean deleted = false;
}


