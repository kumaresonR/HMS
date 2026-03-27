package com.hms.services.billingmanagement.repository;



import com.hms.services.billingmanagement.entity.HMS_TM_PurchaseBill;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseBillRepository extends JpaRepository<HMS_TM_PurchaseBill, String> {

    @Query("SELECT MAX(b.purchaseBillId) FROM HMS_TM_PurchaseBill b")
    String findMaxBillId();

    Optional<HMS_TM_PurchaseBill> findByPurchaseBillIdAndDeletedFalse(String purchaseBillId);

    Page<HMS_TM_PurchaseBill> findAllByDeletedFalse(Pageable pageable);

    @Query("SELECT SUM(p.netAmount) FROM HMS_TM_PurchaseBill p " +
            "WHERE p.deleted = false AND FUNCTION('DATE', p.purchaseDate) = CURRENT_DATE")
    Double getTodayTotalMedicinePurchaseAmount();

    @Query("SELECT SUM(p.netAmount) FROM HMS_TM_PurchaseBill p " +
            "WHERE p.deleted = false AND FUNCTION('DATE', p.purchaseDate) = :yesterday")
    Double getYesterdayTotalMedicinePurchaseAmount(@Param("yesterday") LocalDate yesterday);
}




