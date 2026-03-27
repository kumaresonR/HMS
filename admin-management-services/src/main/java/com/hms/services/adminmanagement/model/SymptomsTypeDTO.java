package com.hms.services.adminmanagement.model;

import lombok.Data;

@Data
public class SymptomsTypeDTO {

    private String symptomsTypeId;
    private String symptomsType;
    private String modNo;
    private String authStat;
    private String recordStat;
    private boolean isActive;
}



