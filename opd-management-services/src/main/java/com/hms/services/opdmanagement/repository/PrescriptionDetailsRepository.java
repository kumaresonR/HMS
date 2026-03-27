package com.hms.services.opdmanagement.repository;


import com.hms.services.opdmanagement.entity.HMS_TM_OPDPrescriptionDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PrescriptionDetailsRepository extends JpaRepository<HMS_TM_OPDPrescriptionDetails, String> {
    List<HMS_TM_OPDPrescriptionDetails> findByPrescriptionId(String prescriptionId);

    List<HMS_TM_OPDPrescriptionDetails> findByPrescriptionIdAndIsActiveTrue(String prescriptionId);

    List<HMS_TM_OPDPrescriptionDetails> findByOpdIdAndIsActiveTrue(String id);

    @Modifying
    @Query("DELETE FROM HMS_TM_OPDPrescriptionDetails pd WHERE pd.prescriptionId = :prescriptionId AND pd.isActive = true")
    void deleteByPrescriptionIdAndIsActiveTrue(@Param("prescriptionId") String prescriptionId);
}
