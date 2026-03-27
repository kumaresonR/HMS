package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_BedType;
import com.hms.services.adminmanagement.entity.HMS_TW_BedType;
import com.hms.services.adminmanagement.exceptionhandler.CustomException;
import com.hms.services.adminmanagement.repository.HMS_TM_BedTypeRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_BedTypeRepository;
import jakarta.persistence.EntityNotFoundException;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BedTypeService {

    private final HMS_TM_BedTypeRepository tmRepository;
    private final HMS_TW_BedTypeRepository twRepository;

    @Autowired
    public BedTypeService(final HMS_TM_BedTypeRepository tmRepository, final HMS_TW_BedTypeRepository twRepository) {
        this.tmRepository = tmRepository;
        this.twRepository = twRepository;
    }

    // Create an entry in the Work Table
    public HMS_TW_BedType createInWorkTable(HMS_TW_BedType twBedType) {
        try {
            twBedType.setAuthStat("UnAuthorized");
            twBedType.setRecordStat("Open");
            twBedType.setModNo("V1");
            twBedType.setCreatedAt(LocalDateTime.now());
            twBedType.setCreatedBy("Admin");
            twBedType.setActive(true);
            return twRepository.save(twBedType);
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public HMS_TW_BedType approveWorkTableEntry(String workId, HMS_TW_BedType twBedType) {
        try {
            HMS_TW_BedType existingTwBedType = twRepository.findByBedTypeIdAndIsActiveTrue(workId)
                    .orElseThrow(() -> new CustomException("Work table entry not found", HttpStatus.BAD_REQUEST));
            existingTwBedType.setName(twBedType.getName());
            existingTwBedType.setActive(true);
            existingTwBedType.setLastModifiedAt(LocalDateTime.now());
            existingTwBedType.setLastModifiedBy("SuperAdmin");
            return twRepository.save(existingTwBedType);
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Get all Master Table entries
    public List<HMS_TM_BedType> getAllMasterEntries() {
        return tmRepository.findAllByIsActiveTrue();
    }

    // Get all Work Table entries
    public List<HMS_TW_BedType> getAllWorkEntries() {
        return twRepository.findAllByIsActiveTrue();
    }

    public JSONObject softDeleteWorkBedType(String id) {
        HMS_TW_BedType bedType = twRepository.findByBedTypeIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Work Bed Type not found for the given ID: " + id));
        bedType.setActive(false);
        bedType.setRecordStat("Closed");
        bedType.setLastModifiedBy("SuperAdmin");
        twRepository.save(bedType);
        JSONObject response = new JSONObject();
        response.put("status", "Deleted Successfully");
        response.put("bedTypeId", id);
        return response;
    }

    public JSONObject softDeleteMasterBedType(String id) {
        HMS_TM_BedType bedType = tmRepository.findByBedTypeIdAndIsActiveTrue(id);
        if(bedType == null) {
            throw new RuntimeException("Master Bed Type not found for the given ID: " + id);
        }
        bedType.setActive(false);
        bedType.setRecordStat("Closed");
        bedType.setLastModifiedBy("SuperAdmin");
        bedType.setLastModifiedAt(LocalDateTime.now());
        tmRepository.save(bedType);
        JSONObject response = new JSONObject();
        response.put("status", "Deleted Successfully");
        response.put("bedTypeId", id);
        return response;
    }


    public HMS_TW_BedType updateAuthStatById(String id, String authStat) {
        HMS_TW_BedType twBedType = twRepository.findByBedTypeIdAndIsActiveTrue(id)
                .orElseThrow(() -> new EntityNotFoundException("BedType with ID " + id + " not found."));
        twBedType.setAuthStat(authStat);
        twBedType.setLastModifiedAt(LocalDateTime.now());
        twBedType.setLastModifiedBy("SuperAdmin");
        twRepository.save(twBedType);
        if (authStat.equalsIgnoreCase("Authorized")) {
            HMS_TM_BedType tmBedType = new HMS_TM_BedType();
            tmBedType.setBedTypeId(twBedType.getBedTypeId());
            tmBedType.setName(twBedType.getName());
            tmBedType.setWtId(twBedType.getBedTypeId());
            tmBedType.setModNo(twBedType.getModNo());
            tmBedType.setRecordStat(twBedType.getRecordStat());
            tmBedType.setAuthStat(authStat);
            tmBedType.setCreatedAt(LocalDateTime.now());
            tmBedType.setCreatedBy("SuperAdmin");
            tmBedType.setLastModifiedAt(LocalDateTime.now());
            twBedType.setLastModifiedBy("SuperAdmin");
            tmBedType.setActive(true);
            tmRepository.save(tmBedType);
        } else {
            Optional<HMS_TM_BedType> tmBedType = tmRepository.findByWtIdAndIsActiveTrue(id);
            tmBedType.ifPresent(tmRepository::delete);
        }
        return twBedType;
    }
}



