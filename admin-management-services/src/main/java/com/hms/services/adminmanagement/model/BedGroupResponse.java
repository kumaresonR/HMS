package com.hms.services.adminmanagement.model;

import lombok.Data;

@Data
public class BedGroupResponse {

    private String bedGroupId;
    private String name;

    // Constructor matching the query fields
    public BedGroupResponse(String bedGroupId, String name) {
        this.bedGroupId = bedGroupId;
        this.name = name;
    }

}



