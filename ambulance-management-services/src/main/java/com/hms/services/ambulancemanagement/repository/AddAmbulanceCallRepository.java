package com.hms.services.ambulancemanagement.repository;

import com.hms.services.ambulancemanagement.entity.HMS_TM_AddAmbulanceCall;
import com.hms.services.ambulancemanagement.model.BillSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface AddAmbulanceCallRepository extends JpaRepository<HMS_TM_AddAmbulanceCall, String> {


    List<HMS_TM_AddAmbulanceCall> findAllByIsActiveTrueOrderByCreatedAtDesc();

    Optional<HMS_TM_AddAmbulanceCall> findByVehicleChargeIdAndIsActiveTrue(String id);

    @Query("SELECT new com.hms.services.ambulancemanagement.model.BillSummary(" +
            "a.ipdOrOpdId, " +
            "SUM(a.netAmount), " +
            "SUM(t.paymentAmount)) " +
            "FROM HMS_TM_AddAmbulanceCall a " +
            "LEFT JOIN HMS_TM_AmbulanceCallTransaction t " +
            "ON a.vehicleChargeId = t.vehicleChargeId " +
            "WHERE a.ipdOrOpdId = :ipdOrOpdId " +
            "GROUP BY a.ipdOrOpdId")
    Optional<BillSummary> findAmbulanceBillSummaryByIpdOrOpdId(@Param("ipdOrOpdId") String ipdOrOpdId);

    @Query("SELECT COUNT(a) FROM HMS_TM_AddAmbulanceCall a WHERE a.patientId = :patientId")
    Integer countByPatientId(String patientId);

    @Query("SELECT a FROM HMS_TM_AddAmbulanceCall a " +
            "WHERE a.isActive = true " +
            "AND (a.ipdOrOpdId = :ipdOrOpdId OR a.patientId = :patientId) " +
            "ORDER BY a.createdAt DESC")
    List<HMS_TM_AddAmbulanceCall> findByIsActiveTrueAndIpdOrOpdIdOrPatientIdOrderByCreatedAtDesc(
            @Param("ipdOrOpdId") String ipdOrOpdId,
            @Param("patientId") String patientId);

}


