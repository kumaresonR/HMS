package com.hms.services.adminmanagement.model;

import lombok.Data;

import java.util.List;

@Data
public class SymptomsHeadDTO {

    private String symptomsHeadId;
    private String symptomsTypeId;
    private String symptomsHead;
    private String description;
    private String modNo;
    private String authStat;
    private String recordStat;
    private boolean isActive;
    private List<SymptomsTypeDTO> SymptomsType;
}



