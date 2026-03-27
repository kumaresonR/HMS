package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TW_LeaveType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TW_LeaveTypeRepository extends JpaRepository<HMS_TW_LeaveType, String> {
    Optional<HMS_TW_LeaveType> findByLeaveTypeIdAndDeletedFalse(String leaveTypeId);

    List<HMS_TW_LeaveType> findByDeletedFalse();

}




