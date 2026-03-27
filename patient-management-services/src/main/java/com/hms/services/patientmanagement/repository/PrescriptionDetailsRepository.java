package com.hms.services.patientmanagement.repository;

import com.hms.services.patientmanagement.entity.HMS_TM_PrescriptionDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrescriptionDetailsRepository extends JpaRepository<HMS_TM_PrescriptionDetails, String> {
//    void deleteByPrescriptionId(String id);

    List<HMS_TM_PrescriptionDetails> findAllByPrescriptionIdAndIsActiveTrue(String prescriptionId);

//    Optional<HMS_TM_PrescriptionDetails> findByIdAndIsActiveTrue(String prescriptionDetailId);

    Optional<HMS_TM_PrescriptionDetails> findByprescriptionDetailIdAndIsActiveTrue(String prescriptionDetailId);

//    List<HMS_TM_PrescriptionDetails> findByPrescriptionIdAndIsActiveTrue(String id);

    List<HMS_TM_PrescriptionDetails> findByPrescriptionIdAndIsActive(String id, boolean b);
}

