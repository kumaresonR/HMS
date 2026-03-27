package com.hms.services.adminmanagement.repository;


import com.hms.services.adminmanagement.entity.HMS_TM_AnnualCalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnnualCalendarEventRepository extends JpaRepository<HMS_TM_AnnualCalendarEvent, String> {

    List<HMS_TM_AnnualCalendarEvent> findByDeletedFalse();

    Optional<HMS_TM_AnnualCalendarEvent> findByIdAndDeletedFalse(String id);

    List<HMS_TM_AnnualCalendarEvent> findByTypeAndDeletedFalse(String type);
}




