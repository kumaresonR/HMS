package com.hms.services.adminmanagement.model;

import com.hms.services.adminmanagement.entity.HMS_TM_Employee;
import com.hms.services.adminmanagement.entity.HMS_TM_ShiftSchedule;
import com.hms.services.adminmanagement.entity.HMS_TM_ShiftTimeSlot;
import lombok.Data;

import java.util.List;

@Data
public class DoctorDetailsDTO {
    private HMS_TM_Employee employee;
    private List<HMS_TM_ShiftSchedule> shifts;
    private List<HMS_TM_ShiftTimeSlot> shiftTimeSlots;
}


