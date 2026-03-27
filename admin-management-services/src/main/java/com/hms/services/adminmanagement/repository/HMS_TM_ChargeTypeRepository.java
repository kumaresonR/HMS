package com.hms.services.adminmanagement.repository;


import com.hms.services.adminmanagement.entity.HMS_TM_ChargeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TM_ChargeTypeRepository extends JpaRepository<HMS_TM_ChargeType, String> {

    List<HMS_TM_ChargeType> findAllByIsActiveTrue();

    Optional<HMS_TM_ChargeType> findByChargeTypeIdAndIsActiveTrue(String chargeTypeId);

    Optional<HMS_TM_ChargeType> findByWtIdAndIsActiveTrue(String id);
}



