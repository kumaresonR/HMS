package com.hms.services.adminmanagement.model;

import lombok.Data;

import java.time.LocalDate;

@Data
public class LeaveRequestApplyDTO {
    private String leaveType;
    private LocalDate leaveFromDate;
    private LocalDate leaveToDate;
    private String reason;
}


