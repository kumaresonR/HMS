package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TW_Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TW_DepartmentRepository extends JpaRepository<HMS_TW_Department, String> {

    List<HMS_TW_Department> findByDeletedFalse();

    Optional<HMS_TW_Department> findByDepartmentIdAndDeletedFalse(String departmentId);
}




