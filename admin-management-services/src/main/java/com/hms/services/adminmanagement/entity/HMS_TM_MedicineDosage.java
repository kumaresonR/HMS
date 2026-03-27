package com.hms.services.adminmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "HMS_TM_MEDICINE_DOSAGE")
public class HMS_TM_MedicineDosage {

    @Id
    @Column(name = "ID")
    private String id;

    @Column(name = "MEDICINE_CATEGORY")
    private String medicineCategory;

    @Column(name = "DOSE")
    private String dose;

    @Column(name = "UNIT")
    private String unit;

    @Column(name = "AUTH_STAT")
    private String authStat;

    @Column(name = "RECORD_STAT")
    private String recordStat = "OPENED";

    @Column(name = "MOD_NO")
    private String modNo;

}




