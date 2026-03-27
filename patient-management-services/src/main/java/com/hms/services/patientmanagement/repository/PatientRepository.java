package com.hms.services.patientmanagement.repository;

import com.hms.services.patientmanagement.entity.HMS_TM_Patients;
import com.hms.services.patientmanagement.model.SearchPatientDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<HMS_TM_Patients, String> {

//    boolean existsByPatientId(String id);
//
//    void deleteByPatientId(String id);
//
//    Page<HMS_TM_Patients> findAll(Pageable pageable);

    Optional<HMS_TM_Patients> findTopByOrderByCreatedAtDesc();

    Page<HMS_TM_Patients> findAllByIsActiveTrue(Pageable pageable);

    Optional<HMS_TM_Patients> findByPatientIdAndIsActiveTrue(String id);

    Optional<HMS_TM_Patients> findByIdAndIsActiveTrue(String id);

    @Query("SELECT new com.hms.services.patientmanagement.model.SearchPatientDTO(p.id, CONCAT(p.firstName, ' ', p.lastName, ' (', p.patientId, ')'), p.patientId) " +
            "FROM HMS_TM_Patients p " +
            "WHERE p.isActive = true AND (" +
            "LOWER(p.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(p.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(p.patientId) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(p.contactNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<SearchPatientDTO> findPatientsBySearchTermIsActiveTrue(@Param("searchTerm") String searchTerm);

    List<HMS_TM_Patients> findAllByPatientIdInAndIsActiveTrue(List<String> patientIds);

    @Query("SELECT p FROM HMS_TM_Patients p " +
            "WHERE (LOWER(p.patientId) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(p.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(p.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
            "AND p.isActive = true")
    List<HMS_TM_Patients> findPatientsBySearchTerm(@Param("searchTerm") String searchTerm);



//    @Query(value = "SELECT p.id, " +
//            "CONCAT(p.first_name, ' ', p.last_name, ' (', p.patient_id, ')') AS name, " +
//            "p.patient_id, " +
//            "GROUP_CONCAT(pr.prescription_id) AS prescriptionNos " +
//            "FROM HMS_TM_Patients p " +
//            "JOIN HMS_TM_Prescriptions pr ON p.patient_id = pr.patient_id " +
//            "WHERE p.is_active = true AND (" +
//            "LOWER(p.first_name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
//            "OR LOWER(p.last_name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
//            "OR LOWER(p.patient_id) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
//            "OR LOWER(p.contact_number) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
//            "GROUP BY p.id, p.first_name, p.last_name, p.patient_id",
//            nativeQuery = true)
//    List<SearchPrescriptionDTO> findPatientsWithPrescriptionsBySearchTerm(@Param("searchTerm") String searchTerm);


}

