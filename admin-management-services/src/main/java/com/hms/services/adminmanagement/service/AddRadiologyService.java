package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_AddRadiology;
import com.hms.services.adminmanagement.entity.HMS_TW_AddRadiology;
import com.hms.services.adminmanagement.repository.HMS_TM_AddRadiologyRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_AddRadiologyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AddRadiologyService {

    @Autowired
    private HMS_TM_AddRadiologyRepository tmAddRadiologyRepository;

    @Autowired
    private HMS_TW_AddRadiologyRepository twAddRadiologyRepository;

    public HMS_TW_AddRadiology createRadiology(HMS_TW_AddRadiology radiology) {
        return twAddRadiologyRepository.save(radiology);
    }

    public HMS_TW_AddRadiology getRadiologyById(String id) {
        return twAddRadiologyRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Radiology not found or might be deleted with id: " + id));
    }

    public List<HMS_TW_AddRadiology> getAllRadiologiesTW() {
        return twAddRadiologyRepository.findByDeletedFalse();
    }

    public HMS_TW_AddRadiology updateRadiology(String id, HMS_TW_AddRadiology updatedRadiology) {
        HMS_TW_AddRadiology existingRadiology = getRadiologyById(id);
        existingRadiology.setCategoryName(updatedRadiology.getCategoryName());
        existingRadiology.setModNo(updatedRadiology.getModNo());
        return twAddRadiologyRepository.save(existingRadiology);
    }

    public HMS_TW_AddRadiology approveRadiology(String id ) {

        HMS_TW_AddRadiology radiology = getRadiologyById(id);

        if ("UNAUTHORIZED".equals(radiology.getAuthStat())) {
            HMS_TM_AddRadiology tmRadiology = new HMS_TM_AddRadiology();
            tmRadiology.setCategoryName(radiology.getCategoryName());
            tmRadiology.setAuthStat("AUTHORIZED");
            tmRadiology.setId(radiology.getId());
            tmRadiology.setModNo(radiology.getModNo());

            tmAddRadiologyRepository.save(tmRadiology);

            radiology.setAuthStat("AUTHORIZED");
            radiology.setRecordStat("OPENED");
            twAddRadiologyRepository.save(radiology);

            return radiology;
        } else {
            throw new RuntimeException("Radiology is already approved or rejected");
        }
    }

    public void deleteRadiology(String id, String authStat) {
        HMS_TM_AddRadiology tmRadiology = tmAddRadiologyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Radiology not found in TM with id: " + id));

        if ("UNAUTHORIZED".equalsIgnoreCase(authStat)) {
            tmAddRadiologyRepository.delete(tmRadiology);

            Optional<HMS_TW_AddRadiology> twRadiologyOptional = twAddRadiologyRepository.findById(id);

            if (twRadiologyOptional.isPresent()) {
                HMS_TW_AddRadiology twRadiology = twRadiologyOptional.get();
                twRadiology.setAuthStat("UNAUTHORIZED");
                twRadiology.setRecordStat("CLOSED");
                twAddRadiologyRepository.save(twRadiology);
            }
        } else {
            throw new RuntimeException("Invalid authorization status. Only UNAUTHORIZED status is allowed for deletion.");
        }
    }

    public HMS_TM_AddRadiology getTMRadiologyById(String id) {
        return tmAddRadiologyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Radiology not found with id: " + id));
    }

    public List<HMS_TM_AddRadiology> getAllRadiologiesTM() {
        return tmAddRadiologyRepository.findAll();
    }

    public HMS_TM_AddRadiology updateTMRadiology(String id, HMS_TM_AddRadiology updatedRadiology) {
        HMS_TM_AddRadiology existingRadiology = getTMRadiologyById(id);
        existingRadiology.setCategoryName(updatedRadiology.getCategoryName());
        return tmAddRadiologyRepository.save(existingRadiology);
    }

    public void deleteTWRadiology(String id) {
        Optional<HMS_TW_AddRadiology> radiologyOptional = twAddRadiologyRepository.findById(id);
        if (radiologyOptional.isPresent()) {
            HMS_TW_AddRadiology radiology = radiologyOptional.get();
            radiology.setDeleted(true);
            twAddRadiologyRepository.save(radiology);
        } else {
            throw new RuntimeException("Radiology not found with ID: " + id);
        }
    }
}



