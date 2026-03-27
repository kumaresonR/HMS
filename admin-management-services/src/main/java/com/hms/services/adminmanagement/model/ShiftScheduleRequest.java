package com.hms.services.adminmanagement.model;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class ShiftScheduleRequest {
    private String employeeId;
    private String doctorName;
    private List<ShiftDay> shifts;

    @Data
    public static class ShiftDay {
        private String repeatDays;
        private LocalDate shiftDate;
        private LocalTime startTime;
        private LocalTime endTime;
        private String shiftType;
        private String durationMinutes;
    }
}



