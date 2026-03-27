package com.hms.services.adminmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "HMS_TW_DOSE_DURATION")
public class HMS_TW_DoseDuration {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ID")
    private String id;

    @Column(name = "DURATION")
    private String duration;

    @Column(name = "AUTH_STAT")
    private String authStat = "UNAUTHORIZED";

    @Column(name = "RECORD_STAT")
    private String recordStat = "OPENED";

    @Column(name = "MOD_NO")
    private String modNo= "V1";

    @Column(name = "DELETED")
    private boolean deleted = false;
}



