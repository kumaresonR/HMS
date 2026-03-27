package com.hms.services.adminmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "HMS_TM_ADD_RADIOLOGY")
@Data
public class HMS_TM_AddRadiology {

    @Id
    @Column(name = "ID")
    private String id;

    @Column(name = "CATEGORY_NAME")
    private String categoryName;

    @Column(name = "AUTH_STAT")
    private String authStat;

    @Column(name = "RECORD_STAT")
    private String recordStat = "OPENED";

    @Column(name = "MOD_NO")
    private String modNo;
}



