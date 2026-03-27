package com.hms.services.adminmanagement.model;

import lombok.Data;

@Data
public class FloorDTO {

    private String floorId;
    private String floorName;
    private String floorDescription;
    private String modNo;
    private String authStat;
    private String recordStat;
    private boolean isActive;
}



