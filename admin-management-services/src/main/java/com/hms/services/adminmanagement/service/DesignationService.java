package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_Designation;
import com.hms.services.adminmanagement.entity.HMS_TW_Designation;
import com.hms.services.adminmanagement.repository.HMS_TM_DesignationRepository;
import com.hms.services.adminmanagement.repository.HMS_TM_EmployeeRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_DesignationRepository;
import com.hms.services.adminmanagement.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DesignationService {

    @Autowired
    private HMS_TW_DesignationRepository twDesignationRepository;

    @Autowired
    private HMS_TM_DesignationRepository tmDesignationRepository;

    @Autowired
    private RoleRepository roleRepository;

    public HMS_TW_Designation createDesignation(HMS_TW_Designation designation) {
        return twDesignationRepository.save(designation);
    }

    public HMS_TW_Designation getDesignationById(String id) {
        return twDesignationRepository.findByDesignationIdAndDeletedFalse(id)
                .orElse(null);
    }

    public List<HMS_TW_Designation> getAllDesignations() {
        return twDesignationRepository.findByDeletedFalse();
    }

        public HMS_TW_Designation updateDesignation(String id, HMS_TW_Designation updatedDesignation) {
        HMS_TW_Designation existingDesignation = getDesignationById(id);
        existingDesignation.setName(updatedDesignation.getName());
        existingDesignation.setModNo(updatedDesignation.getModNo());
        return twDesignationRepository.save(existingDesignation);
    }

    public HMS_TM_Designation approveDesignation(String id) {

        HMS_TW_Designation designation = getDesignationById(id);

        if ("UNAUTHORIZED".equals(designation.getAuthStat())) {
            HMS_TM_Designation tmDesignation = new HMS_TM_Designation();
            tmDesignation.setDesignationId(designation.getDesignationId());
            tmDesignation.setName(designation.getName());
            tmDesignation.setModNo(designation.getModNo());
            tmDesignation.setAuthStat("AUTHORIZED");

            tmDesignationRepository.save(tmDesignation);

            designation.setAuthStat("AUTHORIZED");
            designation.setRecordStat("OPENED");
            twDesignationRepository.save(designation);

            return tmDesignation;
        } else {
            throw new RuntimeException("Designation is already approved or rejected");
        }
    }

    public void deleteDesignation(String id, String authStat) {
        HMS_TM_Designation tmDesignation = tmDesignationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Designation not found in TM with id: " + id));

        if ("UNAUTHORIZED".equals(authStat)) {
            tmDesignationRepository.delete(tmDesignation);

            Optional<HMS_TW_Designation> twDesignationOptional = twDesignationRepository.findById(id);

            if (twDesignationOptional.isPresent()) {
                HMS_TW_Designation twDesignation = twDesignationOptional.get();
                twDesignation.setAuthStat("UNAUTHORIZED");
                twDesignation.setRecordStat("CLOSED");
                twDesignationRepository.save(twDesignation);
            }
        } else {
            throw new RuntimeException("Invalid authorization status, only UNAUTHORIZED is allowed");
        }
    }

    public HMS_TM_Designation getDesignationByIds(String id) {
        return tmDesignationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Designation not found with id: " + id));
    }

    public List<HMS_TM_Designation> getAllDesignationsTm() {
        return tmDesignationRepository.findAll();
    }

    public HMS_TM_Designation updateDesignation(String id, HMS_TM_Designation updatedDesignation) {
        HMS_TM_Designation existingDesignation = getDesignationByIds(id);
        existingDesignation.setName(updatedDesignation.getName());
        return tmDesignationRepository.save(existingDesignation);
    }

    public void deleteTwDesignation(String id) {
        HMS_TW_Designation designation = twDesignationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Designation not found with id: " + id));
        designation.setDeleted(true);
        twDesignationRepository.save(designation);
    }
}




