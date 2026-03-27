package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_FindingCategory;
import com.hms.services.adminmanagement.entity.HMS_TW_FindingCategory;
import com.hms.services.adminmanagement.exceptionhandler.CustomException;
import com.hms.services.adminmanagement.repository.HMS_TM_FindingCategoryRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_FindingCategoryRepository;
import jakarta.persistence.EntityNotFoundException;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FindingCategoryService {

    private final HMS_TM_FindingCategoryRepository tmRepository;
    private final HMS_TW_FindingCategoryRepository twRepository;

    @Autowired
    public FindingCategoryService(HMS_TM_FindingCategoryRepository tmRepository, HMS_TW_FindingCategoryRepository twRepository) {
        this.tmRepository = tmRepository;
        this.twRepository = twRepository;
    }

    // Create an entry in the Work Table
    public List<HMS_TW_FindingCategory> createInWorkTable(List<HMS_TW_FindingCategory> twFindingCategoryList) {
        twFindingCategoryList.forEach(category -> {
            category.setCreatedAt(LocalDateTime.now());
            category.setAuthStat("UnAuthorized");
            category.setModNo("V1");
            category.setActive(true);
            category.setRecordStat("Open");
            category.setActive(true);
        });
        return twRepository.saveAll(twFindingCategoryList);
    }

    // Approve the Work Table entry and insert into Master Table
    public HMS_TW_FindingCategory approveWorkTableEntry(String workId, HMS_TW_FindingCategory twFindingCategory) {
        HMS_TW_FindingCategory existingTwFindingCategory = twRepository.findByFindingCategoryIdAndIsActiveTrue(workId)
                .orElseThrow(() -> new CustomException("Work table entry not found", HttpStatus.BAD_REQUEST));
        existingTwFindingCategory.setFindingCategory(twFindingCategory.getFindingCategory());
        existingTwFindingCategory.setActive(true);
        existingTwFindingCategory.setLastModifiedAt(LocalDateTime.now());
        existingTwFindingCategory.setLastModifiedAt(LocalDateTime.now());
        return twRepository.save(existingTwFindingCategory);
    }

    // Get all Master Table entries
    public List<HMS_TM_FindingCategory> getAllMasterEntries() {
        return tmRepository.findAllByIsActiveTrue();
    }

    // Get all Work Table entries
    public List<HMS_TW_FindingCategory> getAllWorkEntries() {
        return twRepository.findAllByIsActiveTrue();
    }

    // Soft delete for HMS_TW_FindingCategory
    public JSONObject softDeleteWorkFindingCategory(String findingCategoryId) {
        HMS_TW_FindingCategory findingCategory = twRepository.findByFindingCategoryIdAndIsActiveTrue(findingCategoryId)
                .orElseThrow(() -> new RuntimeException("Work Finding Category not found for ID: " + findingCategoryId));
        findingCategory.setActive(false);
        findingCategory.setRecordStat("Close");
        findingCategory.setLastModifiedBy("SuperAdmin");
        findingCategory.setLastModifiedAt(LocalDateTime.now());
        twRepository.save(findingCategory);
        JSONObject response = new JSONObject();
        response.put("status", "Deleted Successfully");
        response.put("findingCategoryId", findingCategoryId);
        return response;
    }

    public JSONObject softDeleteMasterFindingCategory(String findingCategoryId) {
        HMS_TM_FindingCategory findingCategory = tmRepository.findByFindingCategoryIdAndIsActiveTrue(findingCategoryId)
                .orElseThrow(() -> new RuntimeException("Master Finding Category not found for ID: " + findingCategoryId));
        findingCategory.setActive(false);
        findingCategory.setRecordStat("Close");
        findingCategory.setLastModifiedBy("SuperAdmin");
        findingCategory.setLastModifiedAt(LocalDateTime.now());
        tmRepository.save(findingCategory);
        JSONObject response = new JSONObject();
        response.put("status", "Deleted Successfully");
        response.put("findingCategoryId", findingCategoryId);
        return response;
    }


    public HMS_TW_FindingCategory updateAuthStatById(String id, String authStat) {
        HMS_TW_FindingCategory twFindingCategory = twRepository.findByFindingCategoryIdAndIsActiveTrue(id)
                .orElseThrow(() -> new EntityNotFoundException("Finding Category with ID " + id + " not found."));
        twFindingCategory.setAuthStat(authStat);
        twFindingCategory.setLastModifiedAt(LocalDateTime.now());
        twFindingCategory.setLastModifiedBy("SuperAdmin");
        HMS_TW_FindingCategory updatedTwFindingCategory = twRepository.save(twFindingCategory);
        if (authStat.equalsIgnoreCase("Authorized")) {
            HMS_TM_FindingCategory tmFindingCategory = new HMS_TM_FindingCategory();
            tmFindingCategory.setFindingCategoryId(twFindingCategory.getFindingCategoryId());
            tmFindingCategory.setFindingCategory(twFindingCategory.getFindingCategory());
            tmFindingCategory.setWtId(twFindingCategory.getFindingCategoryId());
            tmFindingCategory.setModNo(twFindingCategory.getModNo());
            tmFindingCategory.setAuthStat(authStat);
            tmFindingCategory.setRecordStat(twFindingCategory.getRecordStat());
            tmFindingCategory.setActive(true);
            tmFindingCategory.setCreatedAt(LocalDateTime.now());
            tmFindingCategory.setCreatedBy("SuperAdmin");
            tmFindingCategory.setLastModifiedAt(LocalDateTime.now());
            tmFindingCategory.setLastModifiedBy("SuperAdmin");
            tmRepository.save(tmFindingCategory);
        } else {
            Optional<HMS_TM_FindingCategory> tmFindingCategory = tmRepository.findByWtIdAndIsActiveTrue(id);
            tmFindingCategory.ifPresent(tmRepository::delete);
        }
        return updatedTwFindingCategory;
    }


}



