package com.hms.services.billingmanagement.repository;

import com.hms.services.billingmanagement.entity.HMS_TM_Pathology_Parameters;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PathologyTestParameterRepository extends JpaRepository<HMS_TM_Pathology_Parameters, String > {
    List<HMS_TM_Pathology_Parameters> findByTestId(String testId);
}



