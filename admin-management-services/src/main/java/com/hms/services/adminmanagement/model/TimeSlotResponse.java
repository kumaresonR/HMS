package com.hms.services.adminmanagement.model;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class TimeSlotResponse {

    private String timeSlotId;
    private String scheduleId;
    private String timeSlot;
    private String status;
    private String employeeId;
    private String doctorName;
    private String shiftType;
    private LocalDate shiftDate;
    private LocalTime startTime;
    private LocalTime endTime;
}



