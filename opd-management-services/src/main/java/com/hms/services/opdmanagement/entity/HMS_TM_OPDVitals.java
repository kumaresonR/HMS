package com.hms.services.opdmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Entity
@Table(name="HMS_TM_OPDVITALS")
public class HMS_TM_OPDVitals {


    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "VITALS_ID")
    private String vitalsId;

    @Column(name = "OPD_ID", nullable = false)
    private String opdId;

    @Column(name = "DATE", columnDefinition = "timestamp")
    private LocalDateTime date;

    @Column(name = "VITAL_NAME", nullable = false, length = 100)
    private String vitalName;

    @Column(name = "VITAL_VALUE", nullable = false, length = 100)
    private String vitalValue;



}

