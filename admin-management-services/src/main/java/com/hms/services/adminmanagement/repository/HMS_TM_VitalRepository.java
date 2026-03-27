package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TM_Vital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TM_VitalRepository extends JpaRepository<HMS_TM_Vital, String> {
    List<HMS_TM_Vital> findAllByIsActiveTrue();

    Optional<HMS_TM_Vital> findByWtIdAndIsActiveTrue(String id);
}


