package com.hms.services.adminmanagement.service;


import com.hms.services.adminmanagement.entity.HMS_TM_Finding;
import com.hms.services.adminmanagement.entity.HMS_TM_FindingCategory;
import com.hms.services.adminmanagement.entity.HMS_TW_Finding;
import com.hms.services.adminmanagement.entity.HMS_TW_FindingCategory;
import com.hms.services.adminmanagement.exceptionhandler.CustomException;
import com.hms.services.adminmanagement.model.FindingCategoryDTO;
import com.hms.services.adminmanagement.model.FindingDTO;
import com.hms.services.adminmanagement.repository.HMS_TM_FindingCategoryRepository;
import com.hms.services.adminmanagement.repository.HMS_TM_FindingRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_FindingCategoryRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_FindingRepository;
import jakarta.persistence.EntityNotFoundException;
import org.json.simple.JSONObject;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FindingService {


    private final HMS_TM_FindingRepository tmRepository;
    private final HMS_TW_FindingRepository twRepository;
    private final HMS_TW_FindingCategoryRepository twCategoryRepository;
    private final HMS_TM_FindingCategoryRepository tmCategoryRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public FindingService(final HMS_TM_FindingRepository tmRepository, final HMS_TW_FindingRepository twRepository,
                          final HMS_TW_FindingCategoryRepository twCategoryRepository,
                          final HMS_TM_FindingCategoryRepository tmCategoryRepository,final ModelMapper modelMapper) {
        this.tmRepository = tmRepository;
        this.twRepository = twRepository;
        this.twCategoryRepository = twCategoryRepository;
        this.tmCategoryRepository = tmCategoryRepository;
        this.modelMapper = modelMapper;
    }

    // Create multiple entries in the Work Table
    public HMS_TW_Finding createInWorkTable(HMS_TW_Finding twFindings) {
        twFindings.setCreatedAt(LocalDateTime.now());
        twFindings.setAuthStat("UnAuthorized");
        twFindings.setModNo("V1");
        twFindings.setActive(true);
        twFindings.setRecordStat("Open");
        return twRepository.save(twFindings);
    }

    // Approve a Work Table entry and move it to the Master Table
    public HMS_TW_Finding approveWorkTableEntry(String workId, HMS_TW_Finding twFinding) {
        HMS_TW_Finding existingTwFinding = twRepository.findByFindingIdAndIsActiveTrue(workId)
                .orElseThrow(() -> new CustomException("Work table entry not found", HttpStatus.BAD_REQUEST));
        existingTwFinding.setFinding(twFinding.getFinding());
        existingTwFinding.setDescription(twFinding.getDescription());
        existingTwFinding.setActive(true);
        existingTwFinding.setLastModifiedAt(LocalDateTime.now());
       return twRepository.save(existingTwFinding);
    }

    // Get all Master Table entries
    public List<FindingDTO> getAllMasterEntries() {
        List<HMS_TM_Finding> entities = tmRepository.findAllByIsActiveTrue();
        return entities.stream()
                .map(finding -> {
                    FindingDTO dto = modelMapper.map(finding, FindingDTO.class);
                    Optional<HMS_TM_FindingCategory> existingCategory =
                            tmCategoryRepository.findByFindingCategoryIdAndIsActiveTrue(finding.getCategoryId());
                    if (existingCategory != null) {
                        FindingCategoryDTO categoryDTO = modelMapper.map(existingCategory, FindingCategoryDTO.class);
                        dto.setFindingCategory(categoryDTO);
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // Get all Work Table entries
    public List<FindingDTO> getAllWorkEntries() {
        List<HMS_TW_Finding> entities = twRepository.findAllByIsActiveTrue();
        return entities.stream()
                .map(finding -> {
                    FindingDTO dto = modelMapper.map(finding, FindingDTO.class);
                    Optional<HMS_TW_FindingCategory> existingCategory =
                            twCategoryRepository.findByFindingCategoryIdAndIsActiveTrue(finding.getCategoryId());
                    if (existingCategory != null) {
                        FindingCategoryDTO categoryDTO = modelMapper.map(existingCategory, FindingCategoryDTO.class);
                        dto.setFindingCategory(categoryDTO);
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // Soft delete for HMS_TW_Finding
    public JSONObject softDeleteWorkFinding(String findingId) {
        HMS_TW_Finding finding = twRepository.findByFindingIdAndIsActiveTrue(findingId)
                .orElseThrow(() -> new RuntimeException("Work Finding not found for ID: " + findingId));
        finding.setActive(false);
        finding.setRecordStat("Close");
        finding.setLastModifiedBy("SuperAdmin");
        finding.setLastModifiedAt(LocalDateTime.now());
        twRepository.save(finding);
        JSONObject response = new JSONObject();
        response.put("status", "Deleted Successfully");
        response.put("findingId", findingId);
        return response;
    }

    // Soft delete for HMS_TM_Finding
    public JSONObject softDeleteMasterFinding(String findingId) {
        HMS_TM_Finding finding = tmRepository.findByFindingIdAndIsActiveTrue(findingId)
                .orElseThrow(() -> new RuntimeException("Master Finding not found for ID: " + findingId));
        finding.setActive(false);
        finding.setRecordStat("Close");
        finding.setLastModifiedBy("SuperAdmin");
        finding.setLastModifiedAt(LocalDateTime.now());
        tmRepository.save(finding);
        JSONObject response = new JSONObject();
        response.put("status", "Deleted Successfully");
        response.put("findingId", findingId);
        return response;
    }


    public HMS_TW_Finding updateAuthStatById(String id, String authStat) {
        HMS_TW_Finding twFinding = twRepository.findByFindingIdAndIsActiveTrue(id)
                .orElseThrow(() -> new EntityNotFoundException("Finding with ID " + id + " not found."));
        twFinding.setAuthStat(authStat);
        twFinding.setLastModifiedAt(LocalDateTime.now());
        twFinding.setLastModifiedBy("SuperAdmin");
        HMS_TW_Finding updatedTwFinding = twRepository.save(twFinding);
        if (authStat.equalsIgnoreCase("Authorized")) {
            HMS_TM_Finding tmFinding = new HMS_TM_Finding();
            tmFinding.setFindingId(twFinding.getFindingId());
            tmFinding.setFinding(twFinding.getFinding());
            tmFinding.setCategoryId(twFinding.getCategoryId());
            tmFinding.setDescription(twFinding.getDescription());
            tmFinding.setWtId(twFinding.getFindingId());
            tmFinding.setModNo(twFinding.getModNo());
            tmFinding.setAuthStat(authStat);
            tmFinding.setRecordStat(twFinding.getRecordStat());
            tmFinding.setActive(true);
            tmFinding.setCreatedAt(LocalDateTime.now());
            tmFinding.setCreatedBy("SuperAdmin");
            tmFinding.setLastModifiedAt(LocalDateTime.now());
            tmFinding.setLastModifiedBy("SuperAdmin");
            tmRepository.save(tmFinding);
        } else {
            Optional<HMS_TM_Finding> tmFinding = tmRepository.findByWtIdAndIsActiveTrue(id);
            tmFinding.ifPresent(tmRepository::delete);
        }
        return updatedTwFinding;
    }
}



