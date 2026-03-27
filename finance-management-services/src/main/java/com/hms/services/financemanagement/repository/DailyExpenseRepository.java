package com.hms.services.financemanagement.repository;

import com.hms.services.financemanagement.entity.HMS_TM_DailyExpense;
import com.hms.services.financemanagement.entity.HMS_TM_DailyIncome;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface DailyExpenseRepository extends JpaRepository<HMS_TM_DailyExpense, String> {

    @Query("SELECT d FROM HMS_TM_DailyExpense d WHERE d.date BETWEEN :fromDate AND :toDate")
    Page<HMS_TM_DailyExpense> findExpenseByDateRange(@Param("fromDate") LocalDateTime fromDate,
                                                   @Param("toDate") LocalDateTime toDate,
                                                   Pageable pageable);

//    @Query("SELECT SUM(d.totalAmount) FROM HMS_TM_DailyExpense d WHERE d.date BETWEEN :fromDate AND :toDate")
//    BigDecimal findTotalExpenseByDateRange(@Param("fromDate") LocalDateTime fromDate,
//                                          @Param("toDate") LocalDateTime toDate);

    @Query("SELECT COUNT(d) FROM HMS_TM_DailyExpense d WHERE d.date BETWEEN :fromDate AND :toDate")
    long countByDateRange(@Param("fromDate") LocalDateTime fromDate,
                          @Param("toDate") LocalDateTime toDate);


    @Query("SELECT d FROM HMS_TM_DailyExpense d WHERE d.date BETWEEN :fromDate AND :toDate")
    List<HMS_TM_DailyExpense> findAllExpensesByDateRange(@Param("fromDate") LocalDateTime fromDate,
                                                         @Param("toDate") LocalDateTime toDate);
}


