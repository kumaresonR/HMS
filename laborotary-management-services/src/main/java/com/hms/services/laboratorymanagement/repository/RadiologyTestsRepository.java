package com.hms.services.laboratorymanagement.repository;

import com.hms.services.laboratorymanagement.entity.HMS_TM_RadiologyTests;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RadiologyTestsRepository extends JpaRepository<HMS_TM_RadiologyTests, String> {

    List<HMS_TM_RadiologyTests> findByRadiologyTestIdIn(List<String> testIds);
    Optional<HMS_TM_RadiologyTests> findByRadiologyTestIdAndDeletedFalse(String radiologyTestId);

    List<HMS_TM_RadiologyTests> findAllByDeletedFalse();

}

