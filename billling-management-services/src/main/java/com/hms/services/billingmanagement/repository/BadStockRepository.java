package com.hms.services.billingmanagement.repository;


import com.hms.services.billingmanagement.entity.HMS_TM_BadStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BadStockRepository extends JpaRepository<HMS_TM_BadStock, String> {
    List<HMS_TM_BadStock> findByDeletedFalse();
    List<HMS_TM_BadStock> findByAddMedicineId(String addMedicineId);
    Optional<HMS_TM_BadStock> findByIdAndDeletedFalse(String id);

    @Query("SELECT COALESCE(SUM(b.qty), 0) FROM HMS_TM_BadStock b WHERE b.deleted = false")
    Double getBadStockTotalQuantity();
}



