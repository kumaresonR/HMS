package com.hms.services.adminmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "HMS_TW_ADD_COMPANY")
public class HMS_TW_AddCompany {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ID")
    private String id;

    @Column(name = "COMPANY_NAME")
    private String companyName;

    @Column(name = "COMPANY_LINK")
    private String companyLink;

    @Column(name = "AUTH_STAT")
    private String authStat = "UNAUTHORIZED";

    @Column(name = "RECORD_STAT")
    private String recordStat = "OPENED";

    @Column(name = "MOD_NO")
    private String modNo = "V1";

    @Column(name = "DELETED")
    private boolean deleted = false;
}




