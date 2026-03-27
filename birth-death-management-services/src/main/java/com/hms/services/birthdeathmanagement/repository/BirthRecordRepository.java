package com.hms.services.birthdeathmanagement.repository;

import com.hms.services.birthdeathmanagement.entity.HMS_TM_BirthRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BirthRecordRepository extends JpaRepository<HMS_TM_BirthRecord, String> {

    @Query("SELECT MAX(b.birthRecordId) FROM HMS_TM_BirthRecord b")
    String findMaxBirthRecordId();

    Optional<HMS_TM_BirthRecord> findByBirthRecordIdAndDeletedFalse(String birthRecordId);

    List<HMS_TM_BirthRecord> findAllByDeletedFalse();


    @Query("SELECT b FROM HMS_TM_BirthRecord b " +
            "WHERE b.deleted = false " +
            "AND (LOWER(b.ipdOrOpdId) LIKE LOWER(CONCAT('%', :ipdOrOpdId, '%')) " +
            "OR LOWER(b.motherName) LIKE LOWER(CONCAT('%', :motherName, '%')))")
    List<HMS_TM_BirthRecord> findByDeletedFalseAndIpdOrOpdIdContainingIgnoreCaseOrMotherNameContainingIgnoreCase(
            @Param("ipdOrOpdId") String ipdOrOpdId,
            @Param("motherName") String motherName);


    @Query("SELECT b FROM HMS_TM_BirthRecord b WHERE b.dateOfBirth BETWEEN :startDateTime AND :endDateTime AND b.deleted = false")
    List<HMS_TM_BirthRecord> findByDateOfBirthBetweenAndDeletedFalse(@Param("startDateTime") LocalDateTime startDateTime,
                                                                     @Param("endDateTime") LocalDateTime endDateTime);
}


