package com.hms.services.ipdmanagement.service;


import com.hms.services.ipdmanagement.entity.HMS_TM_Vitals;
import com.hms.services.ipdmanagement.exception.CustomException;
import com.hms.services.ipdmanagement.repository.VitalsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class VitalsService {


    private final VitalsRepository vitalsRepository;

    @Autowired
    public VitalsService(VitalsRepository vitalsRepository) {
        this.vitalsRepository = vitalsRepository;
    }

    public List<HMS_TM_Vitals> addVitals(List<HMS_TM_Vitals> vitals) {
        try {
            return vitalsRepository.saveAll(vitals);
        }catch (Exception ex){
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public HMS_TM_Vitals updateVitals(String vitalsId, HMS_TM_Vitals updatedVitals) {
        Optional<HMS_TM_Vitals> existingVitals = vitalsRepository.findById(vitalsId);
        if (existingVitals.isPresent()) {
            HMS_TM_Vitals vitals = existingVitals.get();
            vitals.setDate(updatedVitals.getDate());
            vitals.setVitalName(updatedVitals.getVitalName());
            vitals.setVitalValue(updatedVitals.getVitalValue());
            return vitalsRepository.save(vitals);
        }
        throw new CustomException("Invalid Id", HttpStatus.BAD_REQUEST);
    }


    public void deleteVitals(String vitalsId) {
        try {
            vitalsRepository.deleteById(vitalsId);
        }catch (Exception ex){
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    public List<HMS_TM_Vitals> getVitalsByIPDId(String ipdId) {
        return Optional.ofNullable(vitalsRepository.findByIpdId(ipdId))
                .filter(list -> !list.isEmpty())
                .orElse(Collections.emptyList());
    }


    public HMS_TM_Vitals getVitalsById(String vitalsId) {
        return vitalsRepository.findById(vitalsId)
                .orElse(new HMS_TM_Vitals());
    }


}

