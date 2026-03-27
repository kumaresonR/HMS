package com.hms.services.adminmanagement.repository;


import com.hms.services.adminmanagement.entity.HMS_TW_Vital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TW_VitalRepository extends JpaRepository<HMS_TW_Vital, String> {
    Optional<HMS_TW_Vital> findByVitalIdAndIsActiveTrue(String vitalId);
    List<HMS_TW_Vital> findAllByIsActiveTrue();
}


