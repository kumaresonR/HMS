package com.hms.services.adminmanagement.model;

import jakarta.persistence.Column;
import lombok.Data;

@Data
public class BedGroupDTO {

    private String bedGroupId;
    private String name;
    private String floorId;
    private String description;
    private String modNo;
    private String authStat;
    private String recordStat;
    private boolean isActive;
    private FloorDTO floor;

}



