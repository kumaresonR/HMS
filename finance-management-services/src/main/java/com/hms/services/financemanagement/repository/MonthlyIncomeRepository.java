package com.hms.services.financemanagement.repository;


import com.hms.services.financemanagement.entity.HMS_TM_DailyIncome;
import com.hms.services.financemanagement.entity.HMS_TM_MonthlyIncome;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MonthlyIncomeRepository extends JpaRepository<HMS_TM_MonthlyIncome, String> {

    @Query("SELECT p FROM HMS_TM_MonthlyIncome p WHERE p.month = :month AND p.year = :year")
    Page<HMS_TM_MonthlyIncome> findByMonthAndYear(
            @Param("month") int month,
            @Param("year") int year,
            Pageable pageable
    );

    @Query("SELECT COUNT(p) FROM HMS_TM_MonthlyIncome p WHERE p.month = :month AND p.year = :year")
    long countByMonthAndYear(
            @Param("month") int month,
            @Param("year") int year
    );

    @Query("SELECT p FROM HMS_TM_MonthlyIncome p WHERE p.year = :year")
    Page<HMS_TM_MonthlyIncome> findByYear(
            @Param("year") int year,
            Pageable pageable
    );

    @Query("SELECT COUNT(p) FROM HMS_TM_MonthlyIncome p WHERE p.year = :year")
    long countByYear(@Param("year") int year);



    @Query(value = "SELECT \"MONTHLY_INCOME_ID\", \"MODULE_NAME\", \"TOTAL_AMOUNT\",\"MONTH\",\"YEAR\", \"DATE\", \"CREATED_AT\" " +
            "FROM \"HMS_TM_MONTHLY_INCOME\" " +
            "WHERE CAST(\"DATE\" AS DATE) BETWEEN :fromDate AND :toDate", nativeQuery = true)
    List<Object[]> findIncomeAsRawData(@Param("fromDate") LocalDate fromDate,
                                       @Param("toDate") LocalDate toDate);
}


