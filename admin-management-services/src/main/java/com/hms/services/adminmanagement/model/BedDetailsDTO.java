package com.hms.services.adminmanagement.model;


import jakarta.persistence.Column;
import lombok.Data;

@Data
public class BedDetailsDTO {


    private String bedDetailsId;
    private String name;
    private String bedTypeId;
    private String bedGroupId;
    private String modNo;
    private String authStat;
    private String recordStat;
    private boolean roomStatus;
    private boolean isActive;
    private boolean notAvailable;
    private String status;
    private BedTypeDTO bedType;
    private BedGroupDTO bedGroup;


}



