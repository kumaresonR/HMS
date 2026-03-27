package com.hms.services.billingmanagement.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "HMS_TM_MEDICINE_CATEGORY")
public class HMS_TM_MedicineCategory {

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



