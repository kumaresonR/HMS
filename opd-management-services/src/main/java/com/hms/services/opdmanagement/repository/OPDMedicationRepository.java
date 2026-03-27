package com.hms.services.opdmanagement.repository;


import com.hms.services.opdmanagement.entity.HMS_TM_OPDMedication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OPDMedicationRepository extends JpaRepository<HMS_TM_OPDMedication, String> {

    List<HMS_TM_OPDMedication> findByOpdIdAndIsActiveTrue(String opdId);

    Optional<HMS_TM_OPDMedication> findByMedicationIdAndIsActiveTrue(String medicationId);


    List<HMS_TM_OPDMedication> findAllByIsActiveTrue();
}

