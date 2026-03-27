package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_DoseDuration;
import com.hms.services.adminmanagement.entity.HMS_TW_DoseDuration;
import com.hms.services.adminmanagement.repository.HMS_TM_DoseDurationRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_DoseDurationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoseDurationService {

    @Autowired
    private HMS_TM_DoseDurationRepository tmDoseDurationRepository;

    @Autowired
    private HMS_TW_DoseDurationRepository twDoseDurationRepository;

    public List<HMS_TW_DoseDuration> createDoseDurations(List<HMS_TW_DoseDuration> doseDurations) {
        return twDoseDurationRepository.saveAll(doseDurations);
    }

    public HMS_TW_DoseDuration getDoseDurationById(String id) {
        return twDoseDurationRepository.findByIdAndDeletedFalse(id)
                .orElse(null);
    }

    public List<HMS_TW_DoseDuration> getAllDoseDurationsTW() {
        return twDoseDurationRepository.findByDeletedFalse();
    }

    public HMS_TW_DoseDuration updateDoseDuration(String id, HMS_TW_DoseDuration updatedDoseDuration) {
        HMS_TW_DoseDuration existingDoseDuration = getDoseDurationById(id);
        existingDoseDuration.setDuration(updatedDoseDuration.getDuration());
        existingDoseDuration.setModNo(updatedDoseDuration.getModNo());
        return twDoseDurationRepository.save(existingDoseDuration);
    }

    public HMS_TW_DoseDuration approveDoseDuration(String id) {
        HMS_TW_DoseDuration twDoseDuration = getDoseDurationById(id);

        if ("UNAUTHORIZED".equalsIgnoreCase(twDoseDuration.getAuthStat())) {
            HMS_TM_DoseDuration tmDoseDuration = new HMS_TM_DoseDuration();
            tmDoseDuration.setDuration(twDoseDuration.getDuration());
            tmDoseDuration.setAuthStat("AUTHORIZED");
            tmDoseDuration.setId(twDoseDuration.getId());
            tmDoseDuration.setModNo(twDoseDuration.getModNo());

            tmDoseDurationRepository.save(tmDoseDuration);

            twDoseDuration.setAuthStat("AUTHORIZED");
            twDoseDuration.setRecordStat("OPENED");
            return twDoseDurationRepository.save(twDoseDuration);
        } else {
            throw new RuntimeException("Dose Duration is already approved or rejected.");
        }
    }

    public void deleteDoseDuration(String id, String authStat) {
        HMS_TM_DoseDuration tmDoseDuration = tmDoseDurationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dose Duration not found in TM with id: " + id));

        if ("UNAUTHORIZED".equalsIgnoreCase(authStat)) {
            tmDoseDurationRepository.delete(tmDoseDuration);

            Optional<HMS_TW_DoseDuration> twDoseDurationOptional = twDoseDurationRepository.findById(id);

            if (twDoseDurationOptional.isPresent()) {
                HMS_TW_DoseDuration twDoseDuration = twDoseDurationOptional.get();
                twDoseDuration.setAuthStat("UNAUTHORIZED");
                twDoseDuration.setRecordStat("CLOSED");
                twDoseDurationRepository.save(twDoseDuration);
            }
        } else {
            throw new RuntimeException("Invalid authorization status. Only UNAUTHORIZED is allowed.");
        }
    }

    public HMS_TM_DoseDuration getDoseDurationByIds(String id) {
        return tmDoseDurationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dose Duration not found with id: " + id));
    }

    public List<HMS_TM_DoseDuration> getAllDoseDurationsTM() {
        return tmDoseDurationRepository.findAll();
    }

    public HMS_TM_DoseDuration updateDoseDuration(String id, HMS_TM_DoseDuration updatedDoseDuration) {
        HMS_TM_DoseDuration existingDoseDuration = getDoseDurationByIds(id);
        existingDoseDuration.setDuration(updatedDoseDuration.getDuration());
        return tmDoseDurationRepository.save(existingDoseDuration);
    }

    public void deleteTwDoseDuration(String id) {
        Optional<HMS_TW_DoseDuration> doseDurationOptional = twDoseDurationRepository.findById(id);
        if (doseDurationOptional.isPresent()) {
            HMS_TW_DoseDuration doseDuration = doseDurationOptional.get();
            doseDuration.setDeleted(true);
            twDoseDurationRepository.save(doseDuration);
        } else {
            throw new RuntimeException("Dose Duration not found with id: " + id);
        }
    }
}



