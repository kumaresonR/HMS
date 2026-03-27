package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TM_Timeline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TimelineRepository extends JpaRepository<HMS_TM_Timeline, String> {

    List<HMS_TM_Timeline> findByDeletedFalse();

    Optional<HMS_TM_Timeline> findByTimelineIdAndDeletedFalse(String timelineId);

    List<HMS_TM_Timeline> findByEmployeeIdAndDeletedFalse(String id);
}




