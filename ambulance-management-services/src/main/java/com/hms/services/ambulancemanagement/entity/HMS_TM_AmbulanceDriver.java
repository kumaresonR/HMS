//package com.hms.services.ambulancemanagement.entity;
//
//
//import jakarta.persistence.*;
//import lombok.Data;
//
//import java.time.LocalDate;
//
//@Data
//@Entity
//@Table(name = "HMS_TM_AMBULANCE_DRIVERS")
//public class HMS_TM_AmbulanceDriver {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.UUID)
//    @Column(name = "DRIVER_ID")
//    private String driverId;
//
//    @Column(name = "FIRST_NAME", length = 100, nullable = false)
//    private String firstName;
//
//    @Column(name = "LAST_NAME", length = 100, nullable = false)
//    private String lastName;
//
//    @Column(name = "LICENSE_NUMBER", length = 50, nullable = false)
//    private String licenseNumber;
//
//    @Column(name = "CONTACT_NUMBER", length = 15, nullable = false)
//    private String contactNumber;
//
//    @Column(name = "EMAIL", length = 100)
//    private String email;
//
//    @Column(name = "ADDRESS", length = 255)
//    private String address;
//
//    @Column(name = "HIRE_DATE",columnDefinition = "timestamp")
//    private LocalDate hireDate;
//
//
//}


