package com.hms.services.adminmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "HMS_TM_DOSE_DURATION")
public class HMS_TM_DoseDuration {

    @Id
    @Column(name = "ID")
    private String id;

    @Column(name = "DURATION")
    private String duration;

    @Column(name = "AUTH_STAT")
    private String authStat;

    @Column(name = "RECORD_STAT")
    private String recordStat = "OPENED";

    @Column(name = "MOD_NO")
    private String modNo;

}



