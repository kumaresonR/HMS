package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_Employee;
import com.hms.services.adminmanagement.entity.HMS_TM_ShiftSchedule;
import com.hms.services.adminmanagement.entity.HMS_TM_ShiftTimeSlot;
import com.hms.services.adminmanagement.model.DoctorDetailsDTO;
import com.hms.services.adminmanagement.model.ShiftScheduleRequest;
import com.hms.services.adminmanagement.model.TimeSlotBookingRequest;
import com.hms.services.adminmanagement.model.TimeSlotResponse;
import com.hms.services.adminmanagement.repository.HMS_TM_EmployeeRepository;
import com.hms.services.adminmanagement.repository.ShiftRepository;
import com.hms.services.adminmanagement.repository.ShiftTimeSlotRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShiftService {

    @Autowired
    private ShiftRepository shiftRepository;

    @Autowired
    private HMS_TM_EmployeeRepository hmsTmEmployeeRepository;

    @Autowired
    private ShiftTimeSlotRepository shiftTimeSlotRepository;

    public DoctorDetailsDTO getDoctorDetails(String employeeId) {
        HMS_TM_Employee employee = hmsTmEmployeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        List<HMS_TM_ShiftSchedule> shifts = shiftRepository.findByEmployeeIdAndDeletedFalse(employeeId);

        List<HMS_TM_ShiftTimeSlot> shiftTimeSlots = shifts.stream()
                .map(shift -> shiftTimeSlotRepository.findByScheduleIdAndDeletedFalse(shift.getScheduleId()))
                .flatMap(List::stream)
                .collect(Collectors.toList());

        DoctorDetailsDTO response = new DoctorDetailsDTO();
        response.setEmployee(employee);
        response.setShifts(shifts);
        response.setShiftTimeSlots(shiftTimeSlots);

        return response;
    }

    public List<HMS_TM_ShiftSchedule> createShiftSchedules(List<ShiftScheduleRequest> shiftScheduleRequests) {
        List<HMS_TM_ShiftSchedule> shiftSchedules = new ArrayList<>();

        for (ShiftScheduleRequest request : shiftScheduleRequests) {
            for (ShiftScheduleRequest.ShiftDay shiftDay : request.getShifts()) {
                HMS_TM_ShiftSchedule schedule = new HMS_TM_ShiftSchedule();
                schedule.setEmployeeId(request.getEmployeeId());
                schedule.setDoctorName(request.getDoctorName());
                schedule.setRepeatDays(shiftDay.getRepeatDays());
                schedule.setShiftDate(shiftDay.getShiftDate());
                schedule.setStartTime(shiftDay.getStartTime());
                schedule.setEndTime(shiftDay.getEndTime());
                schedule.setShiftType(shiftDay.getShiftType());
                schedule.setDurationMinutes(shiftDay.getDurationMinutes());

                shiftSchedules.add(schedule);
            }
        }
        return shiftRepository.saveAll(shiftSchedules);
    }

    public HMS_TM_ShiftTimeSlot bookTimeSlot(TimeSlotBookingRequest bookingRequest) {
        HMS_TM_ShiftSchedule shiftSchedule = shiftRepository.findById(bookingRequest.getScheduleId())
                .orElseThrow(() -> new RuntimeException("Shift schedule not found"));

        HMS_TM_ShiftTimeSlot timeSlot = new HMS_TM_ShiftTimeSlot();
        timeSlot.setScheduleId(shiftSchedule.getScheduleId());
        timeSlot.setTimeSlot(bookingRequest.getTimeSlot());
        timeSlot.setStatus("Booked");

        return shiftTimeSlotRepository.save(timeSlot);
    }

    public List<HMS_TM_ShiftTimeSlot> getAllBookedTimeSlots() {
        return shiftTimeSlotRepository.findByDeletedFalse();
    }

    public List<TimeSlotResponse> getTimeSlotDetailsByScheduleId(String scheduleId) {
        List<HMS_TM_ShiftTimeSlot> timeSlots = shiftTimeSlotRepository.findByScheduleId(scheduleId);

        HMS_TM_ShiftSchedule shiftSchedule = shiftRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Shift schedule not found"));

        return timeSlots.stream().map(timeSlot -> {
            TimeSlotResponse response = new TimeSlotResponse();
            response.setTimeSlotId(timeSlot.getTimeSlotId());
            response.setScheduleId(timeSlot.getScheduleId());
            response.setTimeSlot(timeSlot.getTimeSlot());
            response.setStatus(timeSlot.getStatus());
            response.setEmployeeId(shiftSchedule.getEmployeeId());
            response.setDoctorName(shiftSchedule.getDoctorName());
            response.setShiftType(shiftSchedule.getShiftType());
            response.setShiftDate(shiftSchedule.getShiftDate());
            response.setStartTime(shiftSchedule.getStartTime());
            response.setEndTime(shiftSchedule.getEndTime());
            return response;
        }).collect(Collectors.toList());
    }

    public List<HMS_TM_ShiftSchedule> updateShiftSchedules(List<HMS_TM_ShiftSchedule> shiftSchedules) {
        List<HMS_TM_ShiftSchedule> updatedSchedules = new ArrayList<>();

        for (HMS_TM_ShiftSchedule schedule : shiftSchedules) {
            HMS_TM_ShiftSchedule existingSchedule = shiftRepository.findById(schedule.getScheduleId())
                    .orElseThrow(() -> new EntityNotFoundException("Shift schedule not found with id: " + schedule.getScheduleId()));

            existingSchedule.setEmployeeId(schedule.getEmployeeId());
            existingSchedule.setDoctorName(schedule.getDoctorName());
            existingSchedule.setRepeatDays(schedule.getRepeatDays());
            existingSchedule.setShiftDate(schedule.getShiftDate());
            existingSchedule.setStartTime(schedule.getStartTime());
            existingSchedule.setEndTime(schedule.getEndTime());
            existingSchedule.setShiftType(schedule.getShiftType());
            existingSchedule.setDurationMinutes(schedule.getDurationMinutes());
            existingSchedule.setDeleted(schedule.getDeleted());

            updatedSchedules.add(existingSchedule);
        }

        return shiftRepository.saveAll(updatedSchedules);
    }

    public void deleteTimeSlot(String timeSlotId) {
        HMS_TM_ShiftTimeSlot timeSlot = shiftTimeSlotRepository.findById(timeSlotId)
                .orElseThrow(() -> new RuntimeException("Time slot not found"));

        timeSlot.setDeleted(true);
        shiftTimeSlotRepository.save(timeSlot);
    }

    public void deleteShiftSchedule(String scheduleId) {
        HMS_TM_ShiftSchedule schedule = shiftRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Shift schedule not found"));
        schedule.setDeleted(true);
        shiftRepository.save(schedule);
    }
}



