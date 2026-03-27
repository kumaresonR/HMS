package com.hms.services.ipdmanagement.repository;

import com.hms.services.ipdmanagement.entity.HMS_TM_PrescriptionDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PrescriptionDetailsRepository extends JpaRepository<HMS_TM_PrescriptionDetails, String> {
    List<HMS_TM_PrescriptionDetails> findByPrescriptionId(String prescriptionId);

    List<HMS_TM_PrescriptionDetails> findByPrescriptionIdAndIsActiveTrue(String prescriptionId);

    List<HMS_TM_PrescriptionDetails> findByIpdIdAndIsActiveTrue(String id);

    @Modifying
    @Query("DELETE FROM HMS_TM_PrescriptionDetails pd WHERE pd.prescriptionId = :prescriptionId AND pd.isActive = true")
    void deleteByPrescriptionIdAndIsActiveTrue(@Param("prescriptionId") String prescriptionId);
}
