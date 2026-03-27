package com.hms.services.adminmanagement.model;

import com.hms.services.adminmanagement.entity.HMS_TM_Employee;
import com.hms.services.adminmanagement.entity.HMS_TM_LeaveRequest;
import lombok.Data;

import java.time.LocalDate;

@Data
public class LeaveRequestForEmployeeDTO {

    private String leaveRequestId;
    private String leaveType;
    private String approverId;
    private LocalDate leaveFromDate;
    private LocalDate leaveToDate;
    private String reason;
    private String status;
    private LocalDate applyDate;
    private Boolean deleted;
    private HMS_TM_Employee employeeDetails;
    private String roleNameWithStaffId;
    private long leaveDays;

    public LeaveRequestForEmployeeDTO(HMS_TM_LeaveRequest leaveRequest, HMS_TM_Employee employeeDetails, String roleNameWithStaffId ,long leaveDays) {
        this.leaveRequestId = leaveRequest.getLeaveRequestId();
        this.leaveType = leaveRequest.getLeaveType();
        this.approverId = leaveRequest.getApproverId();
        this.leaveFromDate = leaveRequest.getLeaveFromDate();
        this.leaveToDate = leaveRequest.getLeaveToDate();
        this.reason = leaveRequest.getReason();
        this.status = leaveRequest.getStatus();
        this.applyDate = leaveRequest.getApplyDate();
        this.deleted = leaveRequest.getDeleted();
        this.employeeDetails = employeeDetails;
        this.roleNameWithStaffId = roleNameWithStaffId;
        this.leaveDays = leaveDays;
    }
}



