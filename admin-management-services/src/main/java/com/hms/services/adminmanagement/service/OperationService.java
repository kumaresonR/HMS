package com.hms.services.adminmanagement.service;


import com.hms.services.adminmanagement.entity.HMS_TM_Operation;
import com.hms.services.adminmanagement.entity.HMS_TM_OperationCategory;
import com.hms.services.adminmanagement.entity.HMS_TW_Operation;
import com.hms.services.adminmanagement.entity.HMS_TW_OperationCategory;
import com.hms.services.adminmanagement.exceptionhandler.CustomException;
import com.hms.services.adminmanagement.model.OperationCategoryDTO;
import com.hms.services.adminmanagement.model.OperationDTO;
import com.hms.services.adminmanagement.repository.HMS_TM_OperationCategoryRepository;
import com.hms.services.adminmanagement.repository.HMS_TM_OperationRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_OperationCategoryRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_OperationRepository;
import jakarta.persistence.EntityNotFoundException;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OperationService {

    private final HMS_TM_OperationRepository tmRepository;
    private final HMS_TW_OperationRepository twRepository;
    private final HMS_TM_OperationCategoryRepository tmCategoryRepository;
    private final HMS_TW_OperationCategoryRepository twCategoryRepository;

    @Autowired
    public OperationService(final HMS_TM_OperationRepository tmRepository, final HMS_TW_OperationRepository twRepository,
                            final HMS_TM_OperationCategoryRepository tmCategoryRepository,final HMS_TW_OperationCategoryRepository twCategoryRepository) {
        this.tmRepository = tmRepository;
        this.twRepository = twRepository;
        this.tmCategoryRepository = tmCategoryRepository;
        this.twCategoryRepository = twCategoryRepository;
    }

    // Create an entry in the Work Table
    public List<HMS_TW_Operation> createInWorkTable(List<HMS_TW_Operation> twOperation) {
        twOperation.forEach(operation -> {
            operation.setCreatedAt(LocalDateTime.now());
            operation.setCreatedBy("Admin");
            operation.setAuthStat("UnAuthorized");
            operation.setRecordStat("Open");
            operation.setActive(true);
        });
        return twRepository.saveAll(twOperation);
    }

    // Approve the Work Table entry and insert into Master Table
    public HMS_TW_Operation approveWorkTableEntry(String workId, HMS_TW_Operation twOperation) {
        HMS_TW_Operation existingTwOperation = twRepository.findByOperationIdAndIsActiveTrue(workId)
                .orElseThrow(() -> new CustomException("Work table entry not found", HttpStatus.BAD_REQUEST));
        existingTwOperation.setName(twOperation.getName());
        existingTwOperation.setCategoryId(twOperation.getCategoryId());
        existingTwOperation.setLastModifiedAt(LocalDateTime.now());
        existingTwOperation.setModNo(twOperation.getModNo());
        existingTwOperation.setLastModifiedBy("Admin");
        return twRepository.save(existingTwOperation);
    }

    // Get all Master Table entries
    public List<OperationDTO> getAllMasterEntries() {
        List<HMS_TM_Operation> twOperations = tmRepository.findAllByIsActiveTrue();
        return twOperations.stream()
                .map(operation -> {
                    OperationDTO operationDTO = new OperationDTO();
                    operationDTO.setOperationId(operation.getOperationId());
                    operationDTO.setName(operation.getName());
                    operationDTO.setCategoryId(operation.getCategoryId());
                    operationDTO.setModNo(operation.getModNo());
                    operationDTO.setAuthStat(operation.getAuthStat());
                    operationDTO.setRecordStat(operation.getRecordStat());
                    operationDTO.setActive(operation.isActive());
                    operationDTO.setCreatedAt(operation.getCreatedAt());
                    operationDTO.setCreatedBy(operation.getCreatedBy());
                    operationDTO.setLastModifiedBy(operation.getLastModifiedBy());
                    operationDTO.setLastModifiedAt(operation.getLastModifiedAt());
                    List<OperationCategoryDTO> categories = tmCategoryRepository.findByCategoryId(operation.getCategoryId())
                            .stream()
                            .map(category -> {
                                OperationCategoryDTO categoryDTO = new OperationCategoryDTO();
                                categoryDTO.setCategoryId(category.getCategoryId());
                                categoryDTO.setOperationCategory(category.getOperationCategory());
                                categoryDTO.setModNo(category.getModNo());
                                categoryDTO.setAuthStat(category.getAuthStat());
                                categoryDTO.setRecordStat(category.getRecordStat());
                                categoryDTO.setActive(category.isActive());
                                categoryDTO.setCreatedAt(category.getCreatedAt());
                                categoryDTO.setCreatedBy(category.getCreatedBy());
                                categoryDTO.setLastModifiedBy(category.getLastModifiedBy());
                                categoryDTO.setLastModifiedAt(category.getLastModifiedAt());
                                return categoryDTO;
                            })
                            .collect(Collectors.toList());

                    operationDTO.setOperationCategory(categories);

                    return operationDTO;
                })
                .collect(Collectors.toList());
    }

    // Get all Work Table entries
    public List<OperationDTO> getAllWorkEntries() {
        List<HMS_TW_Operation> twOperations = twRepository.findAllByIsActiveTrue();
        return twOperations.stream()
                .map(operation -> {
                    OperationDTO operationDTO = new OperationDTO();
                    operationDTO.setOperationId(operation.getOperationId());
                    operationDTO.setName(operation.getName());
                    operationDTO.setCategoryId(operation.getCategoryId());
                    operationDTO.setModNo(operation.getModNo());
                    operationDTO.setAuthStat(operation.getAuthStat());
                    operationDTO.setRecordStat(operation.getRecordStat());
                    operationDTO.setActive(operation.isActive());
                    operationDTO.setCreatedAt(operation.getCreatedAt());
                    operationDTO.setCreatedBy(operation.getCreatedBy());
                    operationDTO.setLastModifiedBy(operation.getLastModifiedBy());
                    operationDTO.setLastModifiedAt(operation.getLastModifiedAt());
                    List<OperationCategoryDTO> categories = twCategoryRepository.findByCategoryId(operation.getCategoryId())
                            .stream()
                            .map(category -> {
                                OperationCategoryDTO categoryDTO = new OperationCategoryDTO();
                                categoryDTO.setCategoryId(category.getCategoryId());
                                categoryDTO.setOperationCategory(category.getOperationCategory());
                                categoryDTO.setModNo(category.getModNo());
                                categoryDTO.setAuthStat(category.getAuthStat());
                                categoryDTO.setRecordStat(category.getRecordStat());
                                categoryDTO.setActive(category.isActive());
                                categoryDTO.setCreatedAt(category.getCreatedAt());
                                categoryDTO.setCreatedBy(category.getCreatedBy());
                                categoryDTO.setLastModifiedBy(category.getLastModifiedBy());
                                categoryDTO.setLastModifiedAt(category.getLastModifiedAt());
                                return categoryDTO;
                            })
                            .collect(Collectors.toList());

                    operationDTO.setOperationCategory(categories);

                    return operationDTO;
                })
                .collect(Collectors.toList());
    }

    // Soft delete for HMS_TW_Operation
    public JSONObject softDeleteWorkOperation(String operationId) {
        HMS_TW_Operation operation = twRepository.findByOperationIdAndIsActiveTrue(operationId)
                .orElseThrow(() -> new RuntimeException("Work Operation not found for ID: " + operationId));
        operation.setActive(false);
        operation.setRecordStat("Close");
        operation.setLastModifiedBy("SuperAdmin");
        operation.setLastModifiedAt(LocalDateTime.now());
        twRepository.save(operation);
        JSONObject response = new JSONObject();
        response.put("status", "Deleted Successfully");
        response.put("operationId", operationId);
        return response;
    }

    // Soft delete for HMS_TM_Operation
    public JSONObject softDeleteMasterOperation(String operationId) {
        HMS_TM_Operation operation = tmRepository.findByOperationIdAndIsActiveTrue(operationId)
                .orElseThrow(() -> new RuntimeException("Master Operation not found for ID: " + operationId));
        operation.setActive(false);
        operation.setRecordStat("Close");
        operation.setLastModifiedBy("SuperAdmin");
        operation.setLastModifiedAt(LocalDateTime.now());
        tmRepository.save(operation);
        JSONObject response = new JSONObject();
        response.put("status", "Deleted Successfully");
        response.put("operationId", operationId);
        return response;
    }

    @Transactional
    public HMS_TW_Operation updateAuthStatById(String id, String authStat) {
        HMS_TW_Operation twOperation = twRepository.findByOperationIdAndIsActiveTrue(id)
                .orElseThrow(() -> new EntityNotFoundException("Operation with ID " + id + " not found."));
        twOperation.setAuthStat(authStat);
        twOperation.setLastModifiedAt(LocalDateTime.now());
        twOperation.setLastModifiedBy("SuperAdmin");
        HMS_TW_Operation updatedOperation = twRepository.save(twOperation);
        if ("Authorized".equalsIgnoreCase(authStat)) {
            HMS_TM_Operation tmOperation = tmRepository.findByWtIdAndIsActiveTrue(id)
                    .orElseGet(HMS_TM_Operation::new);
            tmOperation.setName(twOperation.getName());
            tmOperation.setCategoryId(twOperation.getCategoryId());
            tmOperation.setWtId(twOperation.getOperationId());
            tmOperation.setModNo(twOperation.getModNo());
            tmOperation.setAuthStat(authStat);
            tmOperation.setRecordStat(twOperation.getRecordStat());
            tmOperation.setActive(true);
            tmOperation.setCreatedAt(LocalDateTime.now());
            tmOperation.setCreatedBy("SuperAdmin");
            tmOperation.setLastModifiedAt(LocalDateTime.now());
            tmOperation.setLastModifiedBy("SuperAdmin");
            tmRepository.save(tmOperation);
        } else {
            Optional<HMS_TM_Operation> tmOperation = tmRepository.findByWtIdAndIsActiveTrue(id);
            tmOperation.ifPresent(tmRepository::delete);
        }

        return updatedOperation;
    }


}



