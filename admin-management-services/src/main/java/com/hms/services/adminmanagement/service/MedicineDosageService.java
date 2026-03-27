package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_MedicineDosage;
import com.hms.services.adminmanagement.entity.HMS_TW_MedicineDosage;
import com.hms.services.adminmanagement.repository.HMS_TM_MedicineDosageRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_MedicineDosageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MedicineDosageService {

    @Autowired
    private HMS_TW_MedicineDosageRepository twMedicineDosageRepository;

    @Autowired
    private HMS_TM_MedicineDosageRepository tmMedicineDosageRepository;


    public HMS_TW_MedicineDosage createMedicineDosage(HMS_TW_MedicineDosage medicineDosage) {
        return twMedicineDosageRepository.save(medicineDosage);
    }

    public HMS_TW_MedicineDosage getMedicineDosageById(String id) {
        return twMedicineDosageRepository.findByIdAndDeletedFalse(id)
                .orElse(null);
    }

    public List<HMS_TW_MedicineDosage> getAllMedicineDosagesTW() {
        return twMedicineDosageRepository.findByDeletedFalse();
    }

    public HMS_TW_MedicineDosage updateMedicineDosage(String id, HMS_TW_MedicineDosage updatedMedicineDosage) {
        HMS_TW_MedicineDosage existingMedicineDosage = getMedicineDosageById(id);
        existingMedicineDosage.setMedicineCategory(updatedMedicineDosage.getMedicineCategory());
        existingMedicineDosage.setDose(updatedMedicineDosage.getDose());
        existingMedicineDosage.setUnit(updatedMedicineDosage.getUnit());
        existingMedicineDosage.setAuthStat(updatedMedicineDosage.getAuthStat());
        existingMedicineDosage.setModNo(updatedMedicineDosage.getModNo());
        return twMedicineDosageRepository.save(existingMedicineDosage);
    }

    public HMS_TW_MedicineDosage approveMedicineDosage(String id) {
        HMS_TW_MedicineDosage medicineDosage = getMedicineDosageById(id);

        if ("UNAUTHORIZED".equals(medicineDosage.getAuthStat())) {
            HMS_TM_MedicineDosage tmMedicineDosage = new HMS_TM_MedicineDosage();
            tmMedicineDosage.setMedicineCategory(medicineDosage.getMedicineCategory());
            tmMedicineDosage.setId(medicineDosage.getId());
            tmMedicineDosage.setDose(medicineDosage.getDose());
            tmMedicineDosage.setUnit(medicineDosage.getUnit());
            tmMedicineDosage.setAuthStat("AUTHORIZED");
            tmMedicineDosage.setModNo(medicineDosage.getModNo());

            tmMedicineDosageRepository.save(tmMedicineDosage);

            medicineDosage.setAuthStat("AUTHORIZED");
            medicineDosage.setRecordStat("OPENED");

            twMedicineDosageRepository.save(medicineDosage);

            return medicineDosage;
        } else {
            throw new RuntimeException("Medicine dosage is already approved or rejected");
        }
    }

    public void deleteMedicineDosage(String id, String authStat) {
        HMS_TM_MedicineDosage tmMedicineDosage = tmMedicineDosageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine dosage not found in TM with id: " + id));

        if ("UNAUTHORIZED".equals(authStat)) {
            tmMedicineDosageRepository.delete(tmMedicineDosage);

            Optional<HMS_TW_MedicineDosage> twMedicineDosageOptional = twMedicineDosageRepository.findById(id);

            if (twMedicineDosageOptional.isPresent()) {
                HMS_TW_MedicineDosage twMedicineDosage = twMedicineDosageOptional.get();
                twMedicineDosage.setAuthStat("UNAUTHORIZED");
                twMedicineDosage.setRecordStat("CLOSED");
                twMedicineDosageRepository.save(twMedicineDosage);
            }
        } else {
            throw new RuntimeException("Invalid authorization status, only UNAUTHORIZED is allowed.");
        }
    }

    public HMS_TM_MedicineDosage getMedicineDosageByIds(String id) {
        return tmMedicineDosageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine dosage not found with id: " + id));
    }

    public List<HMS_TM_MedicineDosage> getAllMedicineDosagesTM() {
        return tmMedicineDosageRepository.findAll();
    }

    public HMS_TM_MedicineDosage updateMedicineDosage(String id, HMS_TM_MedicineDosage updatedMedicineDosage) {
        HMS_TM_MedicineDosage existingMedicineDosage = getMedicineDosageByIds(id);
        existingMedicineDosage.setMedicineCategory(updatedMedicineDosage.getMedicineCategory());
        existingMedicineDosage.setDose(updatedMedicineDosage.getDose());
        existingMedicineDosage.setUnit(updatedMedicineDosage.getUnit());
        existingMedicineDosage.setAuthStat(updatedMedicineDosage.getAuthStat());
        return tmMedicineDosageRepository.save(existingMedicineDosage);
    }

    public void deleteTwMedicineDosage(String dosageId) {
        Optional<HMS_TW_MedicineDosage> medicineDosageOptional = twMedicineDosageRepository.findById(dosageId);
        if (medicineDosageOptional.isPresent()) {
            HMS_TW_MedicineDosage medicineDosage = medicineDosageOptional.get();
            medicineDosage.setDeleted(true);
            twMedicineDosageRepository.save(medicineDosage);
        } else {
            throw new RuntimeException("Medicine dosage not found with ID: " + dosageId);
        }
    }
}



