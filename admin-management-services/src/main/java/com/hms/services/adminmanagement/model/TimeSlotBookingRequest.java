package com.hms.services.adminmanagement.model;

import lombok.Data;


@Data
public class TimeSlotBookingRequest {

    private String employeeId;
    private String scheduleId;
    private String timeSlot;
}



