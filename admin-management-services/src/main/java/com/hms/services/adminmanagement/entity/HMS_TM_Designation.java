package com.hms.services.adminmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "HMS_TM_DESIGNATION")
public class HMS_TM_Designation {

    @Id
    @Column(name = "DESIGNATION_ID")
    private String designationId;

    @Column(name = "NAME")
    private String name;

    @Column(name = "AUTH_STAT")
    private String authStat;

    @Column(name = "RECORD_STAT")
    private String recordStat = "OPENED";

    @Column(name = "MOD_NO")
    private String modNo;

}




