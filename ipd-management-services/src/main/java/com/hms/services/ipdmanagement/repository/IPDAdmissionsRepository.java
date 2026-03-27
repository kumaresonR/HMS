package com.hms.services.ipdmanagement.repository;


import com.hms.services.ipdmanagement.entity.HMS_TM_IPDAdmissions;
import com.hms.services.ipdmanagement.model.IPDChargeWithPatientDTO;
import com.hms.services.ipdmanagement.model.IPDPaymentsWithPatientDTO;
import com.hms.services.ipdmanagement.model.SearchPrescriptionDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Range;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.net.ContentHandler;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface IPDAdmissionsRepository extends JpaRepository<HMS_TM_IPDAdmissions, String> {

//    Optional<HMS_TM_IPDAdmissions> findTopByOrderByIpdIdDesc();

    Optional<HMS_TM_IPDAdmissions> findTopByOrderByCaseIdDesc();

    Optional<HMS_TM_IPDAdmissions> findByIpdIdAndIsActiveTrue(String ipdId);

    Page<HMS_TM_IPDAdmissions> findAllByIsActiveTrueAndDischargeDateIsNull(Pageable pageable);

    Optional<HMS_TM_IPDAdmissions> findByAdmissionIdAndIsActiveTrue(String id);

    Optional<HMS_TM_IPDAdmissions> findTopByOrderByCreatedAtDesc();

//    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN TRUE ELSE FALSE END FROM HMS_TM_IPDAdmissions a " +
//            "WHERE a.patientId = :patientId AND a.isActive = TRUE AND (a.dischargeDate IS NULL OR a.dischargeDate < :currentDate)")
@Query("SELECT CASE WHEN COUNT(a) > 0 THEN TRUE ELSE FALSE END FROM HMS_TM_IPDAdmissions a " +
        "WHERE a.patientId = :patientId AND a.isActive = TRUE " +
        "AND (a.dischargeDate IS NULL OR a.dischargeDate > :currentDate)")
    boolean existsByPatientIdAndIsActiveTrueAndDischargeDateAfter(String patientId, LocalDateTime currentDate);

    @Query("SELECT new com.hms.services.ipdmanagement.model.SearchPrescriptionDTO( " +
            "a.patientId, pr.patientId, pr.prescriptionNo, pr.pharmacyPaid, pr.pathologyPaid, pr.radiologyPaid) " +
            "FROM HMS_TM_IPDAdmissions a " +
            "JOIN HMS_TM_Prescriptions pr ON a.patientId = pr.patientId " +
            "WHERE a.isActive = TRUE " +
            "AND a.dischargeDate IS NULL " +
            "AND a.patientId = :id " +
            "AND (pr.pharmacyPaid = FALSE OR pr.pathologyPaid = FALSE OR pr.radiologyPaid = FALSE)")
    List<SearchPrescriptionDTO> findPrescriptionsForNonDischargedPatient(@Param("id") String id);

    @Query("SELECT i.ipdId FROM HMS_TM_IPDAdmissions i " +
            "WHERE i.patientId = :patientId AND i.dischargeDate IS NULL AND i.isActive = true")
    Optional<String> findActiveIpdIdByPatientId(@Param("patientId") String patientId);

    @Query("SELECT i FROM HMS_TM_IPDAdmissions i " +
            "WHERE (:doctorId IS NULL OR i.doctorId = :doctorId) " +
            "AND (:symptomsTitle IS NULL OR i.symptomsTitle = :symptomsTitle) " +
            "AND (CAST(:startDate AS timestamp) IS NULL OR i.admissionDate >= :startDate) " +
            "AND (CAST(:endDate AS timestamp) IS NULL OR i.admissionDate <= :endDate)")
    List<HMS_TM_IPDAdmissions> findIPDAdmissions(
            @Param("doctorId") String doctorId,
            @Param("symptomsTitle") String symptomsTitle,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    Optional<HMS_TM_IPDAdmissions> findByIpdIdAndAntenatalTrueAndIsActiveTrue(String opdOrIpdId);

    Page<HMS_TM_IPDAdmissions> findAllByIsActiveTrueAndDischargeDateIsNotNull(Pageable pageable);

    @Query("SELECT h FROM HMS_TM_IPDAdmissions h WHERE h.dischargeDate IS NOT NULL AND LOWER(h.dischargeStatus) = LOWER(:dischargeStatus) AND h.isActive = true AND h.ipdId = :ipdId")
    Optional<HMS_TM_IPDAdmissions> findByDischargeDateIsNotNullAndDischargeStatusIgnoreCaseAndIsActiveTrue(
            String ipdId,
            String dischargeStatus
    );

    Optional<HMS_TM_IPDAdmissions> findByAdmissionId(String patientId);


    @Query("SELECT new com.hms.services.ipdmanagement.model.IPDChargeWithPatientDTO(c, a.patientId,a.doctorId) " +
            "FROM HMS_TM_IPDCharges c, HMS_TM_IPDAdmissions a " +
            "WHERE c.ipdId = a.ipdId " +
            "AND (:doctorId IS NULL OR a.doctorId = :doctorId) " +
            "AND (:symptomsTitle IS NULL OR a.symptomsTitle = :symptomsTitle) " +
            "AND (:isGstAdded IS NULL OR c.isGstAdded = :isGstAdded) " +  // fixed alias from b to c
            "AND (CAST(:startDate AS timestamp) IS NULL OR a.admissionDate >= :startDate) " +
            "AND (CAST(:endDate AS timestamp) IS NULL OR a.admissionDate <= :endDate)")
    Page<IPDChargeWithPatientDTO> findIPDChargesWithFiltersPaged(
            @Param("doctorId") String doctorId,
            @Param("symptomsTitle") String symptomsTitle,
            @Param("isGstAdded") Boolean isGstAdded,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable
    );



    @Query("SELECT new com.hms.services.ipdmanagement.model.IPDPaymentsWithPatientDTO(p, a.patientId) " +
            "FROM HMS_TM_IPDPayments p " +
            "JOIN HMS_TM_IPDCharges c ON p.ipdId = c.ipdId " +
            "JOIN HMS_TM_IPDAdmissions a ON c.ipdId = a.ipdId " +
            "WHERE (:paymentMode IS NULL OR p.paymentMode = :paymentMode) " +
            "AND (CAST(:startDateTime AS timestamp) IS NULL OR p.createdAt >= :startDateTime) " +
            "AND (CAST(:endDateTime AS timestamp) IS NULL OR p.createdAt <= :endDateTime)")
    Page<IPDPaymentsWithPatientDTO> findIPDPaymentsWithFilters(
            @Param("paymentMode") String paymentMode,
            @Param("startDateTime") LocalDateTime startDateTime,
            @Param("endDateTime") LocalDateTime endDateTime,
            Pageable pageable
    );


    Optional<HMS_TM_IPDAdmissions> findByIpdIdAndPatientIdAndIsActiveTrue(String ipdId, String patientId);

    Optional<HMS_TM_IPDAdmissions> findByPatientIdAndIsActiveTrue(String patientId);

    @Query("SELECT a FROM HMS_TM_IPDAdmissions a WHERE a.isActive = true " +
            "AND a.dischargeDate IS NULL " +
            "AND (LOWER(a.ipdId) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(a.patientId) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<HMS_TM_IPDAdmissions> searchByIpdIdOrPatientIdOrPatientName(@Param("searchTerm") String searchTerm);

    @Query("SELECT a FROM HMS_TM_IPDAdmissions a WHERE a.patientId IN :patientIds AND a.isActive = true AND a.dischargeDate IS NULL")
    List<HMS_TM_IPDAdmissions> findAllActiveAdmissionsWithoutDischarge(List<String> patientIds);

    List<HMS_TM_IPDAdmissions> findAllByPatientIdInAndIsActiveTrueAndDischargeDateIsNotNull(List<String> patientIds);
}

