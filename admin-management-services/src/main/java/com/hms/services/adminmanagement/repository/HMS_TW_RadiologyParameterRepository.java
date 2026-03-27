package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TW_RadiologyParameter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TW_RadiologyParameterRepository extends JpaRepository<HMS_TW_RadiologyParameter, String> {

    Optional<HMS_TW_RadiologyParameter> findByParameterIdAndDeletedFalse(String parameterId);
    List<HMS_TW_RadiologyParameter> findByDeletedFalse();
}




