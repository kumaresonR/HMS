package com.hms.services.adminmanagement.service;


import com.hms.services.adminmanagement.entity.HMS_TM_SymptomsType;
import com.hms.services.adminmanagement.entity.HMS_TW_SymptomsType;
import com.hms.services.adminmanagement.exceptionhandler.CustomException;
import com.hms.services.adminmanagement.repository.HMS_TM_SymptomsTypeRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_SymptomsTypeRepository;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SymptomsService {

    private final HMS_TM_SymptomsTypeRepository tmRepository;
    private final HMS_TW_SymptomsTypeRepository twRepository;

    @Autowired
    public SymptomsService(final HMS_TM_SymptomsTypeRepository tmRepository, final HMS_TW_SymptomsTypeRepository twRepository) {
        this.tmRepository = tmRepository;
        this.twRepository = twRepository;
    }

    // Create an entry in the Work Table
    public List<HMS_TW_SymptomsType> createInWorkTable(List<HMS_TW_SymptomsType> twSymptomsTypes) {
        for (HMS_TW_SymptomsType symptomsType : twSymptomsTypes) {
            symptomsType.setCreatedAt(LocalDateTime.now());
            symptomsType.setModNo("V1");
            symptomsType.setCreatedBy("Admin");
            symptomsType.setAuthStat("UnAuthorized");
            symptomsType.setRecordStat("Open");
            symptomsType.setActive(true);
        }
        return twRepository.saveAll(twSymptomsTypes);
    }

    // Approve the Work Table entry and insert into Master Table
    public HMS_TW_SymptomsType approveWorkTableEntry(String workId, HMS_TW_SymptomsType twSymptomsType) {
        HMS_TW_SymptomsType existingTwSymptomsType = twRepository.findBySymptomsTypeIdAndIsActiveTrue(workId)
                .orElseThrow(() -> new CustomException("Work table entry not found", HttpStatus.BAD_REQUEST));

        existingTwSymptomsType.setSymptomsType(twSymptomsType.getSymptomsType());
//        existingTwSymptomsType.setModNo(twSymptomsType.getModNo());
        existingTwSymptomsType.setLastModifiedBy("Admin");
        existingTwSymptomsType.setLastModifiedAt(LocalDateTime.now());
        return twRepository.save(existingTwSymptomsType);
    }

    // Get all Master Table entries
    public List<HMS_TM_SymptomsType> getAllMasterEntries() {
        return tmRepository.findAllByIsActiveTrue();
    }

    // Get all Work Table entries
    public List<HMS_TW_SymptomsType> getAllWorkEntries() {
        return twRepository.findAllByIsActiveTrue();
    }


    public HMS_TW_SymptomsType updateAuthStatById(String id, String authStat) {
        HMS_TW_SymptomsType existingSymptomsType = twRepository.findBySymptomsTypeIdAndIsActiveTrue(id)
                .orElseThrow(() -> new CustomException("Symptoms type entry not found", HttpStatus.BAD_REQUEST));
        existingSymptomsType.setAuthStat(authStat);
        existingSymptomsType.setLastModifiedAt(LocalDateTime.now());
        existingSymptomsType.setLastModifiedBy("SuperAdmin"); // Replace with dynamic value if needed
        HMS_TW_SymptomsType savedSymptomsType = twRepository.save(existingSymptomsType);
        if (authStat.equalsIgnoreCase("Authorized")) {
            HMS_TM_SymptomsType tmSymptomsType = new HMS_TM_SymptomsType();
            tmSymptomsType.setSymptomsTypeId(existingSymptomsType.getSymptomsTypeId());
            tmSymptomsType.setSymptomsType(existingSymptomsType.getSymptomsType());
            tmSymptomsType.setWtId(existingSymptomsType.getSymptomsTypeId());
            tmSymptomsType.setModNo(existingSymptomsType.getModNo());
            tmSymptomsType.setAuthStat(authStat);
            tmSymptomsType.setRecordStat(existingSymptomsType.getRecordStat());
            tmSymptomsType.setActive(true);
            tmSymptomsType.setCreatedAt(LocalDateTime.now());
            tmSymptomsType.setCreatedBy("SuperAdmin");
            tmSymptomsType.setLastModifiedAt(LocalDateTime.now());
            tmSymptomsType.setLastModifiedBy("SuperAdmin");
            tmRepository.save(tmSymptomsType);
        } else {
            Optional<HMS_TM_SymptomsType> tmSymptomsType = tmRepository.findByWtIdAndIsActiveTrue(id);
            tmSymptomsType.ifPresent(tmRepository::delete);
        }
        return savedSymptomsType;
    }

    public JSONObject softDeleteWorkSymptomsType(String symptomsTypeId) {
        HMS_TW_SymptomsType symptomsType = twRepository.findBySymptomsTypeIdAndIsActiveTrue(symptomsTypeId)
                .orElseThrow(() -> new RuntimeException("Symptoms Type not found for ID: " + symptomsTypeId));
        symptomsType.setActive(false);
        symptomsType.setRecordStat("Close");
        symptomsType.setLastModifiedBy("SuperAdmin");
        symptomsType.setLastModifiedAt(LocalDateTime.now());
        twRepository.save(symptomsType);
        JSONObject response = new JSONObject();
        response.put("status", "Deleted Successfully");
        response.put("symptomsTypeId", symptomsTypeId);
        return response;
    }





}



