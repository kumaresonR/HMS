package com.hms.services.adminmanagement.model;

import lombok.Data;

@Data
public class BedGroupFloorDTO {

    private String bedGroupId;
    private String bedGroupName;
    private String bedGroupDescription;
    private String modNo;
    private String authStat;
    private String recordStat;
    private boolean isActive;
    private FloorDTO floor;

}



