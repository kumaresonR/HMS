package com.hms.services.bloodbankmanagement.service;

import com.hms.services.bloodbankmanagement.entity.HMS_TM_BloodComponent;
import com.hms.services.bloodbankmanagement.repository.BloodComponentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BloodComponentService {

    @Autowired
    private BloodComponentRepository bloodComponentRepository;

    public List<HMS_TM_BloodComponent> createBloodComponent(List<HMS_TM_BloodComponent> bloodComponents) {
        return bloodComponentRepository.saveAll(bloodComponents);
    }

    public List<HMS_TM_BloodComponent> getAllBloodComponents() {
        return bloodComponentRepository.findByDeletedFalse();
    }

    public HMS_TM_BloodComponent softDeleteBloodComponent(String id) {
        Optional<HMS_TM_BloodComponent> existingBloodComponentOpt = bloodComponentRepository.findById(id);

        if (existingBloodComponentOpt.isPresent()) {
            HMS_TM_BloodComponent existingBloodComponent = existingBloodComponentOpt.get();
            existingBloodComponent.setDeleted(true);
            return bloodComponentRepository.save(existingBloodComponent);
        } else {
            throw new RuntimeException("Blood Component not found with ID: " + id);
        }
    }
}



