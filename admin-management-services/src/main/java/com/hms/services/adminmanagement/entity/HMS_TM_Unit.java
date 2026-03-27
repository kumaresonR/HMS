package com.hms.services.adminmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "HMS_TM_UNIT")
public class HMS_TM_Unit {

    @Id
    @Column(name = "ID")
    private String id;

    @Column(name = "UNIT_NAME")
    private String unitName;

    @Column(name = "AUTH_STAT")
    private String authStat;

    @Column(name = "RECORD_STAT")
    private String recordStat = "OPENED";

    @Column(name = "MOD_NO")
    private String modNo;
}



