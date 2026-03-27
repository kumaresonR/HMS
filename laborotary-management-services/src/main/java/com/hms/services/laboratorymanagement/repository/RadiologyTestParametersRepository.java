package com.hms.services.laboratorymanagement.repository;
import com.hms.services.laboratorymanagement.entity.HMS_TM_RadiologyTestParameters;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RadiologyTestParametersRepository extends JpaRepository<HMS_TM_RadiologyTestParameters, String> {
    void deleteAllByRadiologyTestId(String radiologyTestId);

    List<HMS_TM_RadiologyTestParameters>findByRadiologyTestId(String radiologyTestId);
}

