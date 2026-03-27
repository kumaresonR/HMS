package com.hms.services.opdmanagement.model;

import lombok.Data;

@Data
public  class TPADetailsDTO {
    private String id;
    private String tpaName;
    private String code;
    private String contactNo;
    private String address;
    private String contactPersonName;
    private String contactPersonPhone;
    private String otherDocuments;
    private String status;
    private boolean isActive;
}
