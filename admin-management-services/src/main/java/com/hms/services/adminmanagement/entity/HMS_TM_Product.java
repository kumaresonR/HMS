package com.hms.services.adminmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "HMS_TM_PRODUCT")
@Data
public class HMS_TM_Product {

    @Id
    @Column(name = "ID")
    private String id;

    @Column(name = "NAME")
    private String name;

    @Column(name = "TYPE")
    private String type;

    @Column(name = "AUTH_STAT")
    private String authStat;

    @Column(name = "RECORD_STAT")
    private String recordStat = "OPENED";

    @Column(name = "MOD_NO")
    private String modNo;

}


