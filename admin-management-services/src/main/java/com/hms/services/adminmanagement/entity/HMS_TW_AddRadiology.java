package com.hms.services.adminmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "HMS_TW_ADD_RADIOLOGY")
@Data
public class HMS_TW_AddRadiology {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ID")
    private String id;

    @Column(name = "CATEGORY_NAME")
    private String categoryName;

    @Column(name = "AUTH_STAT")
    private String authStat = "UNAUTHORIZED";

    @Column(name = "RECORD_STAT")
    private String recordStat = "OPENED";

    @Column(name = "MOD_NO")
    private String modNo= "V1";

    @Column(name = "DELETED")
    private boolean deleted = false;

}




