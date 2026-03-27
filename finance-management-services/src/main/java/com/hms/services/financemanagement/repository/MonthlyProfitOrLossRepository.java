package com.hms.services.financemanagement.repository;

import com.hms.services.financemanagement.entity.HMS_TM_DailyProfitAndLoss;
import com.hms.services.financemanagement.entity.HMS_TM_MonthlyExpense;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface MonthlyProfitOrLossRepository extends JpaRepository<HMS_TM_DailyProfitAndLoss, String> {

    @Query("SELECT p FROM HMS_TM_DailyProfitAndLoss p WHERE p.month = :month AND p.year = :year")
    Page<HMS_TM_DailyProfitAndLoss> findByMonthAndYear(Integer month, int year, Pageable pageable);

    @Query("SELECT COUNT(p) FROM HMS_TM_DailyProfitAndLoss p WHERE p.month = :month AND p.year = :year")
    long countByMonthAndYear(Integer month, int year);

    @Query("SELECT p FROM HMS_TM_DailyProfitAndLoss p WHERE p.year = :year")
    Page<HMS_TM_DailyProfitAndLoss> findByYear(int year, Pageable pageable);

    @Query("SELECT COUNT(p) FROM HMS_TM_DailyProfitAndLoss p WHERE p.year = :year")
    long countByYear(int year);

    @Query("SELECT p FROM HMS_TM_MonthlyProfitAndLoss p WHERE p.date BETWEEN :startDate AND :endDate")
    List<HMS_TM_DailyProfitAndLoss> findAllProfitOrLossByDateRange(LocalDateTime startDate, LocalDateTime endDate);
}


