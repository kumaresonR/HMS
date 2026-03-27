package com.hms.services.adminmanagement.controller;

import com.hms.services.adminmanagement.entity.HMS_TM_ShiftSchedule;
import com.hms.services.adminmanagement.entity.HMS_TM_ShiftTimeSlot;
import com.hms.services.adminmanagement.model.DoctorDetailsDTO;
import com.hms.services.adminmanagement.model.ShiftScheduleRequest;
import com.hms.services.adminmanagement.model.TimeSlotBookingRequest;
import com.hms.services.adminmanagement.model.TimeSlotResponse;
import com.hms.services.adminmanagement.repository.ShiftRepository;
import com.hms.services.adminmanagement.service.ShiftService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;


@RestController
@RequestMapping("/shifts")
public class ShiftController {

    @Autowired
    private ShiftService shiftService;

    @Autowired
    private ShiftRepository shiftRepository;

    @GetMapping("/{employeeId}")
    public ResponseEntity<DoctorDetailsDTO> getDoctorDetails(@PathVariable String employeeId) {
        try {
            DoctorDetailsDTO response = shiftService.getDoctorDetails(employeeId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<List<HMS_TM_ShiftSchedule>> createShiftSchedules(@Valid @RequestBody List<ShiftScheduleRequest> shiftScheduleRequests) {
        List<HMS_TM_ShiftSchedule> savedShiftSchedules = shiftService.createShiftSchedules(shiftScheduleRequests);
        return ResponseEntity.ok(savedShiftSchedules);
    }

    @PostMapping("/bookTimeSlot")
    public ResponseEntity<HMS_TM_ShiftTimeSlot> bookTimeSlot(@Valid @RequestBody TimeSlotBookingRequest bookingRequest) {
        HMS_TM_ShiftTimeSlot savedTimeSlot = shiftService.bookTimeSlot(bookingRequest);
        return ResponseEntity.ok(savedTimeSlot);
    }

    @GetMapping("/timeSlots")
    public ResponseEntity<List<HMS_TM_ShiftTimeSlot>> getAllBookedTimeSlots() {
        List<HMS_TM_ShiftTimeSlot> timeSlots = shiftService.getAllBookedTimeSlots();
        return ResponseEntity.ok(timeSlots);
    }

    @GetMapping("/getTimeSlotBySchedule/{scheduleId}")
    public ResponseEntity<List<TimeSlotResponse>> getTimeSlotDetailsByScheduleId(@PathVariable String scheduleId) {
        List<TimeSlotResponse> timeSlotResponses = shiftService.getTimeSlotDetailsByScheduleId(scheduleId);
        return ResponseEntity.ok(timeSlotResponses);
    }

    @PutMapping("/update")
    public ResponseEntity<List<HMS_TM_ShiftSchedule>> updateShiftSchedules(
            @Valid @RequestBody List<HMS_TM_ShiftSchedule> shiftSchedules) {
        try {
            List<HMS_TM_ShiftSchedule> updatedSchedules = shiftService.updateShiftSchedules(shiftSchedules);
            return ResponseEntity.ok(updatedSchedules);
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/{timeSlotId}")
    public ResponseEntity<String> deleteTimeSlot(@PathVariable String timeSlotId) {
        try {
            shiftService.deleteTimeSlot(timeSlotId);
            return ResponseEntity.ok("Time slot deleted successfully.");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Time slot not found or cannot be deleted.");
        }
    }

    @DeleteMapping("/deleteSchedule/{scheduleId}")
    public ResponseEntity<String> deleteShiftSchedule(@PathVariable String scheduleId) {
        shiftService.deleteShiftSchedule(scheduleId);
        return ResponseEntity.ok("Shift schedule marked as exited");
    }
}


