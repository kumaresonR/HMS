package com.hms.services.bloodbankmanagement.repository;

import com.hms.services.bloodbankmanagement.entity.HMS_TM_IssueBlood;
import com.hms.services.bloodbankmanagement.model.BillSummary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface IssueBloodRepository extends JpaRepository<HMS_TM_IssueBlood, String> {
    @Query("SELECT MAX(b.issueBloodId) FROM HMS_TM_IssueBlood b")
    String findMaxIssueBloodId();
    @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_IssueBlood p " +
            "WHERE p.deleted = false AND FUNCTION('DATE', p.issueDate) = CURRENT_DATE")
    Double getTotalIssueBloodIncome();
    @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_IssueBlood p " +
            "WHERE p.deleted = false AND FUNCTION('DATE', p.issueDate) = :yesterday")
    Double getYesterdayIssueBloodIncome(@Param("yesterday") LocalDate yesterday);

    Optional<HMS_TM_IssueBlood> findByIssueBloodIdAndDeletedFalse(String issueBloodId);

    List<HMS_TM_IssueBlood> findAllByDeletedFalse();

    @Query("SELECT ib FROM HMS_TM_IssueBlood ib WHERE ib.ipdOrOpdId = :ipdOrOpdId AND ib.deleted = false")
    List<HMS_TM_IssueBlood> findByIpdOrOpdIdAndDeletedFalse(@Param("ipdOrOpdId") String ipdOrOpdId);


    @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_IssueBlood p " +
            "WHERE p.deleted = false " +
            "AND EXTRACT(MONTH FROM p.issueDate) = EXTRACT(MONTH FROM CURRENT_DATE) " +
            "AND EXTRACT(YEAR FROM p.issueDate) = EXTRACT(YEAR FROM CURRENT_DATE)")
    Double getMonthlyIssueBloodIncome();

    @Query("SELECT new com.hms.services.bloodbankmanagement.model.BillSummary(b.ipdOrOpdId, SUM(b.netAmount), SUM(b.paymentAmount)) " +
            "FROM HMS_TM_IssueBlood b " +
            "WHERE b.ipdOrOpdId = :ipdOrOpdId " +
            "GROUP BY b.ipdOrOpdId")
    Optional<BillSummary> getIssueBloodOpdAndIpdPayment(@Param("ipdOrOpdId") String ipdOrOpdId);

    @Query("SELECT COUNT(i) FROM HMS_TM_IssueBlood i WHERE i.patientId = :patientId")
    Integer countByPatientId(String patientId);


    @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_IssueBlood p " +
            "WHERE p.deleted = false AND EXTRACT(MONTH FROM p.issueDate) = :month AND EXTRACT(YEAR FROM p.issueDate) = :year")
    Double getTotalIssueBloodIncomeForMonth(@Param("month") int month, @Param("year") int year);


    @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_IssueBlood p " +
            "WHERE p.deleted = false AND EXTRACT(YEAR FROM p.issueDate) = :year")
    Double getTotalIssueBloodIncomeForYear(@Param("year") int year);


    @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_IssueBlood p " +
            "WHERE p.deleted = false AND p.issueDate >= :startOfWeek AND p.issueDate <= :endOfWeek")
    Double getTotalIssueBloodIncomeForWeek(@Param("startOfWeek") java.sql.Date startOfWeek, @Param("endOfWeek") java.sql.Date endOfWeek);


    @Query("SELECT p FROM HMS_TM_IssueBlood p " +
            "WHERE p.deleted = false " +
            "AND FUNCTION('DATE', p.issueDate) = CURRENT_DATE")
    List<HMS_TM_IssueBlood> getAllIssueBloodIncomeForToday();

    @Query("SELECT p FROM HMS_TM_IssueBlood p " +
            "WHERE p.deleted = false " +
            "AND EXTRACT(MONTH FROM p.issueDate) = :month " +
            "AND EXTRACT(YEAR FROM p.issueDate) = :year")
    List<HMS_TM_IssueBlood> getAllIssueBloodIncomeForMonth(@Param("month") int month, @Param("year") int year);

    @Query("SELECT p FROM HMS_TM_IssueBlood p " +
            "WHERE p.deleted = false " +
            "AND EXTRACT(YEAR FROM p.issueDate) = :year")
    List<HMS_TM_IssueBlood> getAllIssueBloodIncomeForYear(@Param("year") int year);

    @Query("SELECT p FROM HMS_TM_IssueBlood p " +
            "WHERE p.deleted = false " +
            "AND p.issueDate BETWEEN :startOfWeek AND :endOfWeek")
    List<HMS_TM_IssueBlood> getAllIssueBloodIncomeForWeek(@Param("startOfWeek") java.sql.Date startOfWeek,
                                                          @Param("endOfWeek") java.sql.Date endOfWeek);

    @Query("SELECT b FROM HMS_TM_IssueBlood b " +
            "WHERE (:paymentMode IS NULL OR b.paymentMode = :paymentMode) " +
            "AND (:bloodGroup IS NULL OR b.bloodGroup = :bloodGroup) " +
            "AND (:technician IS NULL OR b.technician = :technician) " +
            "AND (:isGstAdded IS NULL OR b.isGstAdded = :isGstAdded) " +
            "AND (CAST(:startDateTime AS timestamp) IS NULL OR b.createdAt >= :startDateTime) " +
            "AND (CAST(:endDateTime AS timestamp) IS NULL OR b.createdAt <= :endDateTime)" +
            "AND b.deleted = false")
    Page<HMS_TM_IssueBlood> findBloodIssuesWithFilters(
            @Param("paymentMode") String paymentMode,
            @Param("bloodGroup") String bloodGroup,
            @Param("technician") String technician,
            @Param("isGstAdded") Boolean isGstAdded,
            @Param("startDateTime") LocalDateTime startDateTime,
            @Param("endDateTime") LocalDateTime endDateTime,
            Pageable pageable);


    List<HMS_TM_IssueBlood> findByPatientIdAndDeletedFalse(String patientId);
}


