//package com.hms.services.ambulancemanagement.entity;
//
//import jakarta.persistence.*;
//import lombok.Data;
//import java.time.LocalDateTime;
//import java.util.Date;
//
//@Data
//@Entity
//@Table
//public class HMS_TM_AmbulanceAssignment {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.UUID)
//    @Column(name = "ASSIGNMENT_ID")
//    private String assignmentId;
//
//    @Column(name = "AMBULANCE_ID", nullable = false)
//    private String ambulanceId;
//
//    @Column(name = "DRIVER_ID", nullable = false)
//    private String driverId;
//
//    @Column(name = "INCIDENT_ID")
//    private String incidentId;
//
//    @Column(name = "PATIENT_ID", nullable = false)
//    private String patientId;
//
//    @Column(name = "ASSIGNMENT_TIME",columnDefinition = "timestamp", nullable = false)
//    private LocalDateTime assignmentTime;
//
//    @Column(name = "STATUS", length = 20, nullable = false)
//    private String status;
//
//}


