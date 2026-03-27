package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_ReferralCategory;
import com.hms.services.adminmanagement.entity.HMS_TW_ReferralCategory;
import com.hms.services.adminmanagement.exceptionhandler.CustomException;
import com.hms.services.adminmanagement.repository.HMS_TM_ReferralCategoryRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_ReferralCategoryRepository;
import jakarta.persistence.EntityNotFoundException;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReferralCategoryService {

    private final HMS_TM_ReferralCategoryRepository tmRepository;
    private final HMS_TW_ReferralCategoryRepository twRepository;

    @Autowired
    public ReferralCategoryService(HMS_TM_ReferralCategoryRepository tmRepository,
                                   HMS_TW_ReferralCategoryRepository twRepository) {
        this.tmRepository = tmRepository;
        this.twRepository = twRepository;
    }

    // Create entries in the Work Table
    public List<HMS_TW_ReferralCategory> createInWorkTable(List<HMS_TW_ReferralCategory> twCategories) {
        if (twCategories == null || twCategories.isEmpty()) {
            throw new IllegalArgumentException("Referral category list cannot be null or empty.");
        }
        twCategories.forEach(category -> {
            category.setAuthStat("UnAuthorized");
            category.setModNo("V1");
            category.setRecordStat("Open");
            category.setCreatedAt(LocalDateTime.now());
            category.setActive(true);
        });
        return twRepository.saveAll(twCategories);
    }

    // Approve Work Table entry and move to Master Table
    public HMS_TW_ReferralCategory approveWorkTableEntry(String workId, HMS_TW_ReferralCategory twCategory) {
        // Find the existing entry in the Work Table
        HMS_TW_ReferralCategory existingTwCategory = twRepository.findByCategoryIdAndIsActiveTrue(workId)
                .orElseThrow(() -> new CustomException("Work table entry not found", HttpStatus.BAD_REQUEST));
        existingTwCategory.setName(twCategory.getName());
        existingTwCategory.setLastModifiedBy("SuperAdmin");
        existingTwCategory.setActive(true);
        existingTwCategory.setLastModifiedAt(LocalDateTime.now());
        return twRepository.save(existingTwCategory);
    }


    // Get all Master Table entries
    public List<HMS_TM_ReferralCategory> getAllMasterEntries() {
        return tmRepository.findAllByIsActiveTrue();
    }

    // Get all Work Table entries
    public List<HMS_TW_ReferralCategory> getAllWorkEntries() {
        return twRepository.findAllByIsActiveTrue();
    }

    // Soft delete for Work Table entry
    public JSONObject softDeleteWorkTableEntry(String workId) {
        HMS_TW_ReferralCategory twCategory = twRepository.findByCategoryIdAndIsActiveTrue(workId)
                .orElseThrow(() -> new RuntimeException("Work table entry not found for ID: " + workId));
        twCategory.setActive(false);
        twCategory.setRecordStat("Close");
        twCategory.setLastModifiedBy("SuperAdmin");
        twCategory.setLastModifiedAt(LocalDateTime.now());
        twRepository.save(twCategory);

        JSONObject response = new JSONObject();
        response.put("status", "Deleted Successfully");
        response.put("workId", workId);
        return response;
    }

    // Soft delete for Master Table entry
    public JSONObject softDeleteMasterTableEntry(String masterId) {
        HMS_TM_ReferralCategory tmCategory = tmRepository.findByCategoryIdAndIsActiveTrue(masterId)
                .orElseThrow(() -> new RuntimeException("Master table entry not found for ID: " + masterId));
        tmCategory.setActive(false);
        tmCategory.setRecordStat("Close");
        tmCategory.setLastModifiedBy("SuperAdmin");
        tmCategory.setLastModifiedAt(LocalDateTime.now());
        tmRepository.save(tmCategory);

        JSONObject response = new JSONObject();
        response.put("status", "Deleted Successfully");
        response.put("masterId", masterId);
        return response;
    }

    @Transactional
    public HMS_TW_ReferralCategory updateAuthStatById(String id, String authStat) {
        HMS_TW_ReferralCategory twCategory = twRepository.findByCategoryIdAndIsActiveTrue(id)
                .orElseThrow(() -> new EntityNotFoundException("Referral category with ID " + id + " not found."));
        twCategory.setAuthStat(authStat);
        twCategory.setLastModifiedAt(LocalDateTime.now());
        twCategory.setLastModifiedBy("SuperAdmin");
        HMS_TW_ReferralCategory updatedTwCategory = twRepository.save(twCategory);
        if ("Authorized".equalsIgnoreCase(authStat)) {
            HMS_TM_ReferralCategory tmCategory = new HMS_TM_ReferralCategory();
            tmCategory.setCategoryId(twCategory.getCategoryId());
            tmCategory.setName(twCategory.getName());
            tmCategory.setWtId(twCategory.getCategoryId());
            tmCategory.setModNo(twCategory.getModNo());
            tmCategory.setAuthStat(authStat);
            tmCategory.setRecordStat(twCategory.getRecordStat());
            tmCategory.setCreatedAt(LocalDateTime.now());
            tmCategory.setActive(true);
            tmCategory.setCreatedBy("SuperAdmin");
            tmCategory.setLastModifiedAt(LocalDateTime.now());
            tmCategory.setLastModifiedBy("SuperAdmin");
            tmRepository.save(tmCategory);
        } else {
            Optional<HMS_TM_ReferralCategory> tmCategory = tmRepository.findByWtIdAndIsActiveTrue(id);
            tmCategory.ifPresent(tmRepository::delete);
        }
        return updatedTwCategory;
    }
}



