package com.hms.services.billingmanagement.repository;

import com.hms.services.billingmanagement.entity.HMS_TM_AddMedicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AddMedicineRepository  extends JpaRepository<HMS_TM_AddMedicine, String> {

    List<HMS_TM_AddMedicine> findByIsDeletedFalse();
    Optional<HMS_TM_AddMedicine> findByAddMedicineIdAndIsDeletedFalse(String id);

    List<HMS_TM_AddMedicine> findByBoxPackingLessThanEqualAndIsDeletedFalse(Integer boxPacking);

    List<HMS_TM_AddMedicine> findByNameAndCategoryAndBatchNo(String name, String category, String batchNo);

    @Query("SELECT m FROM HMS_TM_AddMedicine m WHERE m.expiryDate = :expiryMonth AND m.isDeleted = false")
    List<HMS_TM_AddMedicine> findAllByExpiryMonthAndIsDeletedFalse(@Param("expiryMonth") String expiryMonth);

    @Query("SELECT m FROM HMS_TM_AddMedicine m " +
            "WHERE (:name IS NULL OR m.name = :name) " +
            "AND (CAST(:startDate AS timestamp) IS NULL OR m.purchaseDate >= :startDate) " +
            "AND (CAST(:endDate AS timestamp) IS NULL OR m.purchaseDate <= :endDate)")
    List<HMS_TM_AddMedicine> findStockByFilters(
            @Param("name") String name,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

}


