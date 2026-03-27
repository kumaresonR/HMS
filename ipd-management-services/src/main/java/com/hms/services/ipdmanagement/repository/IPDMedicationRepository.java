package com.hms.services.ipdmanagement.repository;


import com.hms.services.ipdmanagement.entity.HMS_TM_IPDMedication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IPDMedicationRepository extends JpaRepository<HMS_TM_IPDMedication, String> {

    List<HMS_TM_IPDMedication> findByIpdIdAndIsActiveTrue(String opdId);

    Optional<HMS_TM_IPDMedication> findByMedicationIdAndIsActiveTrue(String medicationId);


    List<HMS_TM_IPDMedication> findAllByIsActiveTrue();
}

