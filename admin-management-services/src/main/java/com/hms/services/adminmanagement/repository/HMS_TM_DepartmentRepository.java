package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TM_Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HMS_TM_DepartmentRepository extends JpaRepository<HMS_TM_Department, String> {
    HMS_TM_Department findByDepartmentId(String departmentId);

    HMS_TM_Department findByEmployeeId(String employeeId);
}



