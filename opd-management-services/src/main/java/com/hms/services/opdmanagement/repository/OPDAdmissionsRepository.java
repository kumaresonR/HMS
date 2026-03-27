package com.hms.services.opdmanagement.repository;



import com.hms.services.opdmanagement.entity.HMS_TM_OPDAdmissions;
import com.hms.services.opdmanagement.entity.HMS_TM_OPDCharges;
import com.hms.services.opdmanagement.entity.HMS_TM_OPDPayments;
import com.hms.services.opdmanagement.model.OPDChargeWithPatientDTO;
import com.hms.services.opdmanagement.model.OPDPaymentsWithPatientDTO;
import com.hms.services.opdmanagement.model.SearchPrescriptionDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.net.ContentHandler;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OPDAdmissionsRepository extends JpaRepository<HMS_TM_OPDAdmissions, String> {

//    Optional<HMS_TM_IPDAdmissions> findTopByOrderByIpdIdDesc();

    Optional<HMS_TM_OPDAdmissions> findTopByOrderByCaseIdDesc();

    Optional<HMS_TM_OPDAdmissions> findByOpdIdAndIsActiveTrue(String opdId);

    Page<HMS_TM_OPDAdmissions> findAllByIsActiveTrueAndDischargeDateIsNull(Pageable pageable);

    Optional<HMS_TM_OPDAdmissions> findByAdmissionIdAndIsActiveTrue(String id);

    Optional<HMS_TM_OPDAdmissions> findTopByOrderByCreatedAtDesc();

    @Query("SELECT o.opdId FROM HMS_TM_OPDAdmissions o WHERE o.patientId = :patientId AND o.isActive = true")
    List<String> findOpdIdsByPatientId(@Param("patientId") String patientId);

//    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN TRUE ELSE FALSE END FROM HMS_TM_OPDAdmissions a " +
//            "WHERE a.patientId = :patientId AND a.isActive = TRUE AND (a.dischargeDate IS NULL OR a.dischargeDate < :currentDate)")
@Query("SELECT CASE WHEN COUNT(a) > 0 THEN TRUE ELSE FALSE END FROM HMS_TM_OPDAdmissions a " +
        "WHERE a.patientId = :patientId AND a.isActive = TRUE " +
        "AND (a.dischargeDate IS NULL OR a.dischargeDate > :currentDate)")
    boolean existsByPatientIdAndIsActiveTrueAndDischargeDateAfter(String patientId, LocalDateTime currentDate);

    @Query("SELECT new com.hms.services.opdmanagement.model.SearchPrescriptionDTO( " +
            "a.patientId, pr.patientId, pr.prescriptionNo, pr.pharmacyPaid, pr.pathologyPaid, pr.radiologyPaid) " +
            "FROM HMS_TM_OPDAdmissions a " +
            "JOIN HMS_TM_OPDPrescriptions pr ON a.patientId = pr.patientId " +
            "WHERE a.isActive = TRUE AND a.dischargeDate IS NULL " +
            "AND a.patientId = :id " +
            "AND (pr.pharmacyPaid = FALSE OR pr.pathologyPaid = FALSE OR pr.radiologyPaid = FALSE)")
    List<SearchPrescriptionDTO> findPrescriptionsForNonDischargedPatient(@Param("id") String id);

    @Query("SELECT i.opdId FROM HMS_TM_OPDAdmissions i " +
            "WHERE i.patientId = :patientId AND i.dischargeDate IS NULL AND i.isActive = true")
    Optional<String> findActiveIpdIdByPatientId(String patientId);
    @Query("SELECT COUNT(i) FROM HMS_TM_OPDAdmissions i WHERE i.patientId = :patientId")
    Integer countByPatientId(@Param("patientId") String patientId);

    @Query("SELECT i FROM HMS_TM_OPDAdmissions i " +
            "WHERE (:doctorId IS NULL OR i.doctorId = :doctorId) " +
            "AND (:symptomsTitle IS NULL OR i.symptomsTitle = :symptomsTitle) " +
            "AND (CAST(:startDate AS timestamp) IS NULL OR i.appointmentDate >= :startDate) " +
            "AND (CAST(:endDate AS timestamp) IS NULL OR i.appointmentDate <= :endDate)")
    List<HMS_TM_OPDAdmissions> findOPDAdmissions(
            @Param("doctorId") String doctorId,
            @Param("symptomsTitle") String symptomsTitle,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    Optional<HMS_TM_OPDAdmissions> findByOpdIdAndAntenatalTrueAndIsActiveTrue(String opdOrIpdId);

    Page<HMS_TM_OPDAdmissions> findAllByIsActiveTrueAndDischargeDateIsNotNull(Pageable pageable);

    @Query("SELECT h FROM HMS_TM_OPDAdmissions h WHERE h.dischargeDate IS NOT NULL AND LOWER(h.dischargeStatus) = LOWER(:dischargeStatus) AND h.isActive = true AND h.opdId = :opdId")
    Optional<HMS_TM_OPDAdmissions> findByDischargeDateIsNotNullAndDischargeStatusIgnoreCaseAndIsActiveTrue(
            String opdId,
            String dischargeStatus
    );

    Optional<HMS_TM_OPDAdmissions> findByAdmissionId(String patientId);


    @Query("SELECT new com.hms.services.opdmanagement.model.OPDChargeWithPatientDTO(c, a.patientId,a.doctorId) " +
            "FROM HMS_TM_OPDCharges c, HMS_TM_OPDAdmissions a " +
            "WHERE c.opdId = a.opdId " +
            "AND (:doctorId IS NULL OR a.doctorId = :doctorId) " +
            "AND (:symptomsTitle IS NULL OR a.symptomsTitle = :symptomsTitle) " +
            "AND (:isGstAdded IS NULL OR c.isGstAdded = :isGstAdded) " +
            "AND (CAST(:startDate AS timestamp) IS NULL OR a.appointmentDate >= :startDate) " +
            "AND (CAST(:endDate AS timestamp) IS NULL OR a.appointmentDate <= :endDate)")
    Page<OPDChargeWithPatientDTO> findOPDChargesWithFiltersPaginated(
            @Param("doctorId") String doctorId,
            @Param("symptomsTitle") String symptomsTitle,
            @Param("isGstAdded") Boolean isGstAdded,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable
    );




    @Query("SELECT new com.hms.services.opdmanagement.model.OPDPaymentsWithPatientDTO(p, a.patientId) " +
            "FROM HMS_TM_OPDPayments p " +
            "JOIN HMS_TM_OPDCharges c ON p.opdId = c.opdId " +
            "JOIN HMS_TM_OPDAdmissions a ON c.opdId = a.opdId " +
            "WHERE (:paymentMode IS NULL OR p.paymentMode = :paymentMode) " +
            "AND (CAST(:startDate AS timestamp) IS NULL OR p.createdAt >= :startDate) " +
            "AND (CAST(:endDate AS timestamp) IS NULL OR p.createdAt <= :endDate)")
    Page<OPDPaymentsWithPatientDTO> findOPDPaymentsWithFilters(
            @Param("paymentMode") String paymentMode,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable
    );


    Optional<HMS_TM_OPDAdmissions> findByOpdIdAndPatientIdAndIsActiveTrue(String opdId, String patientId);

    Optional<HMS_TM_OPDAdmissions> findByPatientIdAndIsActiveTrue(String patientId);

    @Query("SELECT a FROM HMS_TM_OPDAdmissions a WHERE a.isActive = true " +
            "AND a.dischargeDate IS NULL " +
            "AND (LOWER(a.opdId) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(a.patientId) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<HMS_TM_OPDAdmissions> searchByOpdIdOrPatientIdOrPatientName(@Param("searchTerm") String searchTerm);


    @Query("SELECT a FROM HMS_TM_OPDAdmissions a WHERE a.patientId IN :patientIds AND a.isActive = true AND a.dischargeDate IS NULL")
    List<HMS_TM_OPDAdmissions> findAllActiveAdmissionsWithoutDischarge(@Param("patientIds") List<String> patientIds);


    List<HMS_TM_OPDAdmissions> findAllByPatientIdInAndIsActiveTrueAndDischargeDateIsNotNull(List<String> patientIds);
}

