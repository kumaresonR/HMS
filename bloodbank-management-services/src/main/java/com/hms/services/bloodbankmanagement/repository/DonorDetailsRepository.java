package com.hms.services.bloodbankmanagement.repository;

import com.hms.services.bloodbankmanagement.entity.HMS_TM_DonorDetails;
import com.hms.services.bloodbankmanagement.model.BloodDonorDetailsDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DonorDetailsRepository extends JpaRepository<HMS_TM_DonorDetails, String> {

    Optional<HMS_TM_DonorDetails> findByDonorIdAndDeletedFalse(String donorId);

    List<HMS_TM_DonorDetails> findAllByDeletedFalse();


    Page<HMS_TM_DonorDetails> findByDonorNameContainingIgnoreCaseAndDeletedFalse(String donorName, Pageable pageable);

    @Query("SELECT new com.hms.services.bloodbankmanagement.model.BloodDonorDetailsDTO(b, d) " +
            "FROM HMS_TM_BloodDonorDetails b " +
            "JOIN HMS_TM_DonorDetails d ON b.donorId = d.donorId " +
            "WHERE (:donorName IS NULL OR d.donorName LIKE %:donorName%) " +
            "AND (:bloodGroup IS NULL OR d.bloodGroup = :bloodGroup) " +
            "AND (:paymentMode IS NULL OR b.paymentMode = :paymentMode) " +
            "AND (CAST(:startDateTime AS timestamp) IS NULL OR b.donateDate >= :startDateTime) " +
            "AND (CAST(:endDateTime AS timestamp) IS NULL OR b.donateDate <= :endDateTime)" +
            "AND b.deleted = false " +
            "AND d.deleted = false")
    Page<BloodDonorDetailsDTO> findBloodDonorsWithFilters(
            @Param("donorName") String donorName,
            @Param("bloodGroup") String bloodGroup,
            @Param("paymentMode") String paymentMode,
            @Param("startDateTime") LocalDateTime startDateTime,
            @Param("endDateTime") LocalDateTime endDateTime,
            Pageable pageable);

}


