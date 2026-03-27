package com.hms.services.ipdmanagement.repository;

import com.hms.services.ipdmanagement.entity.HMS_TM_Prescriptions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrescriptionRepository extends JpaRepository<HMS_TM_Prescriptions, String> {
    List<HMS_TM_Prescriptions> findAllByIsActiveTrue();

    List<HMS_TM_Prescriptions> findByIpdIdAndIsActiveTrue(String id);

    Optional<HMS_TM_Prescriptions> findByPrescriptionIdAndIsActiveTrue(String id);

    Optional<HMS_TM_Prescriptions> findTopByOrderByCreatedAtDesc();

    List<HMS_TM_Prescriptions> findByPrescriptionNoAndIsActiveTrue(String number);
}
