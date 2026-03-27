package com.hms.services.patientmanagement.service;

import com.hms.services.patientmanagement.entity.HMS_TM_InsuranceProviders;
import com.hms.services.patientmanagement.exception.CustomException;
import com.hms.services.patientmanagement.model.InsuranceProvidersDTO;
import com.hms.services.patientmanagement.repository.InsuranceProviderRepository;
import com.hms.services.patientmanagement.response.ApiResponse;
import jakarta.persistence.EntityManager;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class InsuranceService {


    private final ModelMapper modelMapper;
    private final EntityManager entityManager;
    private final InsuranceProviderRepository insuranceProviderRepository;

    @Autowired
    public InsuranceService(final ModelMapper modelMapper,final EntityManager entityManager,final InsuranceProviderRepository insuranceProviderRepository) {
        this.modelMapper = modelMapper;
        this.entityManager = entityManager;
        this.insuranceProviderRepository = insuranceProviderRepository;
    }

    @Transactional
    public ApiResponse createInsurance(@Valid InsuranceProvidersDTO insurance) {
        try {
            HMS_TM_InsuranceProviders insuranceData = modelMapper.map(insurance, HMS_TM_InsuranceProviders.class);
            insuranceData.setCreatedAt(LocalDateTime.now());
            insuranceData.setCreatedBy("vijay");
            insuranceData.setIsActive(true);
            insuranceData.setTime(LocalTime.now());
            HMS_TM_InsuranceProviders savedInsurance = insuranceProviderRepository.save(insuranceData);
            return new ApiResponse("success", "", "Adding InsuranceProvider Successfully", "","",savedInsurance.getInsuranceId(), null);
        }catch(Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public ApiResponse deleteInsuranceById(String id) {
        Optional<HMS_TM_InsuranceProviders> patientOptional = insuranceProviderRepository.findByInsuranceIdAndIsActiveTrue(id);
        if (patientOptional.isEmpty()) {
            throw new CustomException("Insurance_Id"+id+"not found", HttpStatus.BAD_REQUEST);
        }
        patientOptional.get().setIsActive(false);
        insuranceProviderRepository.save(patientOptional.get());
        //insuranceProviderRepository.deleteByInsuranceId(id);
        return new ApiResponse("success", "", "Record Deleted Successfully", id, null,id, null);
    }


    public List<InsuranceProvidersDTO> getAllInsurance(Integer page, Integer size) {
        try{
        Pageable pageable = PageRequest.of(page, size);
        Page<HMS_TM_InsuranceProviders> allPatientsPage = insuranceProviderRepository.findAllByIsActiveTrue(pageable);
        return allPatientsPage.stream()
                .map(insurance -> modelMapper.map(insurance, InsuranceProvidersDTO.class))
                .collect(Collectors.toList());
    }catch(Exception ex) {
        throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }}


    public InsuranceProvidersDTO getInsuranceByProviderName(String providerName) {
        Optional<HMS_TM_InsuranceProviders> patientOptional = insuranceProviderRepository.findByProviderNameAndIsActiveTrue(providerName);
        if (patientOptional.isPresent()) {
            return modelMapper.map(patientOptional.get(), InsuranceProvidersDTO.class);
        }else {
            throw new CustomException("InsuranceProviders Name: " + providerName+ " not found", HttpStatus.NOT_FOUND);
        }
    }

    public InsuranceProvidersDTO updateInsuranceProviderById(String id, @Valid InsuranceProvidersDTO insurance) {
        try {
            Optional<HMS_TM_InsuranceProviders> patientOptional = Optional.ofNullable(insuranceProviderRepository.findByInsuranceIdAndIsActiveTrue(id)
                    .orElseThrow(() -> new CustomException("InsuranceProvider Not Found", HttpStatus.NOT_FOUND)));
            HMS_TM_InsuranceProviders provider = patientOptional.get();
            provider.setProviderName(insurance.getProviderName());
            provider.setCoverageDetails(insurance.getCoverageDetails());
            provider.setPolicyNumber(insurance.getPolicyNumber());
            provider.setLastModifiedAt(LocalDateTime.now());
            provider.setLastModifiedBy("vijay");
            HMS_TM_InsuranceProviders provide = insuranceProviderRepository.save(provider);
            return modelMapper.map(provide, InsuranceProvidersDTO.class);
        }catch(Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }}





}

