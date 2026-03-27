package com.hms.services.birthdeathmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "HMS_TM_BIRTH_RECORD")
public class HMS_TM_BirthRecord {

    @Id
    @Column(name = "BIRTH_RECORD_ID")
    private String birthRecordId;

    @Column(name = "CHILD_NAME")
    private String childName;

    @Column(name = "GENDER")
    private String gender;

    @Column(name = "WEIGHT")
    private double weight;

    @Column(name = "ADDRESS")
    private String address;

    @Column(name = "PHONE")
    private String phone;

    @Column(name = "IPD_OR_OPD_ID")
    private String ipdOrOpdId;

    @Column(name = "DATE_OF_BIRTH")
    private Date dateOfBirth;

    @Column(name = "MOTHER_NAME")
    private String motherName;

    @Column(name = "FATHER_NAME")
    private String fatherName;

    @Lob
    @Column(name = "MOTHER_PHOTO", columnDefinition = "text")
    private String motherPhoto;

    @Lob
    @Column(name = "FATHER_PHOTO", columnDefinition = "text")
    private String fatherPhoto;

    @Lob
    @Column(name = "CHILD_PHOTO", columnDefinition = "text")
    private String childPhoto;

    @Column(name = "REPORT")
    private String report;

    @Lob
    @Column(name = "DOCUMENT_PHOTO", columnDefinition = "text")
    private String documentPhoto;

    @Column(name = "DELETED")
    private boolean deleted;

}



