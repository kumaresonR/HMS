package com.hms.services.adminmanagement.service;


import com.hms.services.adminmanagement.entity.HMS_TM_OperationCategory;
import com.hms.services.adminmanagement.entity.HMS_TW_OperationCategory;
import com.hms.services.adminmanagement.exceptionhandler.CustomException;
import com.hms.services.adminmanagement.repository.HMS_TM_OperationCategoryRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_OperationCategoryRepository;
import jakarta.persistence.EntityNotFoundException;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OperationCategoryService {

    private final HMS_TM_OperationCategoryRepository tmRepository;
    private final HMS_TW_OperationCategoryRepository twRepository;

    @Autowired
    public OperationCategoryService(final HMS_TM_OperationCategoryRepository tmRepository,
                                    final HMS_TW_OperationCategoryRepository twRepository) {
        this.tmRepository = tmRepository;
        this.twRepository = twRepository;
    }

    // Create an entry in the Work Table
    public List<HMS_TW_OperationCategory> createInWorkTable(List<HMS_TW_OperationCategory> twOperationCategory) {
        twOperationCategory.forEach(category -> {
            category.setCreatedAt(LocalDateTime.now());
            category.setCreatedBy("Admin");
            category.setAuthStat("UnAuthorized");
            category.setRecordStat("Open");
            category.setActive(true);
        });
        return twRepository.saveAll(twOperationCategory);
    }

    // Approve the Work Table entry and insert into Master Table
    public HMS_TW_OperationCategory approveWorkTableEntry(String workId, HMS_TW_OperationCategory twOperationCategory) {
        HMS_TW_OperationCategory existingTwOperationCategory = twRepository.findByCategoryIdAndIsActiveTrue(workId)
                .orElseThrow(() -> new CustomException("Work table entry not found", HttpStatus.BAD_REQUEST));

        existingTwOperationCategory.setOperationCategory(twOperationCategory.getOperationCategory());
        existingTwOperationCategory.setLastModifiedAt(LocalDateTime.now());
        existingTwOperationCategory.setModNo(twOperationCategory.getModNo());
        existingTwOperationCategory.setLastModifiedBy("Admin");
        return twRepository.save(existingTwOperationCategory);
    }

    // Get all Master Table entries
    public List<HMS_TM_OperationCategory> getAllMasterEntries() {
        return tmRepository.findAllByIsActiveTrue();
    }

    // Get all Work Table entries
    public List<HMS_TW_OperationCategory> getAllWorkEntries() {
        return twRepository.findAllByIsActiveTrue();
    }

    // Soft delete for HMS_TW_OperationCategory
    public JSONObject softDeleteWorkOperationCategory(String categoryId) {
        HMS_TW_OperationCategory operationCategory = twRepository.findByCategoryIdAndIsActiveTrue(categoryId)
                .orElseThrow(() -> new RuntimeException("Work Operation Category not found for ID: " + categoryId));
        operationCategory.setActive(false);
        operationCategory.setRecordStat("Close");
        operationCategory.setLastModifiedBy("SuperAdmin");
        operationCategory.setLastModifiedAt(LocalDateTime.now());
        twRepository.save(operationCategory);
        JSONObject response = new JSONObject();
        response.put("status", "Deleted Successfully");
        response.put("categoryId", categoryId);
        return response;
    }

    // Soft delete for HMS_TM_OperationCategory
    public JSONObject softDeleteMasterOperationCategory(String categoryId) {
        HMS_TM_OperationCategory operationCategory = tmRepository.findByCategoryIdAndIsActiveTrue(categoryId)
                .orElseThrow(() -> new RuntimeException("Master Operation Category not found for ID: " + categoryId));
        operationCategory.setActive(false);
        operationCategory.setRecordStat("Close");
        operationCategory.setLastModifiedBy("SuperAdmin");
        operationCategory.setLastModifiedAt(LocalDateTime.now());
        tmRepository.save(operationCategory);
        JSONObject response = new JSONObject();
        response.put("status", "Deleted Successfully");
        response.put("categoryId", categoryId);
        return response;
    }


    public HMS_TW_OperationCategory updateAuthStatById(String id, String authStat) {
        HMS_TW_OperationCategory twOperationCategory = twRepository.findByCategoryIdAndIsActiveTrue(id)
                .orElseThrow(() -> new EntityNotFoundException("Operation category with ID " + id + " not found."));
        twOperationCategory.setAuthStat(authStat);
        twOperationCategory.setLastModifiedAt(LocalDateTime.now());
        twOperationCategory.setLastModifiedBy("SuperAdmin");
        HMS_TW_OperationCategory updatedCategory = twRepository.save(twOperationCategory);
        if (authStat.equalsIgnoreCase("Authorized")) {
            HMS_TM_OperationCategory tmOperationCategory = new HMS_TM_OperationCategory();
            tmOperationCategory.setOperationCategory(twOperationCategory.getOperationCategory());
            tmOperationCategory.setWtId(twOperationCategory.getCategoryId());
            tmOperationCategory.setModNo(twOperationCategory.getModNo());
            tmOperationCategory.setAuthStat(authStat);
            tmOperationCategory.setRecordStat(twOperationCategory.getRecordStat());
            tmOperationCategory.setActive(true);
            tmOperationCategory.setCreatedAt(LocalDateTime.now());
            tmOperationCategory.setCreatedBy("SuperAdmin");
            tmOperationCategory.setLastModifiedAt(LocalDateTime.now());
            tmOperationCategory.setLastModifiedBy("SuperAdmin");
            tmRepository.save(tmOperationCategory);
        } else {
            Optional<HMS_TM_OperationCategory> tmOperationCategory = tmRepository.findByWtIdAndIsActiveTrue(id);
            tmOperationCategory.ifPresent(tmRepository::delete);
        }
        return updatedCategory;
    }



}



