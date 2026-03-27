package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TM_RadiologyUnit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HMS_TM_RadiologyUnitListRepository extends JpaRepository<HMS_TM_RadiologyUnit, String> {
}




