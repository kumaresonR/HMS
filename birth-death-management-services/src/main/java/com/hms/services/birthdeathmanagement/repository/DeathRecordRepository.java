package com.hms.services.birthdeathmanagement.repository;

import com.hms.services.birthdeathmanagement.entity.HMS_TM_DeathRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Repository
public interface DeathRecordRepository extends JpaRepository<HMS_TM_DeathRecord, String> {

    @Query("SELECT MAX(d.deathId) FROM HMS_TM_DeathRecord d")
    String findMaxDeathRecordId();

    Optional<HMS_TM_DeathRecord> findByDeathIdAndDeletedFalse(String deathId);

    List<HMS_TM_DeathRecord> findAllByDeletedFalse();

    @Query("SELECT d FROM HMS_TM_DeathRecord d " +
            "WHERE d.deleted = false " +
            "AND (LOWER(d.ipdOrOpdId) LIKE LOWER(CONCAT('%', :ipdOrOpdId, '%')) " +
            "OR LOWER(d.patientName) LIKE LOWER(CONCAT('%', :patientName, '%')))")
    List<HMS_TM_DeathRecord> findByDeletedFalseAndIpdOrOpdIdContainingIgnoreCaseOrPatientNameContainingIgnoreCase(
            @Param("ipdOrOpdId") String ipdOrOpdId,
            @Param("patientName") String patientName);


    @Query("SELECT d FROM HMS_TM_DeathRecord d WHERE d.dateOfDeath BETWEEN :startDateTime AND :endDateTime AND d.deleted = false")
    List<HMS_TM_DeathRecord> findByDateOfDeathBetweenAndDeletedFalse(@Param("startDateTime") LocalDateTime startDateTime,
                                                                     @Param("endDateTime") LocalDateTime endDateTime);

}


