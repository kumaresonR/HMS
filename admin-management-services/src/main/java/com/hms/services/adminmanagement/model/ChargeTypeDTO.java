package com.hms.services.adminmanagement.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChargeTypeDTO {
    private String chargeTypeId;
    private String chargeType;
    private String modNo;
    private String authStat;
    private String recordStat;
    private boolean appointment;
    private boolean opd;
    private boolean ipd;
    private boolean pathology;
    private boolean radiology;
    private boolean bloodBank;
    private boolean ambulance;
    private boolean isActive;
    private LocalDateTime createdAt;
    private String createdBy;
    private String lastModifiedBy;
    private LocalDateTime lastModifiedAt;
}



