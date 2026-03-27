package com.hms.services.ipdmanagement.service;


import com.hms.services.ipdmanagement.entity.HMS_TM_IPDDosage;
import com.hms.services.ipdmanagement.entity.HMS_TM_IPDMedication;
import com.hms.services.ipdmanagement.exception.CustomException;
import com.hms.services.ipdmanagement.model.DosageDTO;
import com.hms.services.ipdmanagement.model.MedicationDTO;
import com.hms.services.ipdmanagement.repository.IPDDosageRepository;
import com.hms.services.ipdmanagement.repository.IPDMedicationRepository;
import com.hms.services.ipdmanagement.response.ApiResponse;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class IPDMedicationService {

    private final IPDMedicationRepository medicationRepository;
    private final ModelMapper modelMapper;
    private final IPDDosageRepository dosageRepository;

    @Autowired
    public IPDMedicationService(IPDMedicationRepository medicationRepository,final ModelMapper modelMapper,
                                final IPDDosageRepository dosageRepository) {
        this.medicationRepository = medicationRepository;
        this.modelMapper = modelMapper;
        this.dosageRepository = dosageRepository;
    }

@Transactional
    public ApiResponse saveOrUpdate(MedicationDTO medicationDto) {
        try {
            HMS_TM_IPDMedication medication = modelMapper.map(medicationDto, HMS_TM_IPDMedication.class);
            medication.setActive(true);
            medication.setCreatedAt(LocalDateTime.now());
            medication.setCreatedBy("system");
            HMS_TM_IPDMedication savedMedication = medicationRepository.save(medication);
            if (medicationDto.getDosage() != null && !medicationDto.getDosage().isEmpty()) {
                List<HMS_TM_IPDDosage> dosages = medicationDto.getDosage().stream().map(dosageDto -> {
                    HMS_TM_IPDDosage dosage = modelMapper.map(dosageDto, HMS_TM_IPDDosage.class);
                    dosage.setMedicationId(savedMedication.getMedicationId());
                    dosage.setCreatedAt(LocalDateTime.now());
                    dosage.setCreatedBy("system");
                    dosage.setActive(true);
                    return dosage;
                }).collect(Collectors.toList());
                dosageRepository.saveAll(dosages);
            }
            return new ApiResponse("success", "", "Medication saved successfully with associated dosages", null, null, null, null, null);
        } catch (Exception ex) {
            throw new CustomException("Error saving medication: " + ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public List<HMS_TM_IPDMedication> getAllActiveMedications() {
        try {
            return medicationRepository.findAllByIsActiveTrue();
        } catch (Exception ex) {
            throw new CustomException("Error fetching active medications: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get medication by ID (active only)
    public HMS_TM_IPDMedication getMedicationById(String medicationId) {
        return medicationRepository.findByMedicationIdAndIsActiveTrue(medicationId)
                .orElseThrow(() -> new CustomException("Medication with ID " + medicationId + " not found or inactive", HttpStatus.NOT_FOUND));
    }

    // Get medications by OPD ID (active only)
    public List<MedicationDTO> getMedicationsByOpdId(String ipdId) {
        List<HMS_TM_IPDMedication> medications = medicationRepository.findByIpdIdAndIsActiveTrue(ipdId);
        List<MedicationDTO> medicationDTOList = medications.stream().map(medication -> {
            MedicationDTO medicationDTO = modelMapper.map(medication, MedicationDTO.class);
            List<HMS_TM_IPDDosage> dosages = dosageRepository.findByMedicationIdAndIsActiveTrue(medication.getMedicationId());
            List<DosageDTO> dosageDTOList = dosages.stream().map(dosage -> modelMapper.map(dosage, DosageDTO.class)).collect(Collectors.toList());
            medicationDTO.setDosage(dosageDTOList);
            return medicationDTO;
        }).collect(Collectors.toList());
        return medicationDTOList;
    }

    // Soft delete medication by ID
    public void softDeleteMedication(String medicationId) {
        HMS_TM_IPDMedication medication = medicationRepository.findByMedicationIdAndIsActiveTrue(medicationId)
                .orElseThrow(() -> new CustomException("Medication with ID " + medicationId + " not found", HttpStatus.NOT_FOUND));
        medication.setActive(false);
        medicationRepository.save(medication);
    }


    public void softDeleteDosage(String dosageId) {
        HMS_TM_IPDDosage dosage = dosageRepository.findByDosageIdAndIsActiveTrue(dosageId)
                .orElseThrow(() -> new CustomException("Dosage with ID " + dosageId + " not found", HttpStatus.NOT_FOUND));
        dosage.setActive(false);
        dosageRepository.save(dosage);
    }
@Transactional
    public ApiResponse addDosageToMedication(String medicationId, DosageDTO dosageDto) {
        try {
            HMS_TM_IPDMedication medication = medicationRepository.findByMedicationIdAndIsActiveTrue(medicationId)
                    .orElseThrow(() -> new CustomException("Medication not found", HttpStatus.NOT_FOUND));
            HMS_TM_IPDDosage dosage = modelMapper.map(dosageDto, HMS_TM_IPDDosage.class);
            dosage.setMedicationId(medication.getMedicationId());
            dosage.setActive(true);
            dosage.setCreatedBy("system");
            dosageRepository.save(dosage);
            return new ApiResponse("success", "", "Dosage added successfully", null, null, null, null, null);
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }
    @Transactional
    public ApiResponse updateMedicationAndDosage(MedicationDTO medicationDto, String medicationId, String dosageId) {
        try {
            HMS_TM_IPDMedication medication = medicationRepository.findByMedicationIdAndIsActiveTrue(medicationId)
                    .orElseThrow(() -> new CustomException("Medication not found for ID: " + medicationId, HttpStatus.NOT_FOUND));
            medication.setMedicineId(medicationDto.getMedicineId());
            medication.setMedicineName(medicationDto.getMedicineName());
            medication.setIpdId(medicationDto.getIpdId());
            medication.setMedicineCategory(medicationDto.getMedicineCategory());
            medication.setActive(true);
            HMS_TM_IPDMedication updatedMedication = medicationRepository.save(medication);
            if (medicationDto.getDosage() != null && !medicationDto.getDosage().isEmpty()) {
                List<HMS_TM_IPDDosage> updatedDosages = new ArrayList<>();
                for (DosageDTO dosageDto : medicationDto.getDosage()) {
                    HMS_TM_IPDDosage dosage = dosageRepository.findByDosageIdAndIsActiveTrue(dosageId)
                            .orElseThrow(() -> new CustomException("Dosage not found for ID: " + dosageId, HttpStatus.NOT_FOUND));
                    dosage.setRemarks(dosageDto.getRemarks());
                    dosage.setDosage(dosageDto.getDosage());
                    dosage.setCreatedBy(dosageDto.getCreatedBy());
                    dosage.setDosageDate(dosageDto.getDosageDate());
                    dosage.setDosageTime(dosageDto.getDosageTime());
                    dosage.setActive(true);
                    HMS_TM_IPDDosage updatedDosage = dosageRepository.save(dosage);
                    updatedDosages.add(updatedDosage);
                }
            }
            return new ApiResponse("success", "", "Medication and Dosage updated successfully", null, null, null, null, null);
        } catch (Exception ex) {
            throw new CustomException("Error updating medication and dosage: " + ex.getMessage(), HttpStatus.BAD_REQUEST);
        }


    }



}

