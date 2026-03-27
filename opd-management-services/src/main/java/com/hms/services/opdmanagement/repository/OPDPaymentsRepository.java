package com.hms.services.opdmanagement.repository;



import com.hms.services.opdmanagement.entity.HMS_TM_OPDPayments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface OPDPaymentsRepository extends JpaRepository<HMS_TM_OPDPayments, String> {

    Optional<HMS_TM_OPDPayments> findByOpdChargeId(String opdChargeId);

    List<HMS_TM_OPDPayments> findByOpdIdAndIsActiveTrue(String opdChargeId);

    Optional<HMS_TM_OPDPayments> findByOpdChargeIdAndIsActiveTrue(String opdChargeId);

//    @Query("SELECT SUM(p.amount) FROM HMS_TM_OPDPayments p WHERE p.isActive = true")
@Query("SELECT SUM(p.amount) FROM HMS_TM_OPDPayments p " +
        "WHERE p.isActive = true AND FUNCTION('DATE', p.date) = CURRENT_DATE")
    Double getTotalOPDIncome();
    @Query("SELECT SUM(p.amount) FROM HMS_TM_OPDPayments p " +
            "WHERE p.isActive = true AND FUNCTION('DATE', p.date) = :yesterday")
    Double getYesterdayOPDIncome(@Param("yesterday") LocalDate yesterday);

    @Query("SELECT SUM(p.amount) FROM HMS_TM_OPDPayments p " +
            "WHERE p.isActive = true " +
            "AND EXTRACT(MONTH FROM p.date) = EXTRACT(MONTH FROM CURRENT_DATE) " +
            "AND EXTRACT(YEAR FROM p.date) = EXTRACT(YEAR FROM CURRENT_DATE)")
    Double getTotalOPDMonthlyIncome();

    @Query("SELECT SUM(p.amount) FROM HMS_TM_OPDPayments p " +
            "WHERE p.isActive = true " +
            "AND EXTRACT(MONTH FROM p.date) = :month " +
            "AND EXTRACT(YEAR FROM p.date) = :year")
    Double getTotalOPDIncomeForMonth(@Param("month") int month, @Param("year") int year);

    @Query("SELECT SUM(p.amount) FROM HMS_TM_OPDPayments p " +
            "WHERE p.isActive = true " +
            "AND EXTRACT(YEAR FROM p.date) = :year")
    Double getTotalOPDIncomeForYear(@Param("year") int year);

    @Query("SELECT SUM(p.amount) FROM HMS_TM_OPDPayments p " +
            "WHERE p.isActive = true " +
            "AND EXTRACT(WEEK FROM p.date) = :week " +
            "AND EXTRACT(YEAR FROM p.date) = :year")
    Double getTotalOPDIncomeForWeek(@Param("week") int week, @Param("year") int year);

    @Query("SELECT p FROM HMS_TM_OPDPayments p " +
            "WHERE p.isActive = true AND FUNCTION('DATE', p.date) = CURRENT_DATE")
    List<HMS_TM_OPDPayments> getAllOPDIncomeForToday();

    @Query("SELECT p FROM HMS_TM_OPDPayments p " +
            "WHERE p.isActive = true " +
            "AND EXTRACT(MONTH FROM p.date) = :month " +
            "AND EXTRACT(YEAR FROM p.date) = :year")
    List<HMS_TM_OPDPayments> getAllOPDIncomeForMonth(@Param("month") int month, @Param("year") int year);

    @Query("SELECT p FROM HMS_TM_OPDPayments p " +
            "WHERE p.isActive = true " +
            "AND EXTRACT(WEEK FROM p.date) = :week " +
            "AND EXTRACT(YEAR FROM p.date) = :year")
    List<HMS_TM_OPDPayments> getAllOPDIncomeForWeek(@Param("week") int week, @Param("year") int year);

    @Query("SELECT p FROM HMS_TM_OPDPayments p " +
            "WHERE p.isActive = true " +
            "AND EXTRACT(YEAR FROM p.date) = :year")
    List<HMS_TM_OPDPayments> getAllOPDIncomeForYear(@Param("year") int year);

}

