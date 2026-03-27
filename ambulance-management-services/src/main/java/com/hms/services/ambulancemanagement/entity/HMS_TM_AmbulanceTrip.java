//package com.hms.services.ambulancemanagement.entity;
//
//
//import jakarta.persistence.*;
//import lombok.Data;
//
//import java.time.LocalDateTime;
//
//@Data
//@Entity
//@Table
//public class HMS_TM_AmbulanceTrip {
//
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.UUID)
//    @Column(name = "TRIP_ID")
//    private String tripId;
//
//    @Column(name = "AMBULANCE_ID", nullable = false)
//    private String ambulanceId;
//
//    @Column(name = "DRIVER_ID", nullable = false)
//    private String driverId;
//
//    @Column(name = "START_TIME",columnDefinition = "timestamp", nullable = false)
//    private LocalDateTime startTime;
//
//    @Column(name = "END_TIME",columnDefinition = "timestamp")
//    private LocalDateTime endTime;
//
//    @Column(name = "START_LOCATION", length = 255, nullable = false)
//    private String startLocation;
//
//    @Column(name = "END_LOCATION", length = 255)
//    private String endLocation;
//
//    @Column(name = "DISTANCE")
//    private Double distance;
//
//
//}


