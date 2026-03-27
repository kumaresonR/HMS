package com.hms.services.ipdmanagement.repository;


import com.hms.services.ipdmanagement.entity.HMS_TM_IPDPayments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface IPDPaymentsRepository extends JpaRepository<HMS_TM_IPDPayments, String> {

    Optional<HMS_TM_IPDPayments> findByIpdPaymentId(String ipdChargeId);

    List<HMS_TM_IPDPayments> findByIpdIdAndIsActiveTrue(String ipdChargeId);

    Optional<HMS_TM_IPDPayments> findByIpdPaymentIdAndIsActiveTrue(String ipdChargeId);
//    @Query("SELECT SUM(p.amount) FROM HMS_TM_IPDPayments p WHERE p.isActive = true")
@Query("SELECT SUM(p.amount) FROM HMS_TM_IPDPayments p " +
        "WHERE p.isActive = true AND FUNCTION('DATE', p.date) = CURRENT_DATE")
    Double getTotalIPDIncome();

    @Query("SELECT SUM(p.amount) FROM HMS_TM_IPDPayments p " +
            "WHERE p.isActive = true AND FUNCTION('DATE', p.date) = :yesterday")
    Double getYesterdayIPDIncome(@Param("yesterday") LocalDate yesterday);
    @Query("SELECT SUM(p.amount) FROM HMS_TM_IPDPayments p " +
            "WHERE p.isActive = true AND EXTRACT(MONTH FROM p.date) = EXTRACT(MONTH FROM CURRENT_DATE) " +
            "AND EXTRACT(YEAR FROM p.date) = EXTRACT(YEAR FROM CURRENT_DATE)")
    Double getTotalMonthlyIPDIncome();

    @Query("SELECT SUM(p.amount) FROM HMS_TM_IPDPayments p " +
            "WHERE p.isActive = true " +
            "AND EXTRACT(MONTH FROM p.date) = :month " +
            "AND EXTRACT(YEAR FROM p.date) = :year")
    Double getTotalIPDIncomeForMonth(@Param("month") int month, @Param("year") int year);

    @Query("SELECT SUM(p.amount) FROM HMS_TM_IPDPayments p " +
            "WHERE p.isActive = true " +
            "AND EXTRACT(YEAR FROM p.date) = :year")
    Double getTotalIPDIncomeForYear(@Param("year") int year);

    @Query("SELECT SUM(p.amount) FROM HMS_TM_IPDPayments p " +
            "WHERE p.isActive = true " +
            "AND EXTRACT(WEEK FROM p.date) = :week " +
            "AND EXTRACT(YEAR FROM p.date) = :year")
    Double getTotalIPDIncomeForWeek(@Param("week") int week, @Param("year") int year);

    @Query("SELECT p FROM HMS_TM_IPDPayments p " +
            "WHERE p.isActive = true " +
            "AND FUNCTION('DATE', p.date) = CURRENT_DATE")
    List<HMS_TM_IPDPayments> getAllIPDIncomeForToday();

    @Query("SELECT p FROM HMS_TM_IPDPayments p " +
            "WHERE p.isActive = true " +
            "AND EXTRACT(MONTH FROM p.date) = :month " +
            "AND EXTRACT(YEAR FROM p.date) = :year")
    List<HMS_TM_IPDPayments> getAllIPDIncomeForMonth(@Param("month") int month, @Param("year") int year);

    @Query("SELECT p FROM HMS_TM_IPDPayments p " +
            "WHERE p.isActive = true " +
            "AND EXTRACT(WEEK FROM p.date) = :week " +
            "AND EXTRACT(YEAR FROM p.date) = :year")
    List<HMS_TM_IPDPayments> getAllIPDIncomeForWeek(@Param("week") int week, @Param("year") int year);

    @Query("SELECT p FROM HMS_TM_IPDPayments p " +
            "WHERE p.isActive = true " +
            "AND EXTRACT(YEAR FROM p.date) = :year")
    List<HMS_TM_IPDPayments> getAllIPDIncomeForYear(@Param("year") int year);

}

