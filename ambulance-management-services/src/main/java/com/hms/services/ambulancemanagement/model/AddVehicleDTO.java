package com.hms.services.ambulancemanagement.model;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
public class AddVehicleDTO {

    private String vehicleId;
    private String vehicleNumber;
    private String vehicleModel;
    private Date yearMade;
    private String driverName;
    private String driverLicense;
    private String driverContact;
    private String vehicleType;
    private String note;
    private LocalDateTime createdAt;
    private String createdBy;
    private String lastModifiedBy;
    private LocalDateTime lastModifiedAt;
    private boolean isActive;

}


