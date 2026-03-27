package com.hms.services.ipdmanagement.repository;


import com.hms.services.ipdmanagement.entity.HMS_TM_IPDDosage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface IPDDosageRepository extends JpaRepository<HMS_TM_IPDDosage, String> {


    Optional<HMS_TM_IPDDosage> findByDosageIdAndIsActiveTrue(String dosageId);

    List<HMS_TM_IPDDosage> findByMedicationIdAndIsActiveTrue(String medicationId);
}

