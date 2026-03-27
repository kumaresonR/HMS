package com.hms.services.adminmanagement.controller;

import com.hms.services.adminmanagement.entity.HMS_TM_LeaveRequest;
import com.hms.services.adminmanagement.model.*;
import com.hms.services.adminmanagement.service.LeaveRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/leaves")
public class LeaveRequestController {

    @Autowired
    private LeaveRequestService leaveRequestService;

    @PostMapping("/apply")
    public HMS_TM_LeaveRequest applyLeaveRequest(
            @RequestBody LeaveRequestApplyDTO leaveRequestApplyDTO,
            @RequestParam String employeeId) {

        return leaveRequestService.applyLeave(leaveRequestApplyDTO, employeeId);
    }

    @PutMapping("/{id}")
    public HMS_TM_LeaveRequest processLeaveRequest(
            @PathVariable String id,
            @RequestParam String departmentHeadId,
            @RequestParam String status) throws IllegalAccessException {

        return leaveRequestService.processLeaveRequest(id, departmentHeadId, status);
    }

//    @GetMapping("/all")
//    public List<LeaveRequestForEmployeeDTO> getAllLeaveRequestsForEmployee() {
//        return leaveRequestService.getAllLeaveRequestsForEmployee();
//    }

    @GetMapping("/all")
    public List<LeaveRequestForEmployeeDTO> getAllLeaveRequestsForEmployee(@RequestParam String approverId) {
        return leaveRequestService.getAllLeaveRequestsForEmployee(approverId);
    }

    @GetMapping("/{leaveRequestId}")
    public LeaveRequestForEmployeeDTO getLeaveRequestById(@PathVariable String leaveRequestId) {
        return leaveRequestService.getLeaveRequestById(leaveRequestId);
    }

    @GetMapping("/employee")
    public List<LeaveRequestDTO> getAllLeaveRequests(@RequestParam String employeeId) {
        return leaveRequestService.getLeaveRequestsByEmployee(employeeId);
    }

    @DeleteMapping("/remove/{leaveRequestId}")
    public ResponseEntity<String> deleteLeaveRequest(@PathVariable String leaveRequestId) {
        try {
            leaveRequestService.deleteLeaveRequest(leaveRequestId);
            return new ResponseEntity<>("Leave Request marked as deleted.", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/leave-summary/{employeeId}")
    public ResponseEntity<List<LeaveSummaryDTO>> getLeaveSummary(@PathVariable String employeeId) {
        List<LeaveSummaryDTO> leaveSummary = leaveRequestService.calculateLeaveSummary(employeeId);
        return ResponseEntity.ok(leaveSummary);
    }

    @GetMapping("/monthly/leave-summary")
    public ResponseEntity<Map<String, Object>> getLeaveSummary(
            @RequestParam(required = false) String roleId,
            @RequestParam(required = false) String fromMonth,
            @RequestParam(required = false) String toMonth,
            @RequestParam(required = false) String year,
            @RequestParam(required = false) String staffId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<EmployeeLeaveSummaryDTO> leaveSummaries = leaveRequestService.calculateLeaveSummaries(
                roleId, fromMonth, toMonth, year, staffId, page, size);

        Map<String, Object> response = new HashMap<>();
        response.put("totalRecords", leaveSummaries.getTotalElements());
        response.put("totalPages", leaveSummaries.getTotalPages());
        response.put("currentPage", leaveSummaries.getNumber());
        response.put("leaveSummaries", leaveSummaries.getContent());

        return ResponseEntity.ok(response);
    }





}



