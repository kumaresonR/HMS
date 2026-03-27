package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_DoseInterval;
import com.hms.services.adminmanagement.entity.HMS_TW_DoseInterval;
import com.hms.services.adminmanagement.repository.HMS_TM_DoseIntervalRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_DoseIntervalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoseIntervalService {

    @Autowired
    private HMS_TW_DoseIntervalRepository twDoseIntervalRepository;

    @Autowired
    private HMS_TM_DoseIntervalRepository tmDoseIntervalRepository;

    public HMS_TW_DoseInterval createDoseInterval(HMS_TW_DoseInterval doseInterval) {
        return twDoseIntervalRepository.save(doseInterval);
    }

    public HMS_TW_DoseInterval getDoseIntervalById(String id) {
        return twDoseIntervalRepository.findByIdAndDeletedFalse(id)
                .orElse(null);
    }

    public List<HMS_TW_DoseInterval> getAllDoseIntervalsTW() {
        return twDoseIntervalRepository.findByDeletedFalse();
    }

    public HMS_TW_DoseInterval updateDoseInterval(String id, HMS_TW_DoseInterval updatedDoseInterval) {
        HMS_TW_DoseInterval existingDoseInterval = getDoseIntervalById(id);
        existingDoseInterval.setInterval(updatedDoseInterval.getInterval());
        existingDoseInterval.setModNo(updatedDoseInterval.getModNo());
        return twDoseIntervalRepository.save(existingDoseInterval);
    }

    public HMS_TW_DoseInterval approveDoseInterval(String id ) {

        HMS_TW_DoseInterval doseInterval = getDoseIntervalById(id);

        if ("UNAUTHORIZED".equals(doseInterval.getAuthStat())) {

            HMS_TM_DoseInterval tmDoseInterval = new HMS_TM_DoseInterval();
            tmDoseInterval.setInterval(doseInterval.getInterval());
            tmDoseInterval.setAuthStat("AUTHORIZED");
            tmDoseInterval.setId(doseInterval.getId());
            tmDoseInterval.setModNo(doseInterval.getModNo());

            tmDoseIntervalRepository.save(tmDoseInterval);

            doseInterval.setAuthStat("AUTHORIZED");
            doseInterval.setRecordStat("OPENED");

            twDoseIntervalRepository.save(doseInterval);

            return doseInterval;
        } else {
            throw new RuntimeException("Dose interval is already approved or rejected");
        }
    }

    public void deleteDoseInterval(String id, String authStat) {
        HMS_TM_DoseInterval tmDoseInterval = tmDoseIntervalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dose interval not found in TM with id: " + id));

        if ("UNAUTHORIZED".equals(authStat)) {
            tmDoseIntervalRepository.delete(tmDoseInterval);

            Optional<HMS_TW_DoseInterval> twDoseIntervalOptional = twDoseIntervalRepository.findById(id);

            if (twDoseIntervalOptional.isPresent()) {
                HMS_TW_DoseInterval twDoseInterval = twDoseIntervalOptional.get();
                twDoseInterval.setAuthStat("UNAUTHORIZED");
                twDoseInterval.setRecordStat("CLOSED");
                twDoseIntervalRepository.save(twDoseInterval);
            }
        } else {
            throw new RuntimeException("Invalid authorization status, only UNAUTHORIZED is allowed.");
        }
    }

    public HMS_TM_DoseInterval getDoseIntervalByIds(String id) {
        return tmDoseIntervalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dose interval not found with id: " + id));
    }

    public List<HMS_TM_DoseInterval> getAllDoseIntervalsTM() {
        return tmDoseIntervalRepository.findAll();
    }

    public HMS_TM_DoseInterval updateDoseInterval(String id, HMS_TM_DoseInterval updatedDoseInterval) {
        HMS_TM_DoseInterval existingDoseInterval = getDoseIntervalByIds(id);
        existingDoseInterval.setInterval(updatedDoseInterval.getInterval());
        existingDoseInterval.setModNo(updatedDoseInterval.getModNo());
        return tmDoseIntervalRepository.save(existingDoseInterval);
    }

    public void deleteTwDoseInterval(String intervalId) {
        Optional<HMS_TW_DoseInterval> doseIntervalOptional = twDoseIntervalRepository.findById(intervalId);
        if (doseIntervalOptional.isPresent()) {
            HMS_TW_DoseInterval doseInterval = doseIntervalOptional.get();
            doseInterval.setDeleted(true);
            twDoseIntervalRepository.save(doseInterval);
        } else {
            throw new RuntimeException("Dose interval not found with ID: " + intervalId);
        }
    }
}






