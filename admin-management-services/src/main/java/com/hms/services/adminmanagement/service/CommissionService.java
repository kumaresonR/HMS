package com.hms.services.adminmanagement.service;


import com.hms.services.adminmanagement.entity.HMS_TM_Commission;
import com.hms.services.adminmanagement.entity.HMS_TM_ReferralCategory;
import com.hms.services.adminmanagement.entity.HMS_TW_Commission;
import com.hms.services.adminmanagement.entity.HMS_TW_ReferralCategory;
import com.hms.services.adminmanagement.exceptionhandler.CustomException;
import com.hms.services.adminmanagement.model.ReferralCategoryDTO;
import com.hms.services.adminmanagement.model.ReferralCommissionDTO;
import com.hms.services.adminmanagement.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.json.simple.JSONObject;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CommissionService {

    private final HMS_TM_CommissionRepository tmRepository;
    private final HMS_TW_CommissionRepository twRepository;
    private final ModelMapper modelMapper;
    private final HMS_TM_ReferralCategoryRepository tmCategoryRepository;
    private final HMS_TW_ReferralCategoryRepository twCategoryRepository;

    @Autowired
    public CommissionService(HMS_TM_CommissionRepository tmRepository,
                             HMS_TW_CommissionRepository twRepository,final ModelMapper modelMapper,
                             HMS_TM_ReferralCategoryRepository tmCategoryRepository,HMS_TW_ReferralCategoryRepository twCategoryRepository) {
        this.tmRepository = tmRepository;
        this.twRepository = twRepository;
        this.modelMapper = modelMapper;
        this.tmCategoryRepository = tmCategoryRepository;
        this.twCategoryRepository = twCategoryRepository;
    }

    // Create entries in the Work Table
    public HMS_TW_Commission createInWorkTable(HMS_TW_Commission twCommissions) {
        if (twCommissions == null) {
            throw new IllegalArgumentException("Commission list cannot be null or empty.");
        }
        twCommissions.setAuthStat("UnAuthorized");
        twCommissions.setRecordStat("Open");
        twCommissions.setModNo("V1");
        twCommissions.setCreatedAt(LocalDateTime.now());
        twCommissions.setActive(true);
        return twRepository.save(twCommissions);
    }

    // Approve Work Table entry and move to Master Table
    public HMS_TW_Commission approveWorkTableEntry(String workId, HMS_TW_Commission twCommission) {
        HMS_TW_Commission existingTwCommission = twRepository.findByCommissionIdAndIsActiveTrue(workId)
                .orElseThrow(() -> new CustomException("Work table entry not found", HttpStatus.BAD_REQUEST));
        existingTwCommission.setAmbulanceCommission(twCommission.getAmbulanceCommission());
        existingTwCommission.setIpdCommission(twCommission.getIpdCommission());
        existingTwCommission.setOpdCommission(twCommission.getOpdCommission());
        existingTwCommission.setBloodBankCommission(twCommission.getBloodBankCommission());
        existingTwCommission.setPathologyCommission(twCommission.getPathologyCommission());
        existingTwCommission.setRadiologyCommission(twCommission.getRadiologyCommission());
        existingTwCommission.setAmbulanceCommission(twCommission.getAmbulanceCommission());
        existingTwCommission.setStandardCommission(twCommission.getStandardCommission());
        existingTwCommission.setCategoryId(twCommission.getCategoryId());
        existingTwCommission.setLastModifiedBy("SuperAdmin");
        existingTwCommission.setLastModifiedAt(LocalDateTime.now());
        return twRepository.save(existingTwCommission);
    }

    // Get all Master Table entries
    public List<ReferralCommissionDTO> getAllMasterEntries() {
        List<HMS_TM_Commission> commissions = tmRepository.findAllByIsActiveTrue();
        List<ReferralCommissionDTO> dtoCommissions = commissions.stream()
                .map(commission -> {
                    ReferralCommissionDTO dto = modelMapper.map(commission, ReferralCommissionDTO.class);
                    tmCategoryRepository.findByCategoryIdAndIsActiveTrue(dto.getCategoryId())
                            .ifPresent(category -> {
                                ReferralCategoryDTO categoryDto = modelMapper.map(category, ReferralCategoryDTO.class);
                                dto.setReferralCategory(categoryDto);
                            });

                    return dto;
                })
                .collect(Collectors.toList());
        return dtoCommissions;
    }

    // Get all Work Table entries
    public List<ReferralCommissionDTO> getAllWorkEntries() {
        List<HMS_TW_Commission> commissions = twRepository.findAllByIsActiveTrue();
        List<ReferralCommissionDTO> dtoCommissions = commissions.stream()
                .map(commission -> {
                    ReferralCommissionDTO dto = modelMapper.map(commission, ReferralCommissionDTO.class);
                    tmCategoryRepository.findByCategoryIdAndIsActiveTrue(dto.getCategoryId())
                            .ifPresent(category -> {
                                ReferralCategoryDTO categoryDto = modelMapper.map(category, ReferralCategoryDTO.class);
                                dto.setReferralCategory(categoryDto);
                            });

                    return dto;
                })
                .collect(Collectors.toList());

        return dtoCommissions;
    }

    // Soft delete Work Table entry
    public JSONObject softDeleteWorkTableEntry(String workId) {
        HMS_TW_Commission twCommission = twRepository.findByCommissionIdAndIsActiveTrue(workId)
                .orElseThrow(() -> new RuntimeException("Work table entry not found for ID: " + workId));
        twCommission.setActive(false);
        twCommission.setRecordStat("Closed");
        twCommission.setLastModifiedBy("SuperAdmin");
        twCommission.setLastModifiedAt(LocalDateTime.now());
        twRepository.save(twCommission);
        JSONObject response = new JSONObject();
        response.put("status", "Deleted Successfully");
        return response;
    }

    // Soft delete Master Table entry
    public JSONObject softDeleteMasterTableEntry(String masterId) {
        HMS_TM_Commission masterCommission = tmRepository.findByCommissionIdAndIsActiveTrue(masterId)
                .orElseThrow(() -> new RuntimeException("Master table entry not found for ID: " + masterId));
        masterCommission.setActive(false);
        masterCommission.setRecordStat("Closed");
        masterCommission.setLastModifiedBy("SuperAdmin");
        masterCommission.setLastModifiedAt(LocalDateTime.now());
        tmRepository.save(masterCommission);
        JSONObject response = new JSONObject();
        response.put("status", "Deleted Successfully");
        return response;
    }

    @Transactional
    public HMS_TW_Commission updateAuthStatById(String id, String authStat) {
        HMS_TW_Commission twCommission = twRepository.findByCommissionIdAndIsActiveTrue(id)
                .orElseThrow(() -> new EntityNotFoundException("Commission with ID " + id + " not found."));
        twCommission.setAuthStat(authStat);
        twCommission.setLastModifiedBy("SuperAdmin");
        twCommission.setLastModifiedAt(LocalDateTime.now());

        HMS_TW_Commission twData = twRepository.save(twCommission);

        if (authStat.equalsIgnoreCase("Authorized")) {
            HMS_TM_Commission tmCommission = new HMS_TM_Commission();
            tmCommission.setCommissionId(twCommission.getCommissionId());
            tmCommission.setCategoryId(twCommission.getCategoryId());
            tmCommission.setWtId(twCommission.getCommissionId());
            tmCommission.setOpdCommission(twCommission.getOpdCommission());
            tmCommission.setIpdCommission(twCommission.getIpdCommission());
            tmCommission.setPharmacyCommission(twCommission.getPharmacyCommission());
            tmCommission.setPathologyCommission(twCommission.getPathologyCommission());
            tmCommission.setRadiologyCommission(twCommission.getRadiologyCommission());
            tmCommission.setBloodBankCommission(twCommission.getBloodBankCommission());
            tmCommission.setAmbulanceCommission(twCommission.getAmbulanceCommission());
            tmCommission.setStandardCommission(twCommission.getStandardCommission());
            tmCommission.setModNo(twCommission.getModNo());
            tmCommission.setAuthStat(authStat);
            tmCommission.setRecordStat(twCommission.getRecordStat());
            tmCommission.setActive(true);
            tmCommission.setCreatedAt(LocalDateTime.now());
            tmCommission.setCreatedBy("SuperAdmin");
            tmCommission.setLastModifiedAt(LocalDateTime.now());
            tmCommission.setLastModifiedBy("SuperAdmin");

            tmRepository.save(tmCommission);
        } else {
            Optional<HMS_TM_Commission> tmCommission = tmRepository.findByWtIdAndIsActiveTrue(id);
            tmCommission.ifPresent(tmRepository::delete);
        }
        return twData;
    }
}




