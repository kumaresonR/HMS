package com.hms.services.ipdmanagement.model;


import lombok.Data;

@Data
public class RoomsDTO {

    private String roomId;
    private String roomNumber;
    private String roomType;
    private String status;
    private Double ratePerDay;
    private boolean isActive;
}

