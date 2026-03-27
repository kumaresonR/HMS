package com.hms.services.adminmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "HMS_TM_ADD_COMPANY")
public class HMS_TM_AddCompany {

    @Id
    @Column(name = "ID")
    private String id;

    @Column(name = "COMPANY_NAME")
    private String companyName;

    @Column(name = "COMPANY_LINK")
    private String companyLink;

    @Column(name = "AUTH_STAT")
    private String authStat;

    @Column(name = "RECORD_STAT")
    private String recordStat = "OPENED";

    @Column(name = "MOD_NO")
    private String modNo;
}




