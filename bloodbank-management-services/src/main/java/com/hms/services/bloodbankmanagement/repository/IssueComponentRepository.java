package com.hms.services.bloodbankmanagement.repository;

import com.hms.services.bloodbankmanagement.entity.HMS_TM_IssueComponent;
import com.hms.services.bloodbankmanagement.model.BillSummary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface IssueComponentRepository extends JpaRepository<HMS_TM_IssueComponent, String> {
    @Query("SELECT MAX(c.issueComponentId) FROM HMS_TM_IssueComponent c")
    String findMaxIssueComponentId();
//    @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_IssueComponent p WHERE p.deleted = false")

    @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_IssueComponent p " +
        "WHERE p.deleted = false AND FUNCTION('DATE', p.issueDate) = CURRENT_DATE")
    Double getTotalIssueComponentIncome();
    @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_IssueComponent p " +
            "WHERE p.deleted = false AND FUNCTION('DATE', p.issueDate) =:yesterday")
    Double getYesterdayIssueComponentIncome(@Param("yesterday") LocalDate yesterday);

    Optional<HMS_TM_IssueComponent> findByIssueComponentIdAndDeletedFalse(String issueComponentId);

    List<HMS_TM_IssueComponent> findAllByDeletedFalse();

    @Query("SELECT ic FROM HMS_TM_IssueComponent ic WHERE ic.ipdOrOpdId = :ipdOrOpdId AND ic.deleted = false")
    List<HMS_TM_IssueComponent> findByIpdOrOpdIdAndDeletedFalse(@Param("ipdOrOpdId") String ipdOrOpdId);


    @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_IssueComponent p " +
            "WHERE p.deleted = false " +
            "AND EXTRACT(MONTH FROM p.issueDate) = EXTRACT(MONTH FROM CURRENT_DATE) " +
            "AND EXTRACT(YEAR FROM p.issueDate) = EXTRACT(YEAR FROM CURRENT_DATE)")
    Double getMonthlyIssueComponentIncome();

    @Query("SELECT new com.hms.services.bloodbankmanagement.model.BillSummary(b.ipdOrOpdId, SUM(b.netAmount), SUM(b.paymentAmount)) " +
            "FROM HMS_TM_IssueComponent b " +
            "WHERE b.ipdOrOpdId = :ipdOrOpdId " +
            "GROUP BY b.ipdOrOpdId")
    Optional<BillSummary> getIssueComponentOpdAndIpdPayment(@Param("ipdOrOpdId") String ipdOrOpdId);

    @Query("SELECT COUNT(i) FROM HMS_TM_IssueComponent i WHERE i.patientId = :patientId")
    Integer countByPatientId(String patientId);


    @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_IssueComponent p " +
            "WHERE p.deleted = false AND EXTRACT(MONTH FROM p.issueDate) = :month AND EXTRACT(YEAR FROM p.issueDate) = :year")
    Double getTotalIssueComponentIncomeForMonth(@Param("month") int month, @Param("year") int year);


    @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_IssueComponent p " +
            "WHERE p.deleted = false AND EXTRACT(YEAR FROM p.issueDate) = :year")
    Double getTotalIssueComponentIncomeForYear(@Param("year") int year);

    @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_IssueComponent p " +
            "WHERE p.deleted = false AND p.issueDate >= :startOfWeek AND p.issueDate <= :endOfWeek")
    Double getTotalIssueComponentIncomeForWeek(@Param("startOfWeek") java.sql.Date startOfWeek,
                                               @Param("endOfWeek") java.sql.Date endOfWeek);

    @Query("SELECT p FROM HMS_TM_IssueComponent p " +
            "WHERE p.deleted = false " +
            "AND FUNCTION('DATE', p.issueDate) = CURRENT_DATE")
    List<HMS_TM_IssueComponent> getAllIssueComponentIncomeForToday();

    @Query("SELECT p FROM HMS_TM_IssueComponent p " +
            "WHERE p.deleted = false " +
            "AND EXTRACT(MONTH FROM p.issueDate) = :month " +
            "AND EXTRACT(YEAR FROM p.issueDate) = :year")
    List<HMS_TM_IssueComponent> getAllIssueComponentIncomeForMonth(@Param("month") int month, @Param("year") int year);

    @Query("SELECT p FROM HMS_TM_IssueComponent p " +
            "WHERE p.deleted = false " +
            "AND EXTRACT(YEAR FROM p.issueDate) = :year")
    List<HMS_TM_IssueComponent> getAllIssueComponentIncomeForYear(@Param("year") int year);

    @Query("SELECT p FROM HMS_TM_IssueComponent p " +
            "WHERE p.deleted = false " +
            "AND p.issueDate BETWEEN :startOfWeek AND :endOfWeek")
    List<HMS_TM_IssueComponent> getAllIssueComponentIncomeForWeek(@Param("startOfWeek") java.sql.Date startOfWeek,
                                                                  @Param("endOfWeek") java.sql.Date endOfWeek);

    @Query("SELECT b FROM HMS_TM_IssueComponent b " +
            "WHERE (:paymentMode IS NULL OR b.paymentMode = :paymentMode) " +
            "AND (:bloodGroup IS NULL OR b.bloodGroup = :bloodGroup) " +
            "AND (:technician IS NULL OR b.technician = :technician) " +
            "AND (:components IS NULL OR b.components = :components) " +
            "AND (:isGstAdded IS NULL OR b.isGstAdded = :isGstAdded) " +
            "AND (CAST(:startDateTime AS timestamp) IS NULL OR b.createdAt >= :startDateTime) " +
            "AND (CAST(:endDateTime AS timestamp) IS NULL OR b.createdAt <= :endDateTime)" +
            "AND b.deleted = false")
    Page<HMS_TM_IssueComponent> findBloodComponentWithFilters(
            @Param("paymentMode") String paymentMode,
            @Param("bloodGroup") String bloodGroup,
            @Param("technician") String technician,
            @Param("components") String components,
            @Param("isGstAdded") Boolean isGstAdded,
            @Param("startDateTime") LocalDateTime startDateTime,
            @Param("endDateTime") LocalDateTime endDateTime,
            Pageable pageable);


    @Query("SELECT i FROM HMS_TM_IssueComponent i " +
            "WHERE i.patientId = :patientId " +
            "AND i.ipdOrOpdId = :ipdOrOpdId " +
            "AND i.deleted = false")
    List<HMS_TM_IssueComponent> findByPatientIdAndIpdOrOpdIdAndDeletedFalse(
            @Param("patientId") String patientId,
            @Param("ipdOrOpdId") String ipdOrOpdId);


    List<HMS_TM_IssueComponent> findByPatientIdAndDeletedFalse(String patientId);

}


