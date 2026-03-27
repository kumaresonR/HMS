package com.hms.services.opdmanagement.repository;

import com.hms.services.opdmanagement.entity.HMS_TM_OPDDosage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface OPDDosageRepository extends JpaRepository<HMS_TM_OPDDosage, String> {


    Optional<HMS_TM_OPDDosage> findByDosageIdAndIsActiveTrue(String dosageId);

    List<HMS_TM_OPDDosage> findByMedicationIdAndIsActiveTrue(String medicationId);
}

