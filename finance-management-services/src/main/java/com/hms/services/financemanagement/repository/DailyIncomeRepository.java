package com.hms.services.financemanagement.repository;


import com.hms.services.financemanagement.entity.HMS_TM_DailyIncome;
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
public interface DailyIncomeRepository extends JpaRepository<HMS_TM_DailyIncome, String> {

    @Query("SELECT d FROM HMS_TM_DailyIncome d WHERE d.date BETWEEN :fromDate AND :toDate")
    Page<HMS_TM_DailyIncome> findIncomeByDateRange(@Param("fromDate") LocalDateTime fromDate,
                                                   @Param("toDate") LocalDateTime toDate,
                                                   Pageable pageable);

    @Query("SELECT COUNT(d) FROM HMS_TM_DailyIncome d WHERE d.date BETWEEN :fromDate AND :toDate")
    long countByDateRange(@Param("fromDate") LocalDateTime fromDate,
                          @Param("toDate") LocalDateTime toDate);


    @Query(value = "SELECT \"DAILY_INCOME_ID\", \"MODULE_NAME\", \"TOTAL_AMOUNT\", \"DATE\", \"CREATED_AT\" " +
            "FROM \"HMS_TM_DAILY_INCOME\" " +
            "WHERE CAST(\"DATE\" AS DATE) BETWEEN :fromDate AND :toDate", nativeQuery = true)
    List<Object[]> findIncomeAsRawData(@Param("fromDate") LocalDate fromDate,
                                       @Param("toDate") LocalDate toDate);


}


