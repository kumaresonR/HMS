package com.hms.services.ambulancemanagement.repository;

import com.hms.services.ambulancemanagement.entity.HMS_TM_AmbulanceCallTransaction;
import com.hms.services.ambulancemanagement.model.AmbulancePaymentsWithPatientDTO;
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
public interface AmbulanceCallTransactionRepository extends JpaRepository<HMS_TM_AmbulanceCallTransaction, String> {

    List<HMS_TM_AmbulanceCallTransaction> findByVehicleChargeIdAndIsActiveTrue(String vehicleChargeId);

//    @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_AmbulanceCallTransaction p WHERE p.isActive = true")
@Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_AmbulanceCallTransaction p " +
        "WHERE p.isActive = true AND FUNCTION('DATE', p.date) = CURRENT_DATE")
    Double getAmbulanceIncome();
    @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_AmbulanceCallTransaction p " +
            "WHERE p.isActive = true AND FUNCTION('DATE', p.date) = :yesterday")
    Double getYesterdayAmbulanceIncome(@Param("yesterday") LocalDate yesterday);

    @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_AmbulanceCallTransaction p " +
            "WHERE p.isActive = true " +
            "AND EXTRACT(MONTH FROM p.date) = EXTRACT(MONTH FROM CURRENT_DATE) " +
            "AND EXTRACT(YEAR FROM p.date) = EXTRACT(YEAR FROM CURRENT_DATE)")
    Double getAmbulanceMonthlyIncome();

    @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_AmbulanceCallTransaction p " +
            "WHERE p.isActive = true AND EXTRACT(MONTH FROM p.date) = :month AND EXTRACT(YEAR FROM p.date) = :year")
    Double getMonthlyAmbulanceIncome(@Param("month") int month, @Param("year") int year);

    @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_AmbulanceCallTransaction p " +
            "WHERE p.isActive = true AND EXTRACT(YEAR FROM p.date) = :year")
    Double getYearlyAmbulanceIncome(@Param("year") int year);

    @Query("SELECT SUM(p.paymentAmount) FROM HMS_TM_AmbulanceCallTransaction p " +
            "WHERE p.isActive = true AND EXTRACT(WEEK FROM p.date) = :week " +
            "AND EXTRACT(YEAR FROM p.date) = :year")
    Double getWeeklyAmbulanceIncome(@Param("week") int week, @Param("year") int year);


    @Query("SELECT p FROM HMS_TM_AmbulanceCallTransaction p " +
            "WHERE p.isActive = true " +
            "AND FUNCTION('DATE', p.date) = CURRENT_DATE")
    List<HMS_TM_AmbulanceCallTransaction> getAllAmbulanceIncomeForToday();

    @Query("SELECT p FROM HMS_TM_AmbulanceCallTransaction p " +
            "WHERE p.isActive = true " +
            "AND EXTRACT(MONTH FROM p.date) = :month " +
            "AND EXTRACT(YEAR FROM p.date) = :year")
    List<HMS_TM_AmbulanceCallTransaction> getAllAmbulanceIncomeForMonth(@Param("month") int month, @Param("year") int year);

    @Query("SELECT p FROM HMS_TM_AmbulanceCallTransaction p " +
            "WHERE p.isActive = true " +
            "AND EXTRACT(YEAR FROM p.date) = :year")
    List<HMS_TM_AmbulanceCallTransaction> getAllAmbulanceIncomeForYear(@Param("year") int year);

    @Query("SELECT p FROM HMS_TM_AmbulanceCallTransaction p " +
            "WHERE p.isActive = true " +
            "AND EXTRACT(WEEK FROM p.date) = :week " +
            "AND EXTRACT(YEAR FROM p.date) = :year")
    List<HMS_TM_AmbulanceCallTransaction> getAllAmbulanceIncomeForWeek(@Param("week") int week, @Param("year") int year);


    @Query("SELECT new com.hms.services.ambulancemanagement.model.AmbulancePaymentsWithPatientDTO(t, c, v) " +
            "FROM HMS_TM_AmbulanceCallTransaction t " +
            "JOIN HMS_TM_AddAmbulanceCall c ON t.vehicleChargeId = c.vehicleChargeId " +
            "JOIN HMS_TM_AddVehicle v ON c.vehicleId = v.vehicleId " +
            "WHERE (:paymentMode IS NULL OR t.paymentMode = :paymentMode) " +
            "AND (:isGstAdded IS NULL OR c.isGstAdded = :isGstAdded) " +
            "AND (CAST(:startDateTime AS timestamp) IS NULL OR t.createdAt >= :startDateTime) " +
            "AND (CAST(:endDateTime AS timestamp) IS NULL OR t.createdAt <= :endDateTime)")
    Page<AmbulancePaymentsWithPatientDTO> findAmbulancePaymentsWithFilters(
            @Param("paymentMode") String paymentMode,
            @Param("isGstAdded") Boolean isGstAdded,
            @Param("startDateTime") LocalDateTime startDateTime,
            @Param("endDateTime") LocalDateTime endDateTime,
            Pageable pageable);

}


