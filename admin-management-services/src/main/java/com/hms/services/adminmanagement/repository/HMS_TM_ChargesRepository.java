package com.hms.services.adminmanagement.repository;


import com.hms.services.adminmanagement.entity.HMS_TM_Charges;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TM_ChargesRepository extends JpaRepository<HMS_TM_Charges, String> {

    List<HMS_TM_Charges> findAllByIsActiveTrue();

    Optional<HMS_TM_Charges> findBychargeIdAndIsActiveTrue(String id);

    Optional<HMS_TM_Charges> findByChargeIdAndIsActiveTrue(String id);

    HMS_TM_Charges findByCategoryIdAndIsActiveTrue(String categoryId);

    Optional<HMS_TM_Charges> findByWtIdAndIsActiveTrue(String id);
}



