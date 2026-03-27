package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TM_UnitType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HMS_TM_UnitTypeRepository extends JpaRepository<HMS_TM_UnitType, String> {

    List<HMS_TM_UnitType> findAllByIsActiveTrue();

    Optional<HMS_TM_UnitType> findByWtIdAndIsActiveTrue(String id);

    Optional<HMS_TM_UnitType> findByIdAndIsActiveTrue(String unitTypeId);
}



