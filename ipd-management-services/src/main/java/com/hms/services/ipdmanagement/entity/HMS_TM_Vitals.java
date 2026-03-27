package com.hms.services.ipdmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name="HMS_TM_VITALS", schema = "ipd")
public class HMS_TM_Vitals {


    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "VITALS_ID")
    private String vitalsId;

    @Column(name = "IPD_ID", nullable = false)
    private String ipdId;

    @Column(name = "DATE", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date date;

    @Column(name = "VITAL_NAME", nullable = false, length = 100)
    private String vitalName;

    @Column(name = "VITAL_VALUE", nullable = false, length = 100)
    private String vitalValue;



}

