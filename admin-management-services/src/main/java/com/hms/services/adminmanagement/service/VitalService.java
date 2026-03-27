package com.hms.services.adminmanagement.service;


import com.hms.services.adminmanagement.entity.HMS_TM_Vital;
import com.hms.services.adminmanagement.entity.HMS_TW_Vital;
import com.hms.services.adminmanagement.exceptionhandler.CustomException;
import com.hms.services.adminmanagement.repository.HMS_TM_VitalRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_VitalRepository;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class VitalService {

    private final HMS_TM_VitalRepository tmRepository;
    private final HMS_TW_VitalRepository twRepository;

    @Autowired
    public VitalService(final HMS_TM_VitalRepository tmRepository, final HMS_TW_VitalRepository twRepository) {
        this.tmRepository = tmRepository;
        this.twRepository = twRepository;
    }

    // Create an entry in the Work Table
    public HMS_TW_Vital createInWorkTable(HMS_TW_Vital twVital) {
        twVital.setCreatedAt(LocalDateTime.now());
        twVital.setModNo("V1");
        twVital.setCreatedBy("Admin");
        twVital.setAuthStat("UnAuthorized");
        twVital.setRecordStat("Open");
        twVital.setActive(true);
        return twRepository.save(twVital);
    }

    // Approve the Work Table entry and insert into Master Table
    public HMS_TW_Vital approveWorkTableEntry(String workId, HMS_TW_Vital twVital) {
        HMS_TW_Vital existingTwVital = twRepository.findByVitalIdAndIsActiveTrue(workId)
                .orElseThrow(() -> new CustomException("Work table entry not found", HttpStatus.BAD_REQUEST));
        existingTwVital.setVitalName(twVital.getVitalName());
        existingTwVital.setReferenceFrom(twVital.getReferenceFrom());
        existingTwVital.setReferenceTo(twVital.getReferenceTo());
        existingTwVital.setUnit(twVital.getUnit());
//        existingTwVital.setModNo(twVital.getModNo());
        existingTwVital.setLastModifiedAt(LocalDateTime.now());
        return twRepository.save(existingTwVital);
    }

    // Get all Master Table entries
    public List<HMS_TM_Vital> getAllMasterEntries() {
        return tmRepository.findAllByIsActiveTrue();
    }

    // Get all Work Table entries
    public List<HMS_TW_Vital> getAllWorkEntries() {
        return twRepository.findAllByIsActiveTrue();
    }

    public HMS_TW_Vital updateAuthStatById(String id, String authStat) {
        HMS_TW_Vital existingTwVital = twRepository.findByVitalIdAndIsActiveTrue(id)
                .orElseThrow(() -> new CustomException("Vital entry not found", HttpStatus.BAD_REQUEST));
        existingTwVital.setAuthStat(authStat);
        existingTwVital.setLastModifiedAt(LocalDateTime.now());
        existingTwVital.setLastModifiedBy("SuperAdmin");
        HMS_TW_Vital savedTwVital = twRepository.save(existingTwVital);
        if ("Authorized".equalsIgnoreCase(authStat)) {
            HMS_TM_Vital tmVital = new HMS_TM_Vital();
            tmVital.setVitalId(existingTwVital.getVitalId());
            tmVital.setVitalName(existingTwVital.getVitalName());
            tmVital.setReferenceFrom(existingTwVital.getReferenceFrom());
            tmVital.setReferenceTo(existingTwVital.getReferenceTo());
            tmVital.setUnit(existingTwVital.getUnit());
            tmVital.setWtId(existingTwVital.getVitalId());
            tmVital.setModNo(existingTwVital.getModNo());
            tmVital.setAuthStat(authStat);
            tmVital.setRecordStat(existingTwVital.getRecordStat());
            tmVital.setActive(true);
            tmVital.setCreatedAt(LocalDateTime.now());
            tmVital.setCreatedBy("SuperAdmin");
            tmVital.setLastModifiedAt(LocalDateTime.now());
            tmVital.setLastModifiedBy("SuperAdmin");
            tmRepository.save(tmVital);
        } else {
            Optional<HMS_TM_Vital> tmVital = tmRepository.findByWtIdAndIsActiveTrue(id);
            tmVital.ifPresent(tmRepository::delete);
        }

        return savedTwVital;
    }

    public JSONObject softDeleteWorkUnitType(String vitalId) {
        HMS_TW_Vital existingTwVital = twRepository.findByVitalIdAndIsActiveTrue(vitalId)
                .orElseThrow(() -> new CustomException("Work table entry not found", HttpStatus.BAD_REQUEST));
        existingTwVital.setActive(false);
        existingTwVital.setRecordStat("Close");
        existingTwVital.setLastModifiedBy("SuperAdmin");
        existingTwVital.setLastModifiedAt(LocalDateTime.now());
        twRepository.save(existingTwVital);
        JSONObject response = new JSONObject();
        response.put("status", "Deleted Successfully");
        response.put("vitalId", vitalId);
        return response;
    }
}


