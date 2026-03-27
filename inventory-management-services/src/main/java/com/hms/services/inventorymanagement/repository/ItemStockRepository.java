package com.hms.services.inventorymanagement.repository;

import com.hms.services.inventorymanagement.entity.HMS_TM_ItemStock;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ItemStockRepository extends JpaRepository<HMS_TM_ItemStock, String> {
    List<HMS_TM_ItemStock> findByDeletedFalse();
    Optional<HMS_TM_ItemStock> findByItemStockIdAndDeletedFalse(String itemStockId);


    @Query("SELECT i FROM HMS_TM_ItemStock i WHERE i.date BETWEEN :startDateTime AND :endDateTime AND i.deleted = false")
    Page<HMS_TM_ItemStock> findByDateBetweenAndDeletedFalse(
            @Param("startDateTime") LocalDateTime startDateTime,
            @Param("endDateTime") LocalDateTime endDateTime,
            Pageable pageable
    );

    @Query("SELECT i FROM HMS_TM_ItemStock i WHERE i.date BETWEEN :startDateTime AND :endDateTime AND i.deleted = false")
    List<HMS_TM_ItemStock> findByDateBetweenAndDeletedFalse(
            @Param("startDateTime") LocalDateTime startDateTime,
            @Param("endDateTime") LocalDateTime endDateTime
    );

}


