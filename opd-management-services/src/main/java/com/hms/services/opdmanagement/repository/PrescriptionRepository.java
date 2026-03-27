package com.hms.services.opdmanagement.repository;


import com.hms.services.opdmanagement.entity.HMS_TM_OPDPrescriptions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrescriptionRepository extends JpaRepository<HMS_TM_OPDPrescriptions, String> {
    List<HMS_TM_OPDPrescriptions> findAllByIsActiveTrue();

    List<HMS_TM_OPDPrescriptions> findByOpdIdAndIsActiveTrue(String id);

    Optional<HMS_TM_OPDPrescriptions> findByPrescriptionIdAndIsActiveTrue(String id);

    Optional<HMS_TM_OPDPrescriptions> findTopByOrderByCreatedAtDesc();

    List<HMS_TM_OPDPrescriptions> findByPrescriptionNoAndIsActiveTrue(String number);
}
