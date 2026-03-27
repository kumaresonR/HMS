package com.hms.services.billingmanagement.repository;

import com.hms.services.billingmanagement.entity.HMS_TM_PurchaseMedicine;
import com.hms.services.billingmanagement.model.ExpiryMedicineProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseMedicineRepository extends JpaRepository<HMS_TM_PurchaseMedicine, String> {
    List<HMS_TM_PurchaseMedicine> findByPurchaseBillId(String purchaseBillId);

//    @Query("SELECT DISTINCT p FROM HMS_TM_PurchaseMedicine p " +
//            "JOIN HMS_TM_PurchaseBill pb ON p.purchaseBillId = pb.purchaseBillId " +
//            "WHERE (:medicineCategory IS NULL OR p.medicineCategory = :medicineCategory) " +
//            "AND (:startDate IS NULL OR p.expiryDate >= :startDate) " +
//            "AND (:endDate IS NULL OR p.expiryDate <= :endDate)")
//    List<ExpiryMedicineProjection> findExpiryMedicines(
//            @Param("medicineCategory") String medicineCategory,
//            @Param("startDate") LocalDate startDate,
//            @Param("endDate") LocalDate endDate
//    );

    @Query("SELECT DISTINCT p FROM HMS_TM_PurchaseMedicine p " +
            "JOIN HMS_TM_PurchaseBill pb ON p.purchaseBillId = pb.purchaseBillId " +
            "WHERE (:medicineCategory IS NULL OR p.medicineCategory = :medicineCategory) " +
            "AND (:startDate IS NULL OR SUBSTRING(p.expiryDate, 1, 7) >= :startDate) " +
            "AND (:endDate IS NULL OR SUBSTRING(p.expiryDate, 1, 7) <= :endDate)")
    List<ExpiryMedicineProjection> findExpiryMedicines(
            @Param("medicineCategory") String medicineCategory,
            @Param("startDate") String startDate,
            @Param("endDate") String endDate
    );

    List<HMS_TM_PurchaseMedicine> findByMedicineNameAndMedicineCategory(String medicineName, String medicineCategory);

    List<HMS_TM_PurchaseMedicine> findByMedicineNameAndMedicineCategoryAndBatchNo(
            String medicineName, String medicineCategory, String batchNo);
}



