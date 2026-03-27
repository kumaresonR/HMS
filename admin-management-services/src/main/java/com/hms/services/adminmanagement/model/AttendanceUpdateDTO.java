package com.hms.services.adminmanagement.model;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AttendanceUpdateDTO {
    private String attendanceId;
    private String staffId;
    private String name;
    private String roleId;
    private String staffAttendance;
    private LocalTime entryTime;
    private LocalTime exitTime;
    private String notes;
    private LocalDate attendanceDate;
    private String roleName;
}



