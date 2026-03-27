package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TM_AttendanceLeave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


@Repository
public interface AttendanceRepository extends JpaRepository<HMS_TM_AttendanceLeave, String> {

    @Query("SELECT a FROM HMS_TM_AttendanceLeave a WHERE CAST(a.year AS STRING) = :year AND a.month = :month AND a.staffId = :staffId")
    List<HMS_TM_AttendanceLeave> findByYearAndMonthAndEmployeeId(
            @Param("year") String year,
            @Param("month") String month,
            @Param("staffId") String staffId
    );

    List <HMS_TM_AttendanceLeave> findByStaffId(String staffId);

    List<HMS_TM_AttendanceLeave> findByStaffIdAndAttendanceDate(String staffId, LocalDate currentDate);
}




