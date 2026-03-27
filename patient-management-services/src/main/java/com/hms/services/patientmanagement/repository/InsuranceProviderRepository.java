package com.hms.services.patientmanagement.repository;

import com.hms.services.patientmanagement.entity.HMS_TM_InsuranceProviders;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InsuranceProviderRepository extends JpaRepository<HMS_TM_InsuranceProviders, String> {


//    void deleteByInsuranceId(String id);

    Optional<HMS_TM_InsuranceProviders> findByProviderNameAndIsActiveTrue(String providerName);

    Optional<HMS_TM_InsuranceProviders> findByInsuranceIdAndIsActiveTrue(String id);

    Page<HMS_TM_InsuranceProviders> findAllByIsActiveTrue(Pageable pageable);

    List<HMS_TM_InsuranceProviders> findAllByPatientIdInAndIsActiveTrue(List<String> patientIds);

    Optional<HMS_TM_InsuranceProviders> findByPatientIdAndIsActiveTrue(String id);
}

