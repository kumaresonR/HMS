package com.hms.services.bloodbankmanagement.repository;

import com.hms.services.bloodbankmanagement.entity.HMS_TM_BloodDonorDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BloodDonorDetailsRepository extends JpaRepository<HMS_TM_BloodDonorDetails, String> {
    List<HMS_TM_BloodDonorDetails> findByDeletedFalse();
    Optional<HMS_TM_BloodDonorDetails> findByBloodDonorIdAndDeletedFalse(String donorId);

    Optional<Object> findByDonorIdAndDeletedFalse(String donorId);
}



