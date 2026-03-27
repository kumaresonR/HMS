package com.hms.services.financemanagement.repository;


import com.hms.services.financemanagement.entity.HMS_TM_DailyExpense;
import com.hms.services.financemanagement.entity.HMS_TM_MonthlyExpense;
import com.hms.services.financemanagement.entity.HMS_TM_MonthlyIncome;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MonthlyExpenseRepository extends JpaRepository<HMS_TM_MonthlyExpense, String> {

    @Query("SELECT p FROM HMS_TM_MonthlyExpense p WHERE p.month = :month AND p.year = :year")
    Page<HMS_TM_MonthlyExpense> findByMonthAndYear(
            @Param("month") int month,
            @Param("year") int year,
            Pageable pageable
    );

    @Query("SELECT COUNT(p) FROM HMS_TM_MonthlyExpense p WHERE p.month = :month AND p.year = :year")
    long countByMonthAndYear(
            @Param("month") int month,
            @Param("year") int year
    );

    @Query("SELECT p FROM HMS_TM_MonthlyExpense p WHERE p.year = :year")
    Page<HMS_TM_MonthlyExpense> findByYear(
            @Param("year") int year,
            Pageable pageable
    );

    @Query("SELECT COUNT(p) FROM HMS_TM_MonthlyExpense p WHERE p.year = :year")
    long countByYear(@Param("year") int year);



    @Query("SELECT d FROM HMS_TM_MonthlyExpense d WHERE d.date BETWEEN :fromDate AND :toDate")
    List<HMS_TM_MonthlyExpense> findAllExpensesByDateRange(LocalDateTime fromDate, LocalDateTime toDate);


}


