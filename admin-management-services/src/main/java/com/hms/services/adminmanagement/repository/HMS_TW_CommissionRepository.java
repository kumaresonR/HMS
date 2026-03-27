package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TW_Commission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TW_CommissionRepository extends JpaRepository<HMS_TW_Commission, String> {
    Optional<HMS_TW_Commission> findByCommissionIdAndIsActiveTrue(String commissionId);
    List<HMS_TW_Commission> findAllByIsActiveTrue();
}


