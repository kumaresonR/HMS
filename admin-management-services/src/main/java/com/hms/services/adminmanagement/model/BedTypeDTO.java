package com.hms.services.adminmanagement.model;


import lombok.Data;

@Data
public class BedTypeDTO {

    private String bedTypeId;
    private String name;
    private String modNo;
    private String authStat;
    private String recordStat;
    private boolean isActive;

}



