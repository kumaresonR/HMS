package com.hms.services.billingmanagement.repository;


import com.hms.services.billingmanagement.entity.HMS_TM_PathologyTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PathologyRepository extends JpaRepository<HMS_TM_PathologyTest, String> {
    List<HMS_TM_PathologyTest> findByBillId(String billId);
    List<HMS_TM_PathologyTest> findByPathologyTestIdIn(List<String> testIds);

    List<HMS_TM_PathologyTest> findAllByBillId(Optional<String> optionalBillId);

    @Query("SELECT t FROM HMS_TM_PathologyTest t WHERE t.billId IN :billIds")
    List<HMS_TM_PathologyTest> findAllByBillIdIn(List<String> billIds);

    @Query("SELECT t FROM HMS_TM_PathologyTest t WHERE t.pathologyTestId IN :ids AND t.collectedDate IS NULL")
    List<HMS_TM_PathologyTest> findByPathologyTestIdInAndCollectedDateIsNull(List<String> ids);

    @Query("SELECT t FROM HMS_TM_PathologyTest t WHERE t.pathologyTestId IN :ids AND t.prescriptionNo = :prescriptionNo")
    List<HMS_TM_PathologyTest> findByPathologyTestIdInAndPrescriptionNo(List<String> ids, String prescriptionNo);
}



