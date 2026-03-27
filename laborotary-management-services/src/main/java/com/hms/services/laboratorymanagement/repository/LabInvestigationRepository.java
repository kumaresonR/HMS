package com.hms.services.laboratorymanagement.repository;

import com.hms.services.laboratorymanagement.entity.HMS_TM_LabInvestigation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LabInvestigationRepository extends JpaRepository<HMS_TM_LabInvestigation, String> {
}

