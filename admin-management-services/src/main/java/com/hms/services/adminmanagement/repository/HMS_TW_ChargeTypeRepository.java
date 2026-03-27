package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TW_ChargeType;
import com.hms.services.adminmanagement.model.ChargeTypeDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TW_ChargeTypeRepository extends JpaRepository<HMS_TW_ChargeType, String> {

    List<HMS_TW_ChargeType> findAllByIsActiveTrue();

    Optional<HMS_TW_ChargeType> findByChargeTypeIdAndIsActiveTrue(String workId);
}



