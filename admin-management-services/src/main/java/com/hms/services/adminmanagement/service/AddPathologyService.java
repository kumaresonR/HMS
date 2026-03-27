package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_AddPathology;
import com.hms.services.adminmanagement.entity.HMS_TW_AddPathology;
import com.hms.services.adminmanagement.repository.HMS_TM_AddPathologyRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_AddPathologyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AddPathologyService {

    @Autowired
    private HMS_TM_AddPathologyRepository tmAddPathologyRepository;

    @Autowired
    private HMS_TW_AddPathologyRepository twAddPathologyRepository;

    public HMS_TW_AddPathology createPathology(HMS_TW_AddPathology pathology) {
        return twAddPathologyRepository.save(pathology);
    }

    public HMS_TW_AddPathology getPathologyById(String id) {
        return twAddPathologyRepository.findByIdAndDeletedFalse(id)
                .orElse(null);
    }

    public List<HMS_TW_AddPathology> getAllPathologiesTW() {
        return twAddPathologyRepository.findByDeletedFalse();
    }

    public HMS_TW_AddPathology updatePathology(String id, HMS_TW_AddPathology updatedPathology) {
        HMS_TW_AddPathology existingPathology = getPathologyById(id);
        existingPathology.setCategoryName(updatedPathology.getCategoryName());
        existingPathology.setModNo(updatedPathology.getModNo());
        return twAddPathologyRepository.save(existingPathology);
    }

    public HMS_TW_AddPathology approvePathology(String id) {

        HMS_TW_AddPathology pathology = getPathologyById(id);

        if ("UNAUTHORIZED".equals(pathology.getAuthStat())) {
            HMS_TM_AddPathology tmPathology = new HMS_TM_AddPathology();
            tmPathology.setCategoryName(pathology.getCategoryName());
            tmPathology.setId(pathology.getId());
            tmPathology.setModNo(pathology.getModNo());
            tmPathology.setAuthStat("AUTHORIZED");

            tmAddPathologyRepository.save(tmPathology);

            pathology.setAuthStat("AUTHORIZED");
            pathology.setRecordStat("OPENED");
            twAddPathologyRepository.save(pathology);

            return pathology;
        } else {
            throw new RuntimeException("Pathology is already approved or rejected");
        }
    }

    public void deletePathology(String id, String authStat) {
        HMS_TM_AddPathology tmAddPathology = tmAddPathologyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pathology not found in TM with id: " + id));

        if ("UNAUTHORIZED".equalsIgnoreCase(authStat)) {
            tmAddPathologyRepository.delete(tmAddPathology);

            Optional<HMS_TW_AddPathology> twAddPathologyOptional = twAddPathologyRepository.findById(id);

            if (twAddPathologyOptional.isPresent()) {
                HMS_TW_AddPathology twAddPathology = twAddPathologyOptional.get();
                twAddPathology.setAuthStat("UNAUTHORIZED");
                twAddPathology.setRecordStat("CLOSED");
                twAddPathologyRepository.save(twAddPathology);
            }
        } else {
            throw new RuntimeException("Invalid authorization status. Only UNAUTHORIZED is allowed.");
        }
    }

    public HMS_TM_AddPathology getTMPathologyById(String id) {
        return tmAddPathologyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pathology not found with id: " + id));
    }

    public List<HMS_TM_AddPathology> getAllPathologiesTM() {
        return tmAddPathologyRepository.findAll();
    }

    public HMS_TM_AddPathology updateTMPathology(String id, HMS_TM_AddPathology updatedPathology) {
        HMS_TM_AddPathology existingPathology = getTMPathologyById(id);
        existingPathology.setCategoryName(updatedPathology.getCategoryName());
        return tmAddPathologyRepository.save(existingPathology);
    }

    public void deleteTWPathology(String id) {
        Optional<HMS_TW_AddPathology> pathologyOptional = twAddPathologyRepository.findById(id);
        if (pathologyOptional.isPresent()) {
            HMS_TW_AddPathology pathology = pathologyOptional.get();
            pathology.setDeleted(true);
            twAddPathologyRepository.save(pathology);
        } else {
            throw new RuntimeException("Pathology not found with ID: " + id);
        }
    }
}




