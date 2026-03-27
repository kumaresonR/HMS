package com.hms.services.patientmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "HMS_TM_EMERGENCY_CONTACTS")
public class HMS_TM_EmergencyContacts {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "EMERGENCY_CONTACT_ID")
    private String emergencyContactId;

    @Column(name = "PATIENT_ID")
    private String patientId;

    @Column(name = "CONTACT_NAME")
    private String contactName;

    @Column(name = "RELATIONSHIP")
    private String relationShip;

    @Column(name = "CONTACT_NUMBER")
    private String contactNumber;

    @Column(name = "IS_ACTIVE")
    private Boolean isActive;
}
