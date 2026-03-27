package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TM_ShiftSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShiftRepository extends JpaRepository<HMS_TM_ShiftSchedule, String> {
    List<HMS_TM_ShiftSchedule> findByEmployeeId(String employeeId);
    List<HMS_TM_ShiftSchedule> findByEmployeeIdAndDeletedFalse(String employeeId);
}



