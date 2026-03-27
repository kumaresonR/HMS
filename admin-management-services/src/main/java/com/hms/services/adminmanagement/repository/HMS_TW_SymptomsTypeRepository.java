package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TW_SymptomsType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TW_SymptomsTypeRepository extends JpaRepository<HMS_TW_SymptomsType, String> {

    List<HMS_TW_SymptomsType> findAllByIsActiveTrue();
    Optional<HMS_TW_SymptomsType> findBySymptomsTypeIdAndIsActiveTrue(String symptomsTypeId);
}


