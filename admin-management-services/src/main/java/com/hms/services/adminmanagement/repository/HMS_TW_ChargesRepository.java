package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TW_Charges;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TW_ChargesRepository extends JpaRepository<HMS_TW_Charges, String> {

    List<HMS_TW_Charges> findAllByIsActiveTrue();


    Optional<HMS_TW_Charges> findByChargeIdAndIsActiveTrue(String workId);

    HMS_TW_Charges findByCategoryIdAndIsActiveTrue(String categoryId);
}



