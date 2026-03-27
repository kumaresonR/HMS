package com.hms.services.adminmanagement.repository;


import com.hms.services.adminmanagement.entity.HMS_TM_SymptomsType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TM_SymptomsTypeRepository extends JpaRepository<HMS_TM_SymptomsType, String> {

    List<HMS_TM_SymptomsType> findAllByIsActiveTrue();
    HMS_TM_SymptomsType findBySymptomsTypeIdAndIsActiveTrue(String symptomsTypeId);

    Optional<HMS_TM_SymptomsType> findByWtIdAndIsActiveTrue(String id);
}



