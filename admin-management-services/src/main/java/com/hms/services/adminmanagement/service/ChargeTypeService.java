package com.hms.services.adminmanagement.service;


import com.hms.services.adminmanagement.entity.HMS_TM_ChargeType;
import com.hms.services.adminmanagement.entity.HMS_TW_ChargeType;
import com.hms.services.adminmanagement.exceptionhandler.CustomException;
import com.hms.services.adminmanagement.repository.HMS_TM_ChargeTypeRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_ChargeTypeRepository;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ChargeTypeService {


    private final HMS_TM_ChargeTypeRepository tmRepository;
    private final HMS_TW_ChargeTypeRepository twRepository;

    @Autowired
    public ChargeTypeService(final HMS_TM_ChargeTypeRepository tmRepository,
                             final HMS_TW_ChargeTypeRepository twRepository) {
        this.tmRepository = tmRepository;
        this.twRepository = twRepository;
    }

    // Create an entry in the Work Table
    public HMS_TW_ChargeType createInWorkTable(HMS_TW_ChargeType twChargeType) {
        try {
            twChargeType.setAuthStat("UnAuthorized");
            twChargeType.setModNo("V1");
            twChargeType.setRecordStat("Open");
            twChargeType.setCreatedBy("Admin");
            twChargeType.setCreatedAt(LocalDateTime.now());
            twChargeType.setActive(true);
            return twRepository.save(twChargeType);
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Approve the Work Table entry and insert into Master Table
    public HMS_TW_ChargeType approveWorkTableEntry(String workId, HMS_TW_ChargeType twChargeType) {
        try {
            HMS_TW_ChargeType existingTwChargeType = twRepository.findByChargeTypeIdAndIsActiveTrue(workId)
                    .orElseThrow(() -> new CustomException("Work table entry not found", HttpStatus.BAD_REQUEST));
            existingTwChargeType.setChargeType(twChargeType.getChargeType());
            existingTwChargeType.setAppointment(twChargeType.isAppointment());
            existingTwChargeType.setOpd(twChargeType.isOpd());
            existingTwChargeType.setIpd(twChargeType.isIpd());
            existingTwChargeType.setPathology(twChargeType.isPathology());
            existingTwChargeType.setRadiology(twChargeType.isRadiology());
            existingTwChargeType.setBloodBank(twChargeType.isBloodBank());
            existingTwChargeType.setAmbulance(twChargeType.isAmbulance());
            existingTwChargeType.setLastModifiedBy("SuperAdmin");
            existingTwChargeType.setActive(true);
            existingTwChargeType.setLastModifiedAt(LocalDateTime.now());
            return twRepository.save(existingTwChargeType);
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Get all Master Table entries
    public List<HMS_TM_ChargeType> getAllMasterEntries() {
        return tmRepository.findAllByIsActiveTrue();
    }

    // Get all Work Table entries
    public List<HMS_TW_ChargeType> getAllWorkEntries() {
        return twRepository.findAllByIsActiveTrue();
    }


    // Soft delete for HMS_TW_ChargeType
    public JSONObject softDeleteWorkChargeType(String chargeTypeId) {
        HMS_TW_ChargeType chargeType = twRepository.findByChargeTypeIdAndIsActiveTrue(chargeTypeId)
                .orElseThrow(() -> new RuntimeException("Work Charge Type not found for the given ID: " + chargeTypeId));
        chargeType.setActive(false);
        chargeType.setRecordStat("Close");
        chargeType.setLastModifiedBy("SuperAdmin");
        chargeType.setLastModifiedAt(LocalDateTime.now());
        twRepository.save(chargeType);
        JSONObject response = new JSONObject();
        response.put("status", "Deleted Successfully");
        response.put("chargeTypeId", chargeTypeId);
        return response;

    }
    // Soft delete for HMS_TM_ChargeType
    public JSONObject softDeleteMasterChargeType(String chargeTypeId) {
        HMS_TM_ChargeType chargeType = tmRepository.findByChargeTypeIdAndIsActiveTrue(chargeTypeId)
                .orElseThrow(() -> new RuntimeException("Master Charge Type not found for the given ID: " + chargeTypeId));
        chargeType.setActive(false);
        chargeType.setRecordStat("Close");
        chargeType.setLastModifiedBy("SuperAdmin");
        chargeType.setLastModifiedAt(LocalDateTime.now());
        tmRepository.save(chargeType);
        JSONObject response = new JSONObject();
        response.put("status", "Deleted Successfully");
        response.put("chargeTypeId", chargeTypeId);
        return response;
    }


    public HMS_TW_ChargeType updateAuthStatById(String id, String authStat) {
        HMS_TW_ChargeType existingChargeType = twRepository.findByChargeTypeIdAndIsActiveTrue(id)
                .orElseThrow(() -> new CustomException("Charge Type not found", HttpStatus.BAD_REQUEST));
        existingChargeType.setAuthStat(authStat);
        existingChargeType.setLastModifiedAt(LocalDateTime.now());
        existingChargeType.setLastModifiedBy("SuperAdmin");
        HMS_TW_ChargeType savedChargeType = twRepository.save(existingChargeType);
        if (authStat.equalsIgnoreCase("Authorized")) {
            HMS_TM_ChargeType tmChargeType = new HMS_TM_ChargeType();
            tmChargeType.setChargeTypeId(existingChargeType.getChargeTypeId());
            tmChargeType.setChargeType(existingChargeType.getChargeType());
            tmChargeType.setWtId(existingChargeType.getChargeTypeId());
            tmChargeType.setModNo(existingChargeType.getModNo());
            tmChargeType.setAuthStat(authStat);
            tmChargeType.setRecordStat(existingChargeType.getRecordStat());
            tmChargeType.setActive(true);
            tmChargeType.setCreatedAt(LocalDateTime.now());
            tmChargeType.setCreatedBy("SuperAdmin");
            tmChargeType.setLastModifiedAt(LocalDateTime.now());
            tmChargeType.setLastModifiedBy("SuperAdmin");
            tmRepository.save(tmChargeType);
        } else {
            Optional<HMS_TM_ChargeType> tmChargeType = tmRepository.findByWtIdAndIsActiveTrue(id);
            tmChargeType.ifPresent(tmRepository::delete);
        }

        return savedChargeType;
    }


}


