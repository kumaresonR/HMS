package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TW_UnitType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HMS_TW_UnitTypeRepository extends JpaRepository<HMS_TW_UnitType, String> {

    Optional<HMS_TW_UnitType> findByIdAndIsActiveTrue(String workId);
    List<HMS_TW_UnitType> findAllByIsActiveTrue();
}



