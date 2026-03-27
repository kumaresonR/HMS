package com.hms.services.ambulancemanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Entity
@Table(name="HMS_TM_ADDVEHICLE")
public class HMS_TM_AddVehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "VEHICLE_ID")
    private String vehicleId;

    @Column(name = "VEHICLE_NUMBER", nullable = false)
    private String vehicleNumber;

    @Column(name = "VEHICLE_MODEL", nullable = false)
    private String vehicleModel;

    @Column(name = "YEAR_MADE")
    private Date yearMade;

    @Column(name = "DRIVER_NAME")
    private String driverName;

    @Column(name = "DRIVER_LICENSE")
    private String driverLicense;

    @Column(name = "DRIVER_CONTACT")
    private String driverContact;

    @Column(name = "VEHICLE_TYPE", nullable = false)
    private String vehicleType;

    @Lob
    @Column(name = "NOTE", columnDefinition = "text")
    private String note;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "LAST_MODIFIED_BY")
    private String lastModifiedBy;

    @Column(name = "LAST_MODIFIED_AT")
    private LocalDateTime lastModifiedAt;

    @Column(name = "IS_ACTIVE")
    private boolean isActive;


}


