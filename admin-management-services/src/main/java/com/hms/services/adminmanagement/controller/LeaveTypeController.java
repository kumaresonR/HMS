package com.hms.services.adminmanagement.controller;

import com.hms.services.adminmanagement.entity.HMS_TM_LeaveType;
import com.hms.services.adminmanagement.entity.HMS_TW_LeaveType;
import com.hms.services.adminmanagement.service.LeaveTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;


@RestController
@RequestMapping("/leave-type")
public class LeaveTypeController {

    @Autowired
    private LeaveTypeService leaveTypeService;

    @PostMapping("/create")
    public ResponseEntity<HMS_TW_LeaveType> createLeaveType(@Valid @RequestBody HMS_TW_LeaveType leaveType) {
        HMS_TW_LeaveType createdLeaveType = leaveTypeService.createLeaveType(leaveType);
        return new ResponseEntity<>(createdLeaveType, HttpStatus.CREATED);
    }

    @GetMapping("/tw/{id}")
    public ResponseEntity<HMS_TW_LeaveType> getLeaveTypeById(@PathVariable String id) {
        try {
            HMS_TW_LeaveType leaveType = leaveTypeService.getLeaveTypeById(id);
            return ResponseEntity.ok(leaveType);
        } catch (RuntimeException e) {
            return ResponseEntity.ok().build();
        }
    }

    @GetMapping("/tw/all")
    public ResponseEntity<List<HMS_TW_LeaveType>> getAllLeaveTypesTW() {
        List<HMS_TW_LeaveType> leaveTypes = leaveTypeService.getAllLeaveTypesTW();
        return ResponseEntity.ok(leaveTypes);
    }

    @PutMapping("/tw/update/{id}")
    public ResponseEntity<HMS_TW_LeaveType> updateLeaveType(
            @PathVariable String id, @Valid @RequestBody HMS_TW_LeaveType updatedLeaveType) {
        HMS_TW_LeaveType updatedType = leaveTypeService.updateLeaveType(id, updatedLeaveType);
        return new ResponseEntity<>(updatedType, HttpStatus.OK);
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<HMS_TM_LeaveType> approveLeaveType(
            @PathVariable String id) {
        HMS_TM_LeaveType approvedLeaveType = leaveTypeService.approveLeaveType(id);
        return new ResponseEntity<>(approvedLeaveType, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteLeaveType(
            @PathVariable String id,
            @RequestParam String authStat) {
        try {
            leaveTypeService.deleteLeaveType(id, authStat);
            return ResponseEntity.ok("Leave type deleted from TM and status updated to UNAUTHORIZED in TW.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Leave type not found or cannot be deleted.");
        }
    }

    @GetMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_LeaveType> getLeaveTypeByIds(@PathVariable String id) {
        HMS_TM_LeaveType leaveType = leaveTypeService.getLeaveTypeByIds(id);
        return new ResponseEntity<>(leaveType, HttpStatus.OK);
    }

    @GetMapping("/tm/all")
    public ResponseEntity<List<HMS_TM_LeaveType>> getAllLeaveTypesTM() {
        List<HMS_TM_LeaveType> leaveTypes = leaveTypeService.getAllLeaveTypesTM();
        return new ResponseEntity<>(leaveTypes, HttpStatus.OK);
    }

    @PutMapping("/tm/update/{id}")
    public ResponseEntity<HMS_TM_LeaveType> updateLeaveType(
            @PathVariable String id, @Valid @RequestBody HMS_TM_LeaveType updatedLeaveType) {
        HMS_TM_LeaveType updatedType = leaveTypeService.updateLeaveType(id, updatedLeaveType);
        return new ResponseEntity<>(updatedType, HttpStatus.OK);
    }

    @DeleteMapping("/tw/{id}/delete")
    public ResponseEntity<Void> deleteTwLeaveType(@PathVariable String id) {
        leaveTypeService.deleteTwLeaveType(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}




