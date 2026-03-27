package com.hms.services.opdmanagement.service;


import com.hms.services.opdmanagement.configuration.AdminManagementInterface;
import com.hms.services.opdmanagement.configuration.ConnectionInterface;
import com.hms.services.opdmanagement.entity.HMS_TM_OPDOperation;
import com.hms.services.opdmanagement.exception.CustomException;
import com.hms.services.opdmanagement.model.EmployeeDetails;
import com.hms.services.opdmanagement.model.OPDCombinedDTO;
import com.hms.services.opdmanagement.model.OPDOperationDTO;
import com.hms.services.opdmanagement.model.OPDPrescriptionsDTO;
import com.hms.services.opdmanagement.repository.OPDOperationRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class OPDOperationService {

    private final OPDOperationRepository repository;
    private final ModelMapper modelMapper;
    private final AdminManagementInterface adminManagementInterface;
    private final ConnectionInterface connectionInterface;


    @Autowired
    public OPDOperationService(OPDOperationRepository repository,final ModelMapper modelMapper,final AdminManagementInterface adminManagementInterface,final ConnectionInterface connectionInterface) {
        this.repository = repository;
        this.modelMapper = modelMapper;
        this.adminManagementInterface = adminManagementInterface;
        this.connectionInterface = connectionInterface;
    }

    // Create or Update
    public HMS_TM_OPDOperation saveOrUpdate(HMS_TM_OPDOperation operation) {
        try {
            operation.setOtReferenceNo("OPDOT"+ UUID.randomUUID().toString().substring(0, 5));
            operation.setIsActive(true);
            return repository.save(operation);
        } catch (Exception ex) {
            throw new CustomException("Error saving or updating operation: " + ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Get all active operations
    public List<HMS_TM_OPDOperation> getAllOperations() {
        try {
            return repository.findAllByIsActiveTrue();
        } catch (Exception ex) {
            throw new CustomException("Error fetching operations: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get operation by ID and isActive = true
    public OPDOperationDTO getOperationById(String operationId) {
        HMS_TM_OPDOperation operation=repository.findByOperationIdAndIsActiveTrue(operationId)
                .orElseThrow(() -> new CustomException("Operation not found or inactive with ID: " + operationId, HttpStatus.NOT_FOUND));
        EmployeeDetails doctorInfo =adminManagementInterface.getEmployeeById(operation.getDoctorId()).getBody();
        OPDOperationDTO opdOperation = modelMapper.map(operation, OPDOperationDTO.class);
        opdOperation.setDoctor(doctorInfo);
        return opdOperation;
    }

    // Delete operation by ID
    public void deleteOperation(String operationId) {
        try {
            HMS_TM_OPDOperation existingOperation = repository.findById(operationId)
                    .orElseThrow(() -> new CustomException("Operation with ID " + operationId + " does not exist.", HttpStatus.NOT_FOUND));
            existingOperation.setIsActive(false);
            existingOperation.setLastModifiedAt(LocalDateTime.now());
            existingOperation.setLastModifiedBy("Admin"); // Replace with dynamic user if applicable
            repository.save(existingOperation);
        } catch (Exception ex) {
            throw new CustomException("Error soft deleting operation: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get active operations by OPD ID
    public List<HMS_TM_OPDOperation> getDetailsByOpdId(String opdId) {
        try {
            return Optional.ofNullable(repository.findByOpdIdAndIsActiveTrue(opdId))
                    .filter(list -> !list.isEmpty())
                    .orElse(Collections.emptyList());
        } catch (Exception ex) {
            throw new CustomException("Error fetching operations for OPD ID: " + opdId, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    public HMS_TM_OPDOperation updateOperationById(String operationId, HMS_TM_OPDOperation updatedOperation) {
        HMS_TM_OPDOperation existingOperation = repository.findByOperationIdAndIsActiveTrue(operationId)
                .orElseThrow(() -> new CustomException("Operation not found or inactive with ID: " + operationId, HttpStatus.NOT_FOUND));
        try {
            existingOperation.setPatientId(updatedOperation.getPatientId());
            existingOperation.setOpdId(updatedOperation.getOpdId());
            existingOperation.setDoctorId(updatedOperation.getDoctorId());
            existingOperation.setOperationCategoryId(updatedOperation.getOperationCategoryId());
            existingOperation.setOperationCategory(updatedOperation.getOperationCategory());
            existingOperation.setOperationName(updatedOperation.getOperationName());
            existingOperation.setOperationNameId(updatedOperation.getOperationNameId());
            existingOperation.setOperationDate(updatedOperation.getOperationDate());
            existingOperation.setAssistantConsultant1(updatedOperation.getAssistantConsultant1());
            existingOperation.setAssistantConsultant2(updatedOperation.getAssistantConsultant2());
            existingOperation.setAnesthetist(updatedOperation.getAnesthetist());
            existingOperation.setAnesthesiaType(updatedOperation.getAnesthesiaType());
            existingOperation.setOtTechnician(updatedOperation.getOtTechnician());
            existingOperation.setOtAssistant(updatedOperation.getOtAssistant());
            existingOperation.setRemark(updatedOperation.getRemark());
            existingOperation.setResult(updatedOperation.getResult());
            existingOperation.setCustomField(updatedOperation.getCustomField());
            existingOperation.setLastModifiedBy(updatedOperation.getLastModifiedBy());
            existingOperation.setLastModifiedAt(LocalDateTime.now());
            return repository.save(existingOperation);
        } catch (Exception ex) {
            throw new CustomException("Error updating operation: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public List<HMS_TM_OPDOperation> getDetailsByOTReferenceNo(String refNo) {

        try {
            return Optional.ofNullable(repository.findByOtReferenceNoAndIsActiveTrue(refNo))
                    .filter(list -> !list.isEmpty())
                    .orElse(Collections.emptyList());
        } catch (Exception ex) {
            throw new CustomException("Error fetching operations for OPD ID: " + refNo, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    public List<OPDOperationDTO> getOperationsByDate(LocalDate operationDate,String status) {
        List<HMS_TM_OPDOperation> operations = repository.findByOperationDateAndStatus(operationDate,status);
        return operations.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private OPDOperationDTO convertToDTO(HMS_TM_OPDOperation operation) {
        OPDOperationDTO dto = new OPDOperationDTO();
        dto.setOperationId(operation.getOperationId());
        dto.setPatientId(operation.getPatientId());
        dto.setOtReferenceNo(operation.getOtReferenceNo());
        dto.setOpdId(operation.getOpdId());
        dto.setDoctorId(operation.getDoctorId());
        dto.setOperationName(operation.getOperationName());
        dto.setOperationCategory(operation.getOperationCategory());
        dto.setOperationCategoryId(operation.getOperationCategoryId());
        dto.setOperationNameId(operation.getOperationNameId());
        dto.setOperationDate(operation.getOperationDate());
        dto.setAssistantConsultant1(operation.getAssistantConsultant1());
        dto.setAssistantConsultant2(operation.getAssistantConsultant2());
        dto.setAnesthetist(operation.getAnesthetist());
        dto.setAnesthesiaType(operation.getAnesthesiaType());
        dto.setOTTechnician(operation.getOtTechnician());
        dto.setOTAssistant(operation.getOtAssistant());
        dto.setRemark(operation.getRemark());
        dto.setResult(operation.getResult());
        dto.setCustomField(operation.getCustomField());
        dto.setStatus(operation.getStatus());
        dto.setIsActive(operation.getIsActive());
        dto.setCreatedAt(operation.getCreatedAt());
        dto.setCreatedBy(operation.getCreatedBy());
        dto.setLastModifiedBy(operation.getLastModifiedBy());
        dto.setLastModifiedAt(operation.getLastModifiedAt());
        EmployeeDetails doctor = adminManagementInterface.getEmployeeById(operation.getDoctorId()).getBody();
        dto.setDoctor(doctor);
        OPDCombinedDTO.PatientDTO patient=connectionInterface.getPatientById(operation.getPatientId()).getBody();
        dto.setFirstName(patient.getFirstName());
        dto.setLastName(patient.getLastName());
        dto.setGender(patient.getGender());
        dto.setDateOfBirth(patient.getDateOfBirth());
        dto.setAge(patient.getAge());
        return dto;
    }


    public String updateOTOperation(String id, OPDOperationDTO operationDTO) {
        try {
            HMS_TM_OPDOperation existingOperation = repository.findByOperationIdAndIsActiveTrue(id)
                    .orElseThrow(() -> new CustomException("Operation not found or inactive with ID: " + id, HttpStatus.NOT_FOUND));

            if (operationDTO.getOperationCategory() != null)
                existingOperation.setOperationCategory(operationDTO.getOperationCategory());
            if (operationDTO.getOperationName() != null)
                existingOperation.setOperationName(operationDTO.getOperationName());
            if (operationDTO.getOperationDate() != null)
                existingOperation.setOperationDate(operationDTO.getOperationDate());
            if (operationDTO.getOperationNameId() != null)
                existingOperation.setOperationNameId(operationDTO.getOperationNameId());
            if (operationDTO.getOperationDate() != null)
                existingOperation.setOperationDate(operationDTO.getOperationDate());
            if (operationDTO.getOperationDate() != null) existingOperation.setOperationDate(operationDTO.getOperationDate());
            if (operationDTO.getDoctorId() != null) existingOperation.setDoctorId(operationDTO.getDoctorId());
            if (operationDTO.getAnesthetist() != null) existingOperation.setAnesthetist(operationDTO.getAnesthetist());
            if (operationDTO.getAnesthesiaType() != null)
                existingOperation.setAnesthesiaType(operationDTO.getAnesthesiaType());
            if (operationDTO.getAssistantConsultant1() != null)
                existingOperation.setAssistantConsultant1(operationDTO.getAssistantConsultant1());
            if (operationDTO.getAssistantConsultant2() != null)
                existingOperation.setAssistantConsultant2(operationDTO.getAssistantConsultant2());
            if (operationDTO.getOTTechnician() != null)
                existingOperation.setOtTechnician(operationDTO.getOTTechnician());
            if (operationDTO.getOTAssistant() != null) existingOperation.setOtAssistant(operationDTO.getOTAssistant());
            if (operationDTO.getRemark() != null) existingOperation.setRemark(operationDTO.getRemark());
            if (operationDTO.getResult() != null) existingOperation.setResult(operationDTO.getResult());
            existingOperation.setLastModifiedBy(operationDTO.getLastModifiedBy());
            existingOperation.setLastModifiedAt(LocalDateTime.now());
            HMS_TM_OPDOperation updatedOperation=repository.save(existingOperation);
            if(updatedOperation!=null){
                return "Updated Successfully";
            }
        }catch(Exception ex){
            throw new CustomException("Error updating operation: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return null;
    }

    public String updateOTOperationStatus(String id, String status) {
        try{
        HMS_TM_OPDOperation existingOperation = repository.findByOperationIdAndIsActiveTrue(id)
                .orElseThrow(() -> new CustomException("Operation not found or inactive with ID: " + id, HttpStatus.NOT_FOUND));
        if (status != null) {
            existingOperation.setStatus(status);
            repository.save(existingOperation);
            return "Updated Successfully";
        }
        return null;
        }catch(Exception ex){
            throw new CustomException("Error updating operation: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }




}

