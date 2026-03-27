package com.hms.services.laboratorymanagement.repository;
import com.hms.services.laboratorymanagement.entity.HMS_TM_LabPathologyTests;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LabPathologyTestsRepository extends JpaRepository<HMS_TM_LabPathologyTests, String> {
    List<HMS_TM_LabPathologyTests> findByPathologyTestIdIn(List<String> testIds);

    Optional<HMS_TM_LabPathologyTests> findByPathologyTestIdAndDeletedFalse(String pathologyTestId);

    List<HMS_TM_LabPathologyTests> findAllByDeletedFalse();


}

