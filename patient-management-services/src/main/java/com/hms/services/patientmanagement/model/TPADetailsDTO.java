package com.hms.services.patientmanagement.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TPADetailsDTO {

    private String id;
    private String tpaName;
    private String code;
    private String contactNo;
    private String address;
    private String contactPersonName;
    private String contactPersonPhone;
    private String status;
    private boolean isActive;
    private LocalDateTime createdAt;
    private String createdBy;
    private String lastModifiedBy;
    private LocalDateTime lastModifiedAt;
}

