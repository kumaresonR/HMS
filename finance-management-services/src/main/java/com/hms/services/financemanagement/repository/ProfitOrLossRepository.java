package com.hms.services.financemanagement.repository;

import com.hms.services.financemanagement.entity.HMS_TM_DailyExpense;
import com.hms.services.financemanagement.entity.HMS_TM_DailyProfitAndLoss;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface ProfitOrLossRepository extends JpaRepository<HMS_TM_DailyProfitAndLoss, String> {


    @Query("SELECT p FROM HMS_TM_DailyProfitAndLoss p WHERE p.date BETWEEN :startDate AND :endDate")
    Page<HMS_TM_DailyProfitAndLoss> findProfitOrLossByDateRange(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable
    );

//    @Query("SELECT COALESCE(SUM(p.profitOrLoss), 0) FROM HMS_TM_DailyProfitAndLoss p WHERE p.date BETWEEN :startDate AND :endDate")
//    BigDecimal findTotalProfitOrLossByDateRange(
//            @Param("startDate") LocalDateTime startDate,
//            @Param("endDate") LocalDateTime endDate
//    );

    @Query("SELECT COUNT(p) FROM HMS_TM_DailyProfitAndLoss p WHERE p.date BETWEEN :startDate AND :endDate")
    long countByDateRange(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT p FROM HMS_TM_DailyProfitAndLoss p WHERE p.date BETWEEN :startDate AND :endDate")
    List<HMS_TM_DailyProfitAndLoss> findAllProfitOrLossByDateRange(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
}


