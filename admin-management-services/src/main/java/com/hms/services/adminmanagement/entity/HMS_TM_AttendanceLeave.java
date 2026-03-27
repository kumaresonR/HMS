package com.hms.services.adminmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Entity
@Table(name = "HMS_TM_ATTENDANCE_LEAVE")
public class HMS_TM_AttendanceLeave {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ATTENDANCE_ID")
    private String attendanceId;

    @Column(name = "STAFF_ID", length = 10, nullable = false)
    private String staffId;

    @Column(name = "NAME", nullable = false)
    private String name;

    @Column(name = "ROLE", nullable = false)
    private String roleId;

    @Column(name = "STAFF_ATTENDANCE", nullable = false)
    private String staffAttendance;

    @Column(name = "ENTRY_TIME")
    private LocalTime entryTime;

    @Column(name = "EXIT_TIME")
    private LocalTime exitTime;

    @Column(name = "NOTES")
    private String notes;

    @Column(name = "YEAR")
    private String year;

    @Column(name = "MONTH")
    private String month;

    @Column(name = "ATTENDANCE_DATE")
    private LocalDate attendanceDate;

}




