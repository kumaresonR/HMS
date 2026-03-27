package com.hms.services.billingmanagement.repository;


import com.hms.services.billingmanagement.entity.HMS_TM_RadiologyTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RadiologyRepository extends JpaRepository<HMS_TM_RadiologyTest, String> {
    List<HMS_TM_RadiologyTest> findByBillId(String billId);
    List<HMS_TM_RadiologyTest> findByRadiologyTestIdIn(List<String> testIds);
    List<HMS_TM_RadiologyTest> findAllByBillId(Optional<String> optionalBillId);
    @Query("SELECT t FROM HMS_TM_RadiologyTest t WHERE t.billId IN :billIds")
    List<HMS_TM_RadiologyTest> findAllByBillIdIn(List<String> billIds);

    @Query("SELECT t FROM HMS_TM_RadiologyTest t WHERE t.radiologyTestId IN :ids AND t.collectedDate IS NULL")
    List<HMS_TM_RadiologyTest> findByRadiologyTestIdInAndCollectedDateIsNull(List<String> ids);

    @Query("SELECT t FROM HMS_TM_RadiologyTest t WHERE t.radiologyTestId IN :ids AND t.prescriptionNo = :prescriptionNo")
    List<HMS_TM_RadiologyTest> findByRadiologyTestIdInAndPrescriptionNo(List<String> ids, String prescriptionNo);
}



