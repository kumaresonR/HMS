package com.hms.services.billingmanagement.repository;

import com.hms.services.billingmanagement.entity.HMS_TM_PharmacyBill;
import com.hms.services.billingmanagement.model.BillSummary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PharmacyBillRepository extends JpaRepository<HMS_TM_PharmacyBill, String> {
    @Query("SELECT MAX(b.pharmacyBillId) FROM HMS_TM_PharmacyBill b")
    String findMaxPharmacyBillId();
//    @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_PharmacyBill p WHERE p.deleted = false")
//    Double getTotalPharmacyIncome();
    Page<HMS_TM_PharmacyBill> findByDeletedFalse(Pageable pageable);
    Optional<HMS_TM_PharmacyBill> findByPharmacyBillIdAndDeletedFalse(String pharmacyBillId);

    @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_PharmacyBill p " +
            "WHERE p.deleted = false AND FUNCTION('DATE', p.dateTime) = CURRENT_DATE")
    Double getTotalPharmacyIncome();
    @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_PharmacyBill p " +
            "WHERE p.deleted = false AND FUNCTION('DATE', p.dateTime) = :yesterday")
    Double getYesterdayPharmacyIncome(LocalDate yesterday);
    @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_PharmacyBill p " +
            "WHERE p.deleted = false " +
            "AND EXTRACT(MONTH FROM p.dateTime) = EXTRACT(MONTH FROM CURRENT_DATE) " +
            "AND EXTRACT(YEAR FROM p.dateTime) = EXTRACT(YEAR FROM CURRENT_DATE)")
    Double getMonthlyTotalPharmacyIncome();

    @Query("SELECT EXTRACT(MONTH FROM p.dateTime) AS month, SUM(p.netAmount) AS total FROM HMS_TM_PharmacyBill p " +
            "WHERE p.deleted = false " +
            "AND EXTRACT(YEAR FROM p.dateTime) = EXTRACT(YEAR FROM CURRENT_DATE) " +
            "GROUP BY EXTRACT(MONTH FROM p.dateTime)")
    List<Object[]> getMonthlyExpenseForYear();

    @Query("SELECT new com.hms.services.billingmanagement.model.BillSummary(b.ipdOrOpdId, SUM(b.netAmount), SUM(b.paymentAmount)) " +
            "FROM HMS_TM_PharmacyBill b " +
            "WHERE b.ipdOrOpdId = :ipdOrOpdId " +
            "GROUP BY b.ipdOrOpdId")
    Optional<BillSummary> findSummaryByIpdOrOpdId(@Param("ipdOrOpdId") String ipdOrOpdId);

    @Query("SELECT COUNT(p) FROM HMS_TM_PharmacyBill p WHERE p.patientId = :patientId")
    Integer countByPatientId(String patientId);

    @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_PharmacyBill p " +
            "WHERE p.deleted = false AND EXTRACT(MONTH FROM p.dateTime) = :month " +
            "AND EXTRACT(YEAR FROM p.dateTime) = :year")
    Double getTotalPharmacyIncomeForMonth(@Param("month") int month, @Param("year") int year);

    @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_PharmacyBill p " +
            "WHERE p.deleted = false AND EXTRACT(WEEK FROM p.dateTime) = :week " +
            "AND EXTRACT(YEAR FROM p.dateTime) = :year")
    Double getTotalPharmacyIncomeForWeek(@Param("week") int week, @Param("year") int year);

    @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_PharmacyBill p " +
            "WHERE p.deleted = false AND EXTRACT(YEAR FROM p.dateTime) = :year")
    Double getTotalPharmacyIncomeForYear(@Param("year") int year);



    @Query("SELECT p FROM HMS_TM_PharmacyBill p WHERE p.ipdOrOpdId = :ipdOrOpdId AND p.deleted = false")
    List<HMS_TM_PharmacyBill> findByIpdOrOpdIdAndDeletedFalse(@Param("ipdOrOpdId") String ipdOrOpdId);

    @Query("SELECT DISTINCT b FROM HMS_TM_PharmacyBill b " +
            "WHERE (:doctorName IS NULL OR b.doctorName = :doctorName) " +
            "AND (:paymentMode IS NULL OR b.paymentMode = :paymentMode) " +
            "AND (CAST(:startDate AS timestamp) IS NULL OR b.dateTime >= :startDate) " +
            "AND (CAST(:endDate AS timestamp) IS NULL OR b.dateTime <= :endDate)")
    List<HMS_TM_PharmacyBill> findBillsWithFilters(
            @Param("doctorName") String doctorName,
            @Param("paymentMode") String paymentMode,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT p FROM HMS_TM_PharmacyBill p " +
            "WHERE p.deleted = false " +
            "AND FUNCTION('DATE', p.dateTime) = CURRENT_DATE")
    List<HMS_TM_PharmacyBill> getAllPharmacyIncomeForToday();

    @Query("SELECT p FROM HMS_TM_PharmacyBill p " +
            "WHERE p.deleted = false " +
            "AND EXTRACT(MONTH FROM p.dateTime) = :month " +
            "AND EXTRACT(YEAR FROM p.dateTime) = :year")
    List<HMS_TM_PharmacyBill> getAllPharmacyIncomeForMonth(@Param("month") int month, @Param("year") int year);

    @Query("SELECT p FROM HMS_TM_PharmacyBill p " +
            "WHERE p.deleted = false " +
            "AND EXTRACT(YEAR FROM p.dateTime) = :year")
    List<HMS_TM_PharmacyBill> getAllPharmacyIncomeForYear(@Param("year") int year);

    @Query("SELECT p FROM HMS_TM_PharmacyBill p " +
            "WHERE p.deleted = false " +
            "AND EXTRACT(WEEK FROM p.dateTime) = :week " +
            "AND EXTRACT(YEAR FROM p.dateTime) = :year")
    List<HMS_TM_PharmacyBill> getAllPharmacyIncomeForWeek(@Param("week") int week, @Param("year") int year);
}



