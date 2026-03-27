package com.hms.services.adminmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "HMS_TW_RADIOLOGY_UNIT")
@Data
public class HMS_TW_RadiologyUnit {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ID")
    private String id;

    @Column(name = "UNIT_NAME")
    private String unitName;

    @Column(name = "AUTH_STAT")
    private String authStat = "UNAUTHORIZED";

    @Column(name = "RECORD_STAT")
    private String recordStat = "OPENED";

    @Column(name = "MOD_NO")
    private String modNo= "V1";

    @Column(name = "DELETED")
    private boolean deleted = false;
}




