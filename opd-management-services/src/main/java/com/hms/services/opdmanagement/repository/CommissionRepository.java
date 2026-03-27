package com.hms.services.opdmanagement.repository;

import com.hms.services.opdmanagement.entity.HMS_TM_Commission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommissionRepository extends JpaRepository<HMS_TM_Commission, String> {

    List<HMS_TM_Commission> findByIsActiveTrueAndIsPaid(Boolean isPaid);

    List<HMS_TM_Commission> findByIsActiveTrue();

    Optional<HMS_TM_Commission> findByIdAndIsActiveTrue(String id);

    List<HMS_TM_Commission> findByCommissionCategoryAndIsActiveTrue(String category);

    List<HMS_TM_Commission> findByDoctorIdAndIsActiveTrue(String doctorId);
}

