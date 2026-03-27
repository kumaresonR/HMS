package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TM_BedType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TM_BedTypeRepository extends JpaRepository<HMS_TM_BedType, String> {

    List<HMS_TM_BedType> findAllByIsActiveTrue();

    HMS_TM_BedType findByBedTypeIdAndIsActiveTrue(String bedTypeId);

    Optional<HMS_TM_BedType> findByWtIdAndIsActiveTrue(String id);
}



