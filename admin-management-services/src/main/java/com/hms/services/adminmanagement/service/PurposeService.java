package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_Purpose;
import com.hms.services.adminmanagement.entity.HMS_TW_Purpose;
import com.hms.services.adminmanagement.exceptionhandler.CustomException;
import com.hms.services.adminmanagement.repository.HMS_TM_PurposeRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_PurposeRepository;
import jakarta.persistence.EntityNotFoundException;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PurposeService {

    private final HMS_TM_PurposeRepository tmRepository;
    private final HMS_TW_PurposeRepository twRepository;

    @Autowired
    public PurposeService(final HMS_TM_PurposeRepository tmRepository, final HMS_TW_PurposeRepository twRepository) {
        this.tmRepository = tmRepository;
        this.twRepository = twRepository;
    }

    // Create entries in the Work Table
    public List<HMS_TW_Purpose> createInWorkTable(List<HMS_TW_Purpose> twPurposes) {
        if (twPurposes == null || twPurposes.isEmpty()) {
            throw new IllegalArgumentException("Source list cannot be null or empty.");
        }
        twPurposes.forEach(purpose -> {
            purpose.setCreatedAt(LocalDateTime.now());
            purpose.setModNo("V1");
            purpose.setAuthStat("UnAuthorized");
            purpose.setRecordStat("Open");
            purpose.setActive(true);
        });
        return twRepository.saveAll(twPurposes);
    }

    // Approve a Work Table entry and move it to the Master Table
    public HMS_TW_Purpose approveWorkTableEntry(String id, HMS_TW_Purpose twPurpose) {
        HMS_TW_Purpose existingEntry = twRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new CustomException("Work table entry not found", HttpStatus.BAD_REQUEST));
        existingEntry.setPurpose(twPurpose.getPurpose());
        existingEntry.setDescription(twPurpose.getDescription());
        existingEntry.setActive(true);
        existingEntry.setLastModifiedAt(LocalDateTime.now());
        existingEntry.setLastModifiedBy("SuperAdmin");
        return twRepository.save(existingEntry);
    }

    // Get all active Master Table entries
    public List<HMS_TM_Purpose> getAllMasterEntries() {
        return tmRepository.findAllByIsActiveTrue();
    }

    // Get all active Work Table entries
    public List<HMS_TW_Purpose> getAllWorkEntries() {
        return twRepository.findAllByIsActiveTrue();
    }

    // Soft delete a Work Table entry
    public JSONObject softDeleteWorkEntry(String id) {
        HMS_TW_Purpose entry = twRepository.findByIdAndIsActiveTrue(id)
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
        HMS_TM_Purpose entry = tmRepository.findByIdAndIsActiveTrue(id)
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


    public HMS_TW_Purpose updateAuthStatById(String id, String authStat) {
        HMS_TW_Purpose twPurpose = twRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new EntityNotFoundException("Purpose with ID " + id + " not found."));
        twPurpose.setAuthStat(authStat);
        twPurpose.setLastModifiedAt(LocalDateTime.now());
        twPurpose.setLastModifiedBy("SuperAdmin");
        HMS_TW_Purpose updatedPurpose = twRepository.save(twPurpose);
        if (authStat.equalsIgnoreCase("Authorized")) {
            HMS_TM_Purpose tmPurpose = new HMS_TM_Purpose();
            tmPurpose.setPurpose(twPurpose.getPurpose());
            tmPurpose.setDescription(twPurpose.getDescription());
            tmPurpose.setWtId(twPurpose.getId());
            tmPurpose.setModNo(twPurpose.getModNo());
            tmPurpose.setAuthStat(authStat);
            tmPurpose.setRecordStat(twPurpose.getRecordStat());
            tmPurpose.setActive(true);
            tmPurpose.setCreatedAt(LocalDateTime.now());
            tmPurpose.setCreatedBy("SuperAdmin");
            tmPurpose.setLastModifiedAt(LocalDateTime.now());
            tmPurpose.setLastModifiedBy("SuperAdmin");
            tmRepository.save(tmPurpose);
        } else {
            Optional<HMS_TM_Purpose> tmPurpose = tmRepository.findByWtIdAndIsActiveTrue(id);
            tmPurpose.ifPresent(tmRepository::delete);
        }

        return updatedPurpose;
    }
}



