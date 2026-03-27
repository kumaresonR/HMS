package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_TaxCategory;
import com.hms.services.adminmanagement.entity.HMS_TW_TaxCategory;
import com.hms.services.adminmanagement.exceptionhandler.CustomException;
import com.hms.services.adminmanagement.repository.HMS_TM_TaxCategoryRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_TaxCategoryRepository;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TaxCategoryService {

    private final HMS_TM_TaxCategoryRepository tmRepository;
    private final HMS_TW_TaxCategoryRepository twRepository;

    @Autowired
    public TaxCategoryService(final HMS_TM_TaxCategoryRepository tmRepository,
                              final HMS_TW_TaxCategoryRepository twRepository) {
        this.tmRepository = tmRepository;
        this.twRepository = twRepository;
    }

    // Create an entry in the Work Table
    public HMS_TW_TaxCategory createInWorkTable(HMS_TW_TaxCategory twTaxCategory) {
        try {
            twTaxCategory.setCreatedAt(LocalDateTime.now());
            twTaxCategory.setModNo("V1");
            twTaxCategory.setCreatedBy("Admin");
            twTaxCategory.setAuthStat("UnAuthorized");
            twTaxCategory.setRecordStat("Open");
            twTaxCategory.setActive(true);
            return twRepository.save(twTaxCategory);
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Approve the Work Table entry and insert into Master Table
    public HMS_TW_TaxCategory approveWorkTableEntry(String workId, HMS_TW_TaxCategory twTaxCategory) {
        try {
            HMS_TW_TaxCategory existingTwTaxCategory = twRepository.findByIdAndIsActiveTrue(workId)
                    .orElseThrow(() -> new CustomException("Work table entry not found", HttpStatus.BAD_REQUEST));

            existingTwTaxCategory.setName(twTaxCategory.getName());
            existingTwTaxCategory.setPercentage(twTaxCategory.getPercentage());
            existingTwTaxCategory.setActive(true);
            existingTwTaxCategory.setLastModifiedAt(LocalDateTime.now());
            return twRepository.save(existingTwTaxCategory);
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Get all Master Table entries
    public List<HMS_TM_TaxCategory> getAllMasterEntries() {
        return tmRepository.findAllByIsActiveTrue();
    }

    // Get all Work Table entries
    public List<HMS_TW_TaxCategory> getAllWorkEntries() {
        return twRepository.findAllByIsActiveTrue();
    }


    public HMS_TW_TaxCategory updateAuthStatById(String id, String authStat) {
        HMS_TW_TaxCategory existingTaxCategory = twRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new CustomException("Work table entry not found", HttpStatus.BAD_REQUEST));
        existingTaxCategory.setAuthStat(authStat);
        existingTaxCategory.setLastModifiedAt(LocalDateTime.now());
        existingTaxCategory.setLastModifiedBy("SuperAdmin");
        HMS_TW_TaxCategory savedTaxCategory = twRepository.save(existingTaxCategory);
        if (authStat.equalsIgnoreCase("Authorized")) {
            HMS_TM_TaxCategory tmTaxCategory = new HMS_TM_TaxCategory();
            tmTaxCategory.setId(existingTaxCategory.getId());
            tmTaxCategory.setName(existingTaxCategory.getName());
            tmTaxCategory.setPercentage(existingTaxCategory.getPercentage());
            tmTaxCategory.setWtId(existingTaxCategory.getId());
            tmTaxCategory.setModNo(existingTaxCategory.getModNo());
            tmTaxCategory.setAuthStat(authStat);
            tmTaxCategory.setRecordStat(existingTaxCategory.getRecordStat());
            tmTaxCategory.setActive(true);
            tmTaxCategory.setCreatedAt(LocalDateTime.now());
            tmTaxCategory.setCreatedBy("SuperAdmin");
            tmTaxCategory.setLastModifiedAt(LocalDateTime.now());
            tmTaxCategory.setLastModifiedBy("SuperAdmin");
            tmRepository.save(tmTaxCategory);
        } else {
            Optional<HMS_TM_TaxCategory> tmTaxCategory = tmRepository.findByWtIdAndIsActiveTrue(id);
            tmTaxCategory.ifPresent(tmRepository::delete);
        }
        return savedTaxCategory;
    }

    public JSONObject softDeleteWorkTaxCategory(String taxCategoryId) {
        HMS_TW_TaxCategory taxCategory = twRepository.findByIdAndIsActiveTrue(taxCategoryId)
                .orElseThrow(() -> new RuntimeException("Work Tax Category not found for ID: " + taxCategoryId));
        taxCategory.setActive(false);
        taxCategory.setRecordStat("Close");
        taxCategory.setLastModifiedBy("SuperAdmin");
        taxCategory.setLastModifiedAt(LocalDateTime.now());
        twRepository.save(taxCategory);
        JSONObject response = new JSONObject();
        response.put("status", "Deleted Successfully");
        response.put("taxCategoryId", taxCategoryId);
        return response;
    }




}




