package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TW_Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TW_EmployeeRepository extends JpaRepository<HMS_TW_Employee, String > {
    Optional<HMS_TW_Employee> findByEmployeeIdAndExitedFalse(String employeeId);

    @Query("SELECT MAX(e.staffId) FROM HMS_TW_Employee e")
    String findMaxStaffId();

    List<HMS_TW_Employee> findByExitedFalse();


}


