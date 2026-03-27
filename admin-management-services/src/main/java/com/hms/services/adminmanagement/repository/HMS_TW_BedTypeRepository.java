package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TW_BedType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TW_BedTypeRepository extends JpaRepository<HMS_TW_BedType, String> {

    Optional<HMS_TW_BedType> findByBedTypeIdAndIsActiveTrue(String id);
    List<HMS_TW_BedType> findAllByIsActiveTrue();
}



