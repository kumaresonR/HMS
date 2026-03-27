package com.hms.services.billingmanagement.repository;

import com.hms.services.billingmanagement.entity.HMS_TM_AddMedicine;
import com.hms.services.billingmanagement.entity.HMS_TM_Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<HMS_TM_Medicine, String> {
    List<HMS_TM_Medicine> findByPharmacyBillId(String pharmacyBillId);

    @Query("SELECT COALESCE(SUM(m.availableQty), 0) FROM HMS_TM_Medicine m")
    Double getTotalMedicineStock();

    @Query("SELECT m.medicineName, " +
            "((m.quantity - m.availableQty) * 1.0 / m.quantity) * 100 AS soldPercentage " +
            "FROM HMS_TM_Medicine m " +
            "WHERE m.pharmacyBillId IN (" +
            "SELECT m2.pharmacyBillId " +
            "FROM HMS_TM_Medicine m2 " +
            "GROUP BY m2.pharmacyBillId " +
            " HAVING COUNT(m2) > 0" +
            "ORDER BY COUNT(m2) DESC" +
            ")")
    List<Object> getCommonMedicinesWithSoldPercentage();

    @Query("SELECT m FROM HMS_TM_AddMedicine m " +
            "WHERE (:name IS NULL OR m.name LIKE %:name%) " +
            "AND (:category IS NULL OR m.category = :category) " +
            "AND (:startDate IS NULL OR m.expiryDate >= :startDate) " +
            "AND (:endDate IS NULL OR m.expiryDate <= :endDate)")
    List<HMS_TM_AddMedicine> findMedicinesWithFilters(
            @Param("name") String name,
            @Param("category") String category,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);



}


