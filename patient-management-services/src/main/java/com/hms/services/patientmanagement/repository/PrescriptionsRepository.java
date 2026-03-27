package com.hms.services.patientmanagement.repository;


import com.hms.services.patientmanagement.entity.HMS_TM_Prescriptions;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PrescriptionsRepository extends JpaRepository<HMS_TM_Prescriptions, String> {
    Optional<HMS_TM_Prescriptions> findByPrescriptionId(String id);

//    void deleteByPrescriptionId(String id);

    Optional<HMS_TM_Prescriptions> findByPrescriptionIdAndIsActiveTrue(String id);

//    Page<HMS_TM_Prescriptions> findAllIsActiveTrue(Pageable pageable);

    Page<HMS_TM_Prescriptions> findByIsActiveTrue(Pageable pageable);
}

