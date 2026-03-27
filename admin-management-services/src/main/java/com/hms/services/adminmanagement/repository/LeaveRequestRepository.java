package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TM_LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeaveRequestRepository extends JpaRepository<HMS_TM_LeaveRequest, String> {
    List<HMS_TM_LeaveRequest> findByEmployeeId(String employeeId);

    List<HMS_TM_LeaveRequest> findByDeletedFalse();

    List<HMS_TM_LeaveRequest> findByEmployeeIdAndDeletedFalse(String id);

    List<HMS_TM_LeaveRequest> findByEmployeeIdAndStatus(String employeeId, String approved);

    Optional<HMS_TM_LeaveRequest> findByLeaveRequestIdAndDeletedFalse(String leaveRequestId);

    List<HMS_TM_LeaveRequest> findByEmployeeIdInAndDeletedFalse(List<String> employeeIds);


    @Query("SELECT l FROM HMS_TM_LeaveRequest l " +
            "WHERE l.employeeId = :employeeId " +
            "AND l.status = 'APPROVED' " +
            "AND EXTRACT(YEAR FROM l.leaveFromDate) = :year")
    List<HMS_TM_LeaveRequest> findApprovedLeavesByEmployeeAndYear(
            @Param("employeeId") String employeeId,
            @Param("year") Integer year);


    @Query("SELECT l FROM HMS_TM_LeaveRequest l " +
            "WHERE l.employeeId = :employeeId " +
            "AND l.status = 'APPROVED' " +
            "AND EXTRACT(YEAR FROM l.leaveFromDate) = :year " +
            "AND EXTRACT(MONTH FROM l.leaveFromDate) BETWEEN :fromMonth AND :toMonth")
    List<HMS_TM_LeaveRequest> findApprovedLeavesByEmployeeAndMonthRange(
            @Param("employeeId") String employeeId,
            @Param("fromMonth") Integer fromMonth,
            @Param("toMonth") Integer toMonth,
            @Param("year") Integer year);

    @Query("SELECT l FROM HMS_TM_LeaveRequest l " +
            "WHERE l.employeeId = :employeeId " +
            "AND l.status = 'APPROVED' " +
            "AND EXTRACT(YEAR FROM l.leaveFromDate) = :year " +
            "AND EXTRACT(MONTH FROM l.leaveFromDate) = :month")
    List<HMS_TM_LeaveRequest> findApprovedLeavesByEmployeeAndSingleMonth(
            @Param("employeeId") String employeeId,
            @Param("month") Integer month,
            @Param("year") Integer year);



}



