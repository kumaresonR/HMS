package com.hms.services.bloodbankmanagement.repository;

import com.hms.services.bloodbankmanagement.entity.HMS_TM_BagStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BagStockRepository extends JpaRepository<HMS_TM_BagStock, String> {
    List<HMS_TM_BagStock> findByDonorId(String donorId);

    Optional<HMS_TM_BagStock> findByBagStockIdAndDeletedFalse(String bagStockId);

    List<HMS_TM_BagStock> findByDeletedFalse();
}


