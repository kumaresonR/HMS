//package com.hms.services.ambulancemanagement.entity;
//
//
//import jakarta.persistence.Entity;
//import jakarta.persistence.Table;
//import lombok.Data;
//import jakarta.persistence.*;
//
//import java.math.BigDecimal;
//import java.time.LocalDateTime;
//
//@Data
//@Entity
//@Table
//public class HMS_TM_AmbulanceMaintenanceRecord {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.UUID)
//    @Column(name = "MAINTENANCE_ID")
//    private String maintenanceId;
//
//    @Column(name = "AMBULANCE_ID", nullable = false)
//    private String ambulanceId;
//
//    @Column(name = "MAINTENANCE_TYPE", length = 50, nullable = false)
//    private String maintenanceType;
//
//    @Column(name = "MAINTENANCE_DATE",columnDefinition = "timestamp", nullable = false)
//    private LocalDateTime maintenanceDate;
//
//    @Lob    @Column(name = "DESCRIPTION")
//    private String description;
//
//    @Column(name = "COST")
//    private Double cost;
//
//}


