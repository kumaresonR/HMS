package com.hms.services.opdmanagement.model;

import lombok.Data;

@Data
public class ScheduleChargeDTO {
    private String scheduleChargeId;
    private String id; // TPAId
    private Double charge;
}

