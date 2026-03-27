package com.hms.services.bloodbankmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "HMS_TM_DONOR_DETAILS")
public class HMS_TM_DonorDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "DONOR_ID")
    private String donorId;

    @Column(name = "DONOR_NAME", length = 100, nullable = false)
    private String donorName;

    @Column(name = "DATE_OF_BIRTH")
    private LocalDate dateOfBirth;

    @Column(name = "BLOOD_GROUP", length = 10)
    private String bloodGroup;

    @Column(name = "GENDER", length = 10)
    private String gender;

    @Column(name = "FATHER_NAME", length = 100)
    private String fatherName;

    @Column(name = "CONTACT_NO", length = 15)
    private String contactNo;

    @Column(name = "ADDRESS", length = 255)
    private String address;

    @Column(name = "DELETED")
    private Boolean deleted = false;
}



