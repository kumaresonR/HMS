package com.hms.services.adminmanagement.service;


import com.hms.services.adminmanagement.entity.HMS_TM_Specialist;
import com.hms.services.adminmanagement.entity.HMS_TW_Specialist;
import com.hms.services.adminmanagement.repository.HMS_TM_EmployeeRepository;
import com.hms.services.adminmanagement.repository.HMS_TM_SpecialistRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_SpecialistRepository;
import com.hms.services.adminmanagement.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SpecialistService {

    @Autowired
    private HMS_TW_SpecialistRepository twSpecialistRepository;

    @Autowired
    private HMS_TM_SpecialistRepository tmSpecialistRepository;

    public HMS_TW_Specialist createSpecialist(HMS_TW_Specialist specialist) {
        return twSpecialistRepository.save(specialist);
    }

    public HMS_TW_Specialist getSpecialistById(String specialistId) {
        return twSpecialistRepository.findBySpecialistIdAndDeletedFalse(specialistId)
                .orElse(null);    }

    public List<HMS_TW_Specialist> getAllSpecialistsTW() {
        return twSpecialistRepository.findByDeletedFalse();
    }

    public HMS_TW_Specialist updateSpecialist(String id, HMS_TW_Specialist updatedSpecialist) {
        HMS_TW_Specialist existingSpecialist = getSpecialistById(id);
        existingSpecialist.setName(updatedSpecialist.getName());
        existingSpecialist.setModNo(updatedSpecialist.getModNo());
        return twSpecialistRepository.save(existingSpecialist);
    }

    public HMS_TM_Specialist approveSpecialist(String id) {

        HMS_TW_Specialist specialist = getSpecialistById(id);

        if ("UNAUTHORIZED".equals(specialist.getAuthStat())) {
            HMS_TM_Specialist tmSpecialist = new HMS_TM_Specialist();
            tmSpecialist.setSpecialistId(specialist.getSpecialistId());
            tmSpecialist.setName(specialist.getName());
            tmSpecialist.setModNo(specialist.getModNo());
            tmSpecialist.setAuthStat("AUTHORIZED");

            tmSpecialistRepository.save(tmSpecialist);

            specialist.setAuthStat("AUTHORIZED");
            specialist.setRecordStat("OPENED");
            twSpecialistRepository.save(specialist);

            return tmSpecialist;
        } else {
            throw new RuntimeException("Specialist is already approved or rejected");
        }
    }

    public void deleteSpecialist(String id, String authStat) {
        HMS_TM_Specialist tmSpecialist = tmSpecialistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Specialist not found in TM with id: " + id));

        if ("UNAUTHORIZED".equals(authStat)) {
            tmSpecialist.setAuthStat("UNAUTHORIZED");
            tmSpecialistRepository.save(tmSpecialist);

            Optional<HMS_TW_Specialist> twSpecialistOptional = twSpecialistRepository.findById(id);

            if (twSpecialistOptional.isPresent()) {
                HMS_TW_Specialist twSpecialist = twSpecialistOptional.get();
                twSpecialist.setAuthStat("UNAUTHORIZED");
                twSpecialist.setRecordStat("CLOSED");
                twSpecialistRepository.save(twSpecialist);
            }

            tmSpecialistRepository.delete(tmSpecialist);
        } else {
            throw new RuntimeException("Invalid authorization status, only UNAUTHORIZED is allowed");
        }
    }

    public List<HMS_TM_Specialist> getAllSpecialistsTM() {
        return tmSpecialistRepository.findAll();
    }

    public HMS_TM_Specialist getSpecialistByIds(String id) {
        return tmSpecialistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Specialist not found with id: " + id));
    }

    public HMS_TM_Specialist updateSpecialist(String id, HMS_TM_Specialist updatedSpecialist) {
        HMS_TM_Specialist existingSpecialist = getSpecialistByIds(id);
        existingSpecialist.setName(updatedSpecialist.getName());
        return tmSpecialistRepository.save(existingSpecialist);
    }

    public void deleteTwSpecialist(String id) {
        HMS_TW_Specialist specialist = twSpecialistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Specialist not found with id: " + id));
        specialist.setDeleted(true);
        twSpecialistRepository.save(specialist);
    }
}



