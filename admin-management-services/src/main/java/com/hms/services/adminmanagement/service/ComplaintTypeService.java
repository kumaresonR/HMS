package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_ComplaintType;
import com.hms.services.adminmanagement.entity.HMS_TW_ComplaintType;
import com.hms.services.adminmanagement.exceptionhandler.CustomException;
import com.hms.services.adminmanagement.repository.HMS_TM_ComplaintTypeRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_ComplaintTypeRepository;
import jakarta.persistence.EntityNotFoundException;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ComplaintTypeService {

    private final HMS_TM_ComplaintTypeRepository tmRepository;
    private final HMS_TW_ComplaintTypeRepository twRepository;

    @Autowired
    public ComplaintTypeService(final HMS_TM_ComplaintTypeRepository tmRepository, final HMS_TW_ComplaintTypeRepository twRepository) {
        this.tmRepository = tmRepository;
        this.twRepository = twRepository;
    }

    // Create entries in the Work Table
    public List<HMS_TW_ComplaintType> createInWorkTable(List<HMS_TW_ComplaintType> twComplaintTypes) {
        twComplaintTypes.forEach(type -> {
            type.setAuthStat("UnAuthorized");
            type.setRecordStat("Open");
            type.setModNo("V1");
            type.setCreatedAt(LocalDateTime.now());
            type.setActive(true);
        });
        return twRepository.saveAll(twComplaintTypes);
    }

    // Approve an entry in the Work Table and move it to the Master Table
    public HMS_TW_ComplaintType approveWorkTableEntry(String id, HMS_TW_ComplaintType twComplaintType) {
        HMS_TW_ComplaintType existingEntry = twRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new CustomException("Work table entry not found", HttpStatus.BAD_REQUEST));
        existingEntry.setComplainType(twComplaintType.getComplainType());
        existingEntry.setDescription(twComplaintType.getDescription());
        existingEntry.setActive(true);
        existingEntry.setLastModifiedAt(LocalDateTime.now());
        existingEntry.setLastModifiedBy("SuperAdmin");
        return twRepository.save(existingEntry);
    }

    // Retrieve all active entries from the Master Table
    public List<HMS_TM_ComplaintType> getAllMasterEntries() {
        return tmRepository.findAllByIsActiveTrue();
    }

    // Retrieve all active entries from the Work Table
    public List<HMS_TW_ComplaintType> getAllWorkEntries() {
        return twRepository.findAllByIsActiveTrue();
    }

    // Soft delete a Work Table entry
    public JSONObject softDeleteWorkEntry(String id) {
        HMS_TW_ComplaintType entry = twRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new CustomException("Work table entry not found", HttpStatus.BAD_REQUEST));
        entry.setActive(false);
        entry.setRecordStat("Close");
        entry.setLastModifiedBy("SuperAdmin");
        entry.setLastModifiedAt(LocalDateTime.now());
        twRepository.save(entry);
        JSONObject response = new JSONObject();
        response.put("status", "Deleted Successfully");
        response.put("id", id);
        return response;
    }

    // Soft delete a Master Table entry
    public JSONObject softDeleteMasterEntry(String id) {
        HMS_TM_ComplaintType entry = tmRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new CustomException("Master table entry not found", HttpStatus.BAD_REQUEST));
        entry.setActive(false);
        entry.setRecordStat("Close");
        entry.setLastModifiedBy("SuperAdmin");
        entry.setLastModifiedAt(LocalDateTime.now());
        tmRepository.save(entry);
        JSONObject response = new JSONObject();
        response.put("status", "Deleted Successfully");
        response.put("id", id);
        return response;
    }


    public HMS_TW_ComplaintType updateAuthStatById(String id, String authStat) {
        HMS_TW_ComplaintType twComplaintType = twRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new EntityNotFoundException("Complaint Type with ID " + id + " not found."));
        twComplaintType.setAuthStat(authStat);
        twComplaintType.setLastModifiedAt(LocalDateTime.now());
        twComplaintType.setLastModifiedBy("SuperAdmin");
        HMS_TW_ComplaintType updatedComplaintType = twRepository.save(twComplaintType);
        if (authStat.equalsIgnoreCase("Authorized")) {
            HMS_TM_ComplaintType tmComplaintType = new HMS_TM_ComplaintType();
            tmComplaintType.setId(twComplaintType.getId());
            tmComplaintType.setComplainType(twComplaintType.getComplainType());
            tmComplaintType.setDescription(twComplaintType.getDescription());
            tmComplaintType.setWtId(twComplaintType.getId());
            tmComplaintType.setModNo(twComplaintType.getModNo());
            tmComplaintType.setAuthStat(authStat);
            tmComplaintType.setRecordStat(twComplaintType.getRecordStat());
            tmComplaintType.setActive(true);
            tmComplaintType.setCreatedAt(LocalDateTime.now());
            tmComplaintType.setCreatedBy("SuperAdmin");
            tmComplaintType.setLastModifiedAt(LocalDateTime.now());
            tmComplaintType.setLastModifiedBy("SuperAdmin");
            tmRepository.save(tmComplaintType);
        } else {
            // Delete the master entry if the status is not "Authorized"
            Optional<HMS_TM_ComplaintType> tmComplaintType = tmRepository.findByWtIdAndIsActiveTrue(id);
            tmComplaintType.ifPresent(tmRepository::delete);
        }

        return updatedComplaintType;
    }
}



