//package com.hms.services.ambulancemanagement.entity;
//
//import jakarta.persistence.*;
//import lombok.Data;
//
//import java.time.LocalDateTime;
//import java.time.Year;
//
//
//@Data
//@Entity
//@Table(name = "HMS_TM_AMBULANCE_FLEET")
//public class HMS_TM_AmbulanceFleet {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.UUID)
//    @Column(name = "AMBULANCE_ID")
//    private String ambulanceId;
//
//    @Column(name = "VEHICLE_NUMBER", length = 20, nullable = false)
//    private String vehicleNumber;
//
//    @Column(name = "VEHICLE_MODEL", length = 100, nullable = false)
//    private String vehicleModel;
//
//    @Column(name = "VEHICLE_TYPE", length = 100, nullable = false)
//    private String vehicleType;
//
//    @Column(name = "MANUFACTURE_YEAR", nullable = false)
//    private Integer manufactureYear;
//
//    @Column(name = "STATUS", length = 20, nullable = false)
//    private String status;
//
//    @Column(name = "LAST_SERVICE_DATE",columnDefinition = "timestamp")
//    private LocalDateTime lastServiceDate;
//
//
//
//}


