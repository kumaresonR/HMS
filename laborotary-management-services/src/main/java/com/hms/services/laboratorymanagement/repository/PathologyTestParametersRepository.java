package com.hms.services.laboratorymanagement.repository;

import com.hms.services.laboratorymanagement.entity.HMS_TM_PathologyTestParameters;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface PathologyTestParametersRepository extends JpaRepository<HMS_TM_PathologyTestParameters, String> {
    void deleteAllByPathologyTestId(String id);

   List<HMS_TM_PathologyTestParameters> findByPathologyTestId(String pathologyTestId);

}

