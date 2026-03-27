package com.hms.services.adminmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "HMS_TM_SUPPLIER")
public class HMS_TM_Supplier {

    @Id
    @Column(name = "SUPPLIER_ID")
    private String supplierId;

    @Column(name = "SUPPLIER_NAME")
    private String supplierName;

    @Column(name = "SUPPLIER_CONTACT")
    private String supplierContact;

    @Column(name = "CONTACT_PERSON_NAME")
    private String contactPersonName;

    @Column(name = "CONTACT_PERSON_PHONE")
    private String contactPersonPhone;

    @Column(name = "DRUG_LICENCE_NUMBER")
    private String drugLicenceNumber;

    @Column(name = "ADDRESS")
    private String address;

    @Column(name = "AUTH_STAT")
    private String authStat;

    @Column(name = "RECORD_STAT")
    private String recordStat = "OPENED";

    @Column(name = "MOD_NO")
    private String modNo;
}




