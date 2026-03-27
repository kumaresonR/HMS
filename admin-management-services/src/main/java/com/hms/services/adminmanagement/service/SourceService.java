package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_Source;
import com.hms.services.adminmanagement.entity.HMS_TW_Source;
import com.hms.services.adminmanagement.repository.HMS_TM_SourceRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_SourceRepository;
import jakarta.persistence.EntityNotFoundException;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SourceService {

    private final HMS_TM_SourceRepository tmRepository;
    private final HMS_TW_SourceRepository twRepository;

    @Autowired
    public SourceService(final HMS_TM_SourceRepository tmRepository, final HMS_TW_SourceRepository twRepository) {
        this.tmRepository = tmRepository;
        this.twRepository = twRepository;
    }

    public List<HMS_TW_Source> createInWorkTable(List<HMS_TW_Source> twSources) {
        if (twSources == null || twSources.isEmpty()) {
            throw new IllegalArgumentException("Source list cannot be null or empty.");
        }
        twSources.forEach(source -> {
            source.setAuthStat("UnAuthorized");
            source.setRecordStat("Open");
            source.setModNo("V1");
            source.setCreatedAt(LocalDateTime.now());
            source.setActive(true);
        });
        return twRepository.saveAll(twSources);
    }

    public HMS_TW_Source approveWorkTableEntry(String workId, HMS_TW_Source twSource) {
        HMS_TW_Source existingTwSource = twRepository.findByIdAndIsActiveTrue(workId)
                .orElseThrow(() -> new RuntimeException("Work table entry not found"));
        existingTwSource.setSource(twSource.getSource());
        existingTwSource.setDescription(twSource.getDescription());
        existingTwSource.setActive(true);
        existingTwSource.setLastModifiedAt(LocalDateTime.now());
        existingTwSource.setLastModifiedBy("SuperAdmin");
        return twRepository.save(existingTwSource);
    }

    public List<HMS_TM_Source> getAllMasterEntries() {
        return tmRepository.findAllByIsActiveTrue();
    }

    public List<HMS_TW_Source> getAllWorkEntries() {
        return twRepository.findAllByIsActiveTrue();
    }

    public JSONObject softDeleteWorkSource(String sourceId) {
        HMS_TW_Source source = twRepository.findByIdAndIsActiveTrue(sourceId)
                .orElseThrow(() -> new RuntimeException("Work Source not found for ID: " + sourceId));
        source.setActive(false);
        source.setRecordStat("Close");
        source.setLastModifiedBy("SuperAdmin");
        source.setLastModifiedAt(LocalDateTime.now());
        twRepository.save(source);
        JSONObject response = new JSONObject();
        response.put("status", "Deleted Successfully");
        response.put("sourceId", sourceId);
        return response;
    }

    public JSONObject softDeleteMasterSource(String sourceId) {
        HMS_TM_Source source = tmRepository.findByIdAndIsActiveTrue(sourceId)
                .orElseThrow(() -> new RuntimeException("Master Source not found for ID: " + sourceId));
        source.setActive(false);
        source.setRecordStat("Close");
        source.setLastModifiedBy("SuperAdmin");
        source.setLastModifiedAt(LocalDateTime.now());
        tmRepository.save(source);
        JSONObject response = new JSONObject();
        response.put("status", "Deleted Successfully");
        response.put("sourceId", sourceId);
        return response;
    }


    public HMS_TW_Source updateAuthStatById(String id, String authStat) {
        HMS_TW_Source twSource = twRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new EntityNotFoundException("Source with ID " + id + " not found."));
        twSource.setAuthStat(authStat);
        twSource.setLastModifiedAt(LocalDateTime.now());
        twSource.setLastModifiedBy("SuperAdmin");
        HMS_TW_Source twData = twRepository.save(twSource);

        if (authStat.equalsIgnoreCase("Authorized")) {
            HMS_TM_Source tmSource = new HMS_TM_Source();
            tmSource.setId(twSource.getId());
            tmSource.setSource(twSource.getSource());
            tmSource.setDescription(twSource.getDescription());
            tmSource.setWtId(twSource.getId());
            tmSource.setModNo(twSource.getModNo());
            tmSource.setAuthStat(authStat);
            tmSource.setRecordStat(twSource.getRecordStat());
            tmSource.setActive(true);
            tmSource.setCreatedAt(LocalDateTime.now());
            tmSource.setCreatedBy("SuperAdmin");
            tmSource.setLastModifiedAt(LocalDateTime.now());
            tmSource.setLastModifiedBy("SuperAdmin");
            tmRepository.save(tmSource);
        } else {
            Optional<HMS_TM_Source> tmSource = tmRepository.findByWtIdAndIsActiveTrue(id);
            tmSource.ifPresent(tmRepository::delete);
        }

        return twData;
    }
}



