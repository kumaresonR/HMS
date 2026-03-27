package com.hms.services.adminmanagement.controller;

import com.hms.services.adminmanagement.entity.HMS_TM_AttendanceLeave;
import com.hms.services.adminmanagement.model.AttendanceUpdateDTO;
import com.hms.services.adminmanagement.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @GetMapping("/employees")
    public List<AttendanceUpdateDTO> getEmployeesByRoleAndDate(
            @RequestParam(required = false) String roleId,
            @RequestParam(required = false) String attendanceDate) {

        return attendanceService.getEmployeesByRoleAndDate(roleId, attendanceDate);
    }

    @PostMapping("/save")
    public ResponseEntity<List<HMS_TM_AttendanceLeave>> saveAttendance(
            @RequestBody List<HMS_TM_AttendanceLeave> attendanceRequests,
            @RequestParam(required = false) String roleId,
            @RequestParam(required = false) String attendanceType) {

        List<HMS_TM_AttendanceLeave> savedAttendance = attendanceService.saveAttendance(attendanceRequests, roleId, attendanceType);
        return new ResponseEntity<>(savedAttendance, HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<List<HMS_TM_AttendanceLeave>> getAllAttendance() {
        List<HMS_TM_AttendanceLeave> attendanceList = attendanceService.getAllAttendance();
        return new ResponseEntity<>(attendanceList, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HMS_TM_AttendanceLeave> getAttendanceById(@PathVariable String id) {
        HMS_TM_AttendanceLeave attendance = attendanceService.getAttendanceById(id);
        if (attendance != null) {
            return new ResponseEntity<>(attendance, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<List<HMS_TM_AttendanceLeave>> updateAttendance(
            @RequestBody List<HMS_TM_AttendanceLeave> attendanceRequests) {

        List<HMS_TM_AttendanceLeave> updatedAttendances = attendanceService.updateAttendance(attendanceRequests);
        if (!updatedAttendances.isEmpty()) {
            return new ResponseEntity<>(updatedAttendances, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}





