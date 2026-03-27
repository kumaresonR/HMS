package com.hms.services.ipdmanagement.service;


import com.hms.services.ipdmanagement.entity.HMS_TM_Prescriptions;
import com.hms.services.ipdmanagement.entity.HMS_TM_PreviousObstetricHistory;
import com.hms.services.ipdmanagement.exception.CustomException;
import com.hms.services.ipdmanagement.model.PreviousObstetricHistoryDTO;
import com.hms.services.ipdmanagement.repository.PreviousObstetricHistoryRepository;
import org.json.simple.JSONObject;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PreviousObstetricHistoryService {

    private final PreviousObstetricHistoryRepository repository;
    private final ModelMapper modelMapper;

    public PreviousObstetricHistoryService(PreviousObstetricHistoryRepository repository,final ModelMapper modelMapper) {
        this.repository = repository;
        this.modelMapper = modelMapper;
    }

    // Create or Update Record
    public PreviousObstetricHistoryDTO saveOrUpdate(PreviousObstetricHistoryDTO history) {
        try {
            HMS_TM_PreviousObstetricHistory previousHistory = modelMapper.map(history, HMS_TM_PreviousObstetricHistory.class);
            previousHistory.setActive(true);
            previousHistory.setCreatedBy("Admin");
            previousHistory.setCreatedAt(LocalDateTime.now());
            HMS_TM_PreviousObstetricHistory savedEntity = repository.save(previousHistory);
            return modelMapper.map(savedEntity, PreviousObstetricHistoryDTO.class);
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Get All Active Records
    public List<HMS_TM_PreviousObstetricHistory> getAllActive() {
        return repository.findAllByIsActiveTrue();
    }

    // Get Record by ID
    public Optional<HMS_TM_PreviousObstetricHistory> getById(String historyId) {
        return repository.findByHistoryIdAndIsActiveTrue(historyId);
    }

    // Get Records by IPD ID
    public List<HMS_TM_PreviousObstetricHistory> getByIpdId(String ipdId) {
        return repository.findByIpdIdAndIsActiveTrue(ipdId);
    }


    public JSONObject softDelete(String historyId) {
        HMS_TM_PreviousObstetricHistory history = repository.findByHistoryIdAndIsActiveTrue(historyId)
                .orElseThrow(() -> new RuntimeException("Record not found or already inactive"));
        history.setActive(false);
        history.setLastModifiedAt(LocalDateTime.now());
        repository.save(history);
        JSONObject response = new JSONObject();
        response.put("Message", "Record soft-deleted successfully");
        return response;
    }


    public PreviousObstetricHistoryDTO updateRecord(String id, PreviousObstetricHistoryDTO updatedHistory) {
        HMS_TM_PreviousObstetricHistory existingRecord = repository.findByHistoryIdAndIsActiveTrue(id)
                .orElseThrow(() -> new CustomException("Record not found", HttpStatus.NOT_FOUND));
        existingRecord.setPlaceOfDelivery(updatedHistory.getPlaceOfDelivery());
        existingRecord.setDurationOfPregnancy(updatedHistory.getDurationOfPregnancy());
        existingRecord.setComplicationsInPregnancyOrPuerperium(updatedHistory.getComplicationsInPregnancyOrPuerperium());
        existingRecord.setBirthWeight(updatedHistory.getBirthWeight());
        existingRecord.setGender(updatedHistory.getGender());
        existingRecord.setInfantFeeding(updatedHistory.getInfantFeeding());
        existingRecord.setBirthStatus(updatedHistory.getBirthStatus());
        existingRecord.setAliveStatus(updatedHistory.getAliveStatus());
        existingRecord.setDeathCause(updatedHistory.getDeathCause());
        existingRecord.setAliveOrDeadDate(updatedHistory.getAliveOrDeadDate());
        existingRecord.setPreviousMedicalHistory(updatedHistory.getPreviousMedicalHistory());
        existingRecord.setSpecialInstruction(updatedHistory.getSpecialInstruction());
        existingRecord.setHistoryId(id);
        existingRecord.setLastModifiedAt(LocalDateTime.now());
        existingRecord.setActive(true);
        HMS_TM_PreviousObstetricHistory savedRecord = repository.save(existingRecord);
        return modelMapper.map(savedRecord, PreviousObstetricHistoryDTO.class);
    }


}

