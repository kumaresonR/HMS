package com.hms.services.billingmanagement.repository;

import com.hms.services.billingmanagement.entity.HMS_TM_PathologyBill;
import com.hms.services.billingmanagement.model.BillSummary;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PathologyBillRepository extends JpaRepository<HMS_TM_PathologyBill, String> {
    Optional<HMS_TM_PathologyBill> findById(String billId);

    @Query("SELECT MAX(b.billId) FROM HMS_TM_PathologyBill b")
    String findMaxBillId();

    Page<HMS_TM_PathologyBill> findAllByDeletedFalse(Pageable pageable);

    Optional<HMS_TM_PathologyBill> findByBillIdAndDeletedFalse(String billId);

//    @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_PathologyBill p WHERE p.deleted = false")
//    Double getTotalPathologyIncome();

        @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_PathologyBill p " +
                "WHERE p.deleted = false AND FUNCTION('DATE', p.dateTime) = CURRENT_DATE")
        Double getTotalPathologyIncome();
         @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_PathologyBill p " +
            "WHERE p.deleted = false AND FUNCTION('DATE', p.dateTime) = :yesterday")
        Double getYesterdayPathologyIncome(@Param("yesterday") LocalDate yesterday);
    @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_PathologyBill p " +
            "WHERE p.deleted = false " +
            "AND EXTRACT(MONTH FROM p.dateTime) = EXTRACT(MONTH FROM CURRENT_DATE) " +
            "AND EXTRACT(YEAR FROM p.dateTime) = EXTRACT(YEAR FROM CURRENT_DATE)")
    Double getMonthlyTotalPathologyIncome();

    @Query("SELECT b.billId FROM HMS_TM_PathologyBill b WHERE b.ipdOrOpdId = :ipdOrOpdId")
    Optional<String> findBillIdByIpdOrOpdId(@Param("ipdOrOpdId") String ipdOrOpdId);

    @Query("SELECT new com.hms.services.billingmanagement.model.BillSummary(b.ipdOrOpdId, SUM(b.netAmount), SUM(b.paymentAmount)) " +
            "FROM HMS_TM_PathologyBill b " +
            "WHERE b.ipdOrOpdId = :ipdOrOpdId " +
            "GROUP BY b.ipdOrOpdId")
    Optional<BillSummary> findSummaryByIpdOrOpdId(@Param("ipdOrOpdId") String ipdOrOpdId);
    @Query("SELECT COUNT(p) FROM HMS_TM_PathologyBill p WHERE p.patientId = :patientId")
    Integer countByPatientId(String patientId);

    @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_PathologyBill p " +
            "WHERE p.deleted = false " +
            "AND EXTRACT(MONTH FROM p.dateTime) = :month " +
            "AND EXTRACT(YEAR FROM p.dateTime) = :year")
    Double getTotalPathologyIncomeForMonth(@Param("month") int month, @Param("year") int year);


    @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_PathologyBill p " +
            "WHERE p.deleted = false AND EXTRACT(YEAR FROM p.dateTime) = :year")
    Double getTotalPathologyIncomeForYear(@Param("year") int year);


    @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_PathologyBill p " +
            "WHERE p.deleted = false AND EXTRACT(WEEK FROM p.dateTime) = :week " +
            "AND EXTRACT(YEAR FROM p.dateTime) = :year")
    Double getTotalPathologyIncomeForWeek(@Param("week") int week, @Param("year") int year);



    @Query("SELECT p FROM HMS_TM_PathologyBill p WHERE p.ipdOrOpdId = :ipdOrOpdId AND p.deleted = false")
    List<HMS_TM_PathologyBill> findByIpdOrOpdIdAndDeletedFalse(@Param("ipdOrOpdId") String ipdOrOpdId);

    @Query("SELECT DISTINCT b FROM HMS_TM_PathologyBill b " +
            "JOIN HMS_TM_PathologyTest t ON b.billId = t.billId " +
            "WHERE (:sampleCollected IS NULL OR t.sampleCollected = :sampleCollected) " +
            "AND (CAST(:startDate AS timestamp) IS NULL OR b.dateTime >= :startDate) " +
            "AND (CAST(:endDate AS timestamp) IS NULL OR b.dateTime <= :endDate)")
    List<HMS_TM_PathologyBill> findBillsWithFilters(
            @Param("sampleCollected") String sampleCollected,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
    @Query("SELECT b.billId FROM HMS_TM_PathologyBill b WHERE b.prescriptionNo = :prescriptionNo AND b.deleted = false")
    List<String> findAllBillIdsByPrescriptionNoAndDeletedFalse(String prescriptionNo);

    @Query("SELECT p FROM HMS_TM_PathologyBill p " +
            "WHERE p.deleted = false " +
            "AND FUNCTION('DATE', p.dateTime) = CURRENT_DATE")
    List<HMS_TM_PathologyBill> getAllPathologyIncomeForToday();


    @Query("SELECT p FROM HMS_TM_PathologyBill p " +
            "WHERE p.deleted = false " +
            "AND EXTRACT(MONTH FROM p.dateTime) = :month " +
            "AND EXTRACT(YEAR FROM p.dateTime) = :year")
    List<HMS_TM_PathologyBill> getAllPathologyIncomeForMonth(@Param("month") int month, @Param("year") int year);

    @Query("SELECT p FROM HMS_TM_PathologyBill p " +
            "WHERE p.deleted = false " +
            "AND EXTRACT(YEAR FROM p.dateTime) = :year")
    List<HMS_TM_PathologyBill> getAllPathologyIncomeForYear(@Param("year") int year);

    @Query("SELECT p FROM HMS_TM_PathologyBill p " +
            "WHERE p.deleted = false " +
            "AND EXTRACT(WEEK FROM p.dateTime) = :week " +
            "AND EXTRACT(YEAR FROM p.dateTime) = :year")
    List<HMS_TM_PathologyBill> getAllPathologyIncomeForWeek(@Param("week") int week, @Param("year") int year);

}


