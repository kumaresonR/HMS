package com.hms.services.adminmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "HMS_TM_ADD_MEDICINE_GROUP")
public class HMS_TM_AddMedicineGroup {

    @Id
    @Column(name = "ID")
    private String id;

    @Column(name = "MEDICINE_GROUP_NAME")
    private String medicineGroupName;

    @Column(name = "AUTH_STAT")
    private String authStat;

    @Column(name = "RECORD_STAT")
    private String recordStat = "OPENED";

    @Column(name = "MOD_NO")
    private String modNo;
}




