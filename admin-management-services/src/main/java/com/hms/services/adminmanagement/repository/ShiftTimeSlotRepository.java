package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TM_ShiftTimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShiftTimeSlotRepository extends JpaRepository<HMS_TM_ShiftTimeSlot, String> {
    List<HMS_TM_ShiftTimeSlot> findByScheduleId(String scheduleId);

    List<HMS_TM_ShiftTimeSlot> findByDeletedFalse();

    List<HMS_TM_ShiftTimeSlot> findByScheduleIdAndDeletedFalse(String scheduleId);
}



