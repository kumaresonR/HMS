//package com.hms.services.ambulancemanagement.entity;
//
//
//
//import jakarta.persistence.*;
//import lombok.Data;
//
//import java.time.LocalDateTime;
//
//
//@Data
//@Entity
//@Table(name = "HMS_TM_INCIDENT")
//public class HMS_TM_Incident {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.UUID)
//    @Column(name = "INCIDENT_ID")
//    private String incidentId;
//
//    @Column(name = "TRIP_ID", nullable = false)
//    private String tripId;
//
//    @Lob    @Column(name = "DESCRIPTION")
//    private String description;
//
//    @Column(name = "INCIDENT_TIME", columnDefinition = "timestamp",nullable = false)
//    private LocalDateTime incidentTime;
//
//    @Column(name = "LOCATION", length = 255, nullable = false)
//    private String location;
//
//    @Column(name = "STATUS", length = 20, nullable = false)
//    private String status;
//
//
//}


