package com.hms.services.ipdmanagement.model;

import lombok.Data;

@Data
public class ScheduleChargeDTO {
    private String scheduleChargeId;
    private String id; // TPAId
    private Double charge;

}

