package com.hms.services.billingmanagement.repository;

import com.hms.services.billingmanagement.entity.HMS_TM_RadiologyBill;
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
public interface RadiologyBillRepository extends JpaRepository<HMS_TM_RadiologyBill, String> {
    Optional<HMS_TM_RadiologyBill> findById(String billId);

    @Query("SELECT MAX(b.billId) FROM HMS_TM_RadiologyBill b")
    String findMaxBillId();

//    @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_RadiologyBill p WHERE p.deleted = false")
//    Double getTotalRadiologyIncome();

    @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_RadiologyBill p " +
            "WHERE p.deleted = false AND FUNCTION('DATE', p.dateTime) = CURRENT_DATE")
    Double getTotalRadiologyIncome();


    Optional<HMS_TM_RadiologyBill> findByBillIdAndDeletedFalse(String billId);

    Page<HMS_TM_RadiologyBill> findAllByDeletedFalse(Pageable pageable);
    @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_RadiologyBill p " +
            "WHERE p.deleted = false AND FUNCTION('DATE', p.dateTime) = :yesterday")
    Double getYesterdayRadiologyIncome(@Param("yesterday") LocalDate yesterday);

    @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_RadiologyBill p " +
            "WHERE p.deleted = false " +
            "AND EXTRACT(MONTH FROM p.dateTime) = EXTRACT(MONTH FROM CURRENT_DATE) " +
            "AND EXTRACT(YEAR FROM p.dateTime) = EXTRACT(YEAR FROM CURRENT_DATE)")
    Double getMonthlyTotalRadiologyIncome();

    @Query("SELECT new com.hms.services.billingmanagement.model.BillSummary(b.ipdOrOpdId, SUM(b.netAmount), SUM(b.paymentAmount)) " +
            "FROM HMS_TM_RadiologyBill b " +
            "WHERE b.ipdOrOpdId = :ipdOrOpdId " +
            "GROUP BY b.ipdOrOpdId")
    Optional<BillSummary> findSummaryByIpdOrOpdId(@Param("ipdOrOpdId") String ipdOrOpdId);

    @Query("SELECT COUNT(r) FROM HMS_TM_RadiologyBill r WHERE r.patientId = :patientId")
    Integer countByPatientId(String patientId);

    @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_RadiologyBill p " +
            "WHERE p.deleted = false AND EXTRACT(MONTH FROM p.dateTime) = :month " +
            "AND EXTRACT(YEAR FROM p.dateTime) = :year")
    Double getTotalRadiologyIncomeForMonth(@Param("month") int month, @Param("year") int year);


    @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_RadiologyBill p " +
            "WHERE p.deleted = false AND EXTRACT(YEAR FROM p.dateTime) = :year")
    Double getTotalRadiologyIncomeForYear(@Param("year") int year);

    @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_RadiologyBill p " +
            "WHERE p.deleted = false AND EXTRACT(WEEK FROM p.dateTime) = :week " +
            "AND EXTRACT(YEAR FROM p.dateTime) = :year")
    Double getTotalRadiologyIncomeForWeek(@Param("week") int week, @Param("year") int year);



    @Query("SELECT r FROM HMS_TM_RadiologyBill r WHERE r.ipdOrOpdId = :ipdOrOpdId AND r.deleted = false")
    List<HMS_TM_RadiologyBill> findByIpdOrOpdIdAndDeletedFalse(@Param("ipdOrOpdId") String ipdOrOpdId);

    @Query("SELECT b.billId FROM HMS_TM_RadiologyBill b WHERE b.ipdOrOpdId = :ipdOrOpdId")
    Optional<String> findBillIdByIpdOrOpdId(@Param("ipdOrOpdId") String ipdOrOpdId);

    @Query("SELECT DISTINCT b FROM HMS_TM_RadiologyBill b " +
            "JOIN HMS_TM_RadiologyTest t ON b.billId = t.billId " +
            "WHERE (:sampleCollected IS NULL OR t.sampleCollected = :sampleCollected) " +
            "AND (cast(:startDate as timestamp) IS NULL OR b.dateTime >= :startDate) " +
            "AND (cast(:endDate as timestamp) IS NULL OR b.dateTime <= :endDate)")
    List<HMS_TM_RadiologyBill> findBillsWithFilters(
            @Param("sampleCollected") String sampleCollected,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT b.billId FROM HMS_TM_RadiologyBill b WHERE b.prescriptionNo = :prescriptionNo AND b.deleted = false")
    List<String> findAllBillIdsByPrescriptionNoAndDeletedFalse(String prescriptionNo);

    @Query("SELECT p FROM HMS_TM_RadiologyBill p " +
            "WHERE p.deleted = false " +
            "AND FUNCTION('DATE', p.dateTime) = CURRENT_DATE")
    List<HMS_TM_RadiologyBill> getAllRadiologyIncomeForToday();

    @Query("SELECT p FROM HMS_TM_RadiologyBill p " +
            "WHERE p.deleted = false " +
            "AND EXTRACT(MONTH FROM p.dateTime) = :month " +
            "AND EXTRACT(YEAR FROM p.dateTime) = :year")
    List<HMS_TM_RadiologyBill> getAllRadiologyIncomeForMonth(@Param("month") int month, @Param("year") int year);

    @Query("SELECT p FROM HMS_TM_RadiologyBill p " +
            "WHERE p.deleted = false " +
            "AND EXTRACT(YEAR FROM p.dateTime) = :year")
    List<HMS_TM_RadiologyBill> getAllRadiologyIncomeForYear(@Param("year") int year);

    @Query("SELECT p FROM HMS_TM_RadiologyBill p " +
            "WHERE p.deleted = false " +
            "AND EXTRACT(WEEK FROM p.dateTime) = :week " +
            "AND EXTRACT(YEAR FROM p.dateTime) = :year")
    List<HMS_TM_RadiologyBill> getAllRadiologyIncomeForWeek(@Param("week") int week, @Param("year") int year);
}


