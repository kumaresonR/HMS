package com.hms.services.adminmanagement.service;


import com.hms.services.adminmanagement.entity.HMS_TM_UnitType;
import com.hms.services.adminmanagement.entity.HMS_TW_UnitType;
import com.hms.services.adminmanagement.exceptionhandler.CustomException;
import com.hms.services.adminmanagement.repository.HMS_TM_UnitTypeRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_UnitTypeRepository;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UnitTypeService {


    private final HMS_TM_UnitTypeRepository tmRepository;
    private final HMS_TW_UnitTypeRepository twRepository;


    @Autowired
    public UnitTypeService(final HMS_TM_UnitTypeRepository tmRepository,final HMS_TW_UnitTypeRepository twRepository) {
        this.tmRepository = tmRepository;
        this.twRepository = twRepository;
    }

    // Create an entry in the Work Table
    public HMS_TW_UnitType createInWorkTable(HMS_TW_UnitType twUnitType) {
        try {
            twUnitType.setAuthStat("UnAuthorized");
            twUnitType.setModNo("V1");
            twUnitType.setRecordStat("Open");
            twUnitType.setCreatedBy("Admin");
            twUnitType.setCreatedAt(LocalDateTime.now());
            twUnitType.setActive(true);
            return twRepository.save(twUnitType);
        }catch (Exception ex){
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public HMS_TW_UnitType approveWorkTableEntry(String workId,HMS_TW_UnitType twUnitType) {
        try{
        HMS_TW_UnitType existingTwUnitType = twRepository.findByIdAndIsActiveTrue(workId)
                .orElseThrow(() -> new CustomException("Work table entry not found",HttpStatus.BAD_REQUEST));
            existingTwUnitType.setUnitType(twUnitType.getUnitType());
            existingTwUnitType.setActive(true);
            existingTwUnitType.setLastModifiedAt(LocalDateTime.now());
//            existingTwUnitType.setModNo(twUnitType.getModNo());
//            existingTwUnitType.setRecordStat(twUnitType.getRecordStat());
            existingTwUnitType.setLastModifiedBy("SuperAdmin");
        return twRepository.save(existingTwUnitType);
    }catch (Exception ex){
        throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
    }

    // Get all Master Table entries
    public List<HMS_TM_UnitType> getAllMasterEntries() {
        return tmRepository.findAllByIsActiveTrue();
    }

    // Get all Work Table entries
    public List<HMS_TW_UnitType> getAllWorkEntries() {
        return twRepository.findAllByIsActiveTrue();
    }

    public HMS_TW_UnitType updateAuthStatById(String id, String authStat) {
        HMS_TW_UnitType existingTwUnitType = twRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new CustomException("Work table entry not found",HttpStatus.BAD_REQUEST));
        existingTwUnitType.setAuthStat(authStat);
        existingTwUnitType.setLastModifiedAt(LocalDateTime.now());
        existingTwUnitType.setLastModifiedBy("SuperAdmin");
        HMS_TW_UnitType savedTwUnitType = twRepository.save(existingTwUnitType);
        if (authStat.equalsIgnoreCase("Authorized")) {
            HMS_TM_UnitType tmUnitType = new HMS_TM_UnitType();
            tmUnitType.setId(existingTwUnitType.getId());
            tmUnitType.setUnitType(existingTwUnitType.getUnitType());
            tmUnitType.setWtId(existingTwUnitType.getId());
            tmUnitType.setModNo(existingTwUnitType.getModNo());
            tmUnitType.setAuthStat(authStat);
            tmUnitType.setRecordStat(existingTwUnitType.getRecordStat());
            tmUnitType.setActive(true);
            tmUnitType.setCreatedAt(LocalDateTime.now());
            tmUnitType.setCreatedBy("SuperAdmin");
            tmUnitType.setLastModifiedAt(LocalDateTime.now());
            tmUnitType.setLastModifiedBy("SuperAdmin");
            tmRepository.save(tmUnitType);
        } else {
            Optional<HMS_TM_UnitType> tmUnitType = tmRepository.findByWtIdAndIsActiveTrue(id);
            tmUnitType.ifPresent(tmRepository::delete);
        }
        return savedTwUnitType;
    }

    public JSONObject softDeleteWorkUnitType(String unitTypeId) {
        HMS_TW_UnitType unitType = twRepository.findByIdAndIsActiveTrue(unitTypeId)
                .orElseThrow(() -> new RuntimeException("Work Unit Type not found for ID: " + unitTypeId));
        unitType.setActive(false);
        unitType.setRecordStat("Close");
        unitType.setLastModifiedBy("SuperAdmin");
        unitType.setLastModifiedAt(LocalDateTime.now());
        twRepository.save(unitType);
        JSONObject response = new JSONObject();
        response.put("status", "Deleted Successfully");
        response.put("unitTypeId", unitTypeId);
        return response;
    }



}



