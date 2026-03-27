package com.hms.services.opdmanagement.service;


import com.hms.services.opdmanagement.entity.HMS_TM_OPDDosage;
import com.hms.services.opdmanagement.entity.HMS_TM_OPDMedication;
import com.hms.services.opdmanagement.exception.CustomException;
import com.hms.services.opdmanagement.model.DosageDTO;
import com.hms.services.opdmanagement.model.MedicationDTO;
import com.hms.services.opdmanagement.repository.OPDDosageRepository;
import com.hms.services.opdmanagement.repository.OPDMedicationRepository;
import com.hms.services.opdmanagement.response.ApiResponse;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OPDMedicationService {

    private final OPDMedicationRepository medicationRepository;
    private final ModelMapper modelMapper;
    private final OPDDosageRepository dosageRepository;

    @Autowired
    public OPDMedicationService(OPDMedicationRepository medicationRepository,final ModelMapper modelMapper,
                                final OPDDosageRepository dosageRepository) {
        this.medicationRepository = medicationRepository;
        this.modelMapper = modelMapper;
        this.dosageRepository = dosageRepository;
    }

    public ApiResponse saveOrUpdate(MedicationDTO medicationDto) {
        try {
            HMS_TM_OPDMedication medication = modelMapper.map(medicationDto, HMS_TM_OPDMedication.class);
            medication.setActive(true);
            medication.setCreatedAt(LocalDateTime.now());
            medication.setCreatedBy("system");
            HMS_TM_OPDMedication savedMedication = medicationRepository.save(medication);
            if (medicationDto.getDosage() != null && !medicationDto.getDosage().isEmpty()) {
                List<HMS_TM_OPDDosage> dosages = medicationDto.getDosage().stream().map(dosageDto -> {
                    HMS_TM_OPDDosage dosage = modelMapper.map(dosageDto, HMS_TM_OPDDosage.class);
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


    public List<HMS_TM_OPDMedication> getAllActiveMedications() {
        try {
            return medicationRepository.findAllByIsActiveTrue();
        } catch (Exception ex) {
            throw new CustomException("Error fetching active medications: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    // Get medication by ID (active only)
    public HMS_TM_OPDMedication getMedicationById(String medicationId) {
        return medicationRepository.findByMedicationIdAndIsActiveTrue(medicationId)
                .orElseThrow(() -> new CustomException("Medication with ID " + medicationId + " not found or inactive", HttpStatus.NOT_FOUND));
    }

    // Get medications by OPD ID along with associated dosages
    public List<MedicationDTO> getMedicationsByOpdId(String opdId) {
        List<HMS_TM_OPDMedication> medications = medicationRepository.findByOpdIdAndIsActiveTrue(opdId);
        List<MedicationDTO> medicationDTOList = medications.stream().map(medication -> {
            MedicationDTO medicationDTO = modelMapper.map(medication, MedicationDTO.class);
            List<HMS_TM_OPDDosage> dosages = dosageRepository.findByMedicationIdAndIsActiveTrue(medication.getMedicationId());
            List<DosageDTO> dosageDTOList = dosages.stream().map(dosage -> modelMapper.map(dosage, DosageDTO.class)).collect(Collectors.toList());
            medicationDTO.setDosage(dosageDTOList);
            return medicationDTO;
        }).collect(Collectors.toList());
        return medicationDTOList;
    }


    // Soft delete medication by ID
    public void softDeleteMedication(String medicationId) {
        HMS_TM_OPDMedication medication = medicationRepository.findByMedicationIdAndIsActiveTrue(medicationId)
                .orElseThrow(() -> new CustomException("Medication with ID " + medicationId + " not found", HttpStatus.NOT_FOUND));
        medication.setActive(false);
        medicationRepository.save(medication);
    }

    public ApiResponse addDosageToMedication(String medicationId, DosageDTO dosageDto) {
        try {
            HMS_TM_OPDMedication medication = medicationRepository.findByMedicationIdAndIsActiveTrue(medicationId)
                    .orElseThrow(() -> new CustomException("Medication not found", HttpStatus.NOT_FOUND));
            HMS_TM_OPDDosage dosage = modelMapper.map(dosageDto, HMS_TM_OPDDosage.class);
            dosage.setMedicationId(medication.getMedicationId());
            dosage.setCreatedBy("system");
            dosageRepository.save(dosage);
            return new ApiResponse("success", "", "Dosage added successfully", null, null, null, null, null);
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public ApiResponse updateMedicationAndDosage(MedicationDTO medicationDto, String medicationId, String dosageId) {
        try {
            HMS_TM_OPDMedication medication = medicationRepository.findByMedicationIdAndIsActiveTrue(medicationId)
                    .orElseThrow(() -> new CustomException("Medication not found for ID: " + medicationId, HttpStatus.NOT_FOUND));
            medication.setMedicineId(medicationDto.getMedicineId());
            medication.setMedicineName(medicationDto.getMedicineName());
            medication.setOpdId(medicationDto.getOpdId());
            medication.setMedicineCategory(medicationDto.getMedicineCategory());
            medication.setActive(true);
            HMS_TM_OPDMedication updatedMedication = medicationRepository.save(medication);
            if (medicationDto.getDosage() != null && !medicationDto.getDosage().isEmpty()) {
                List<HMS_TM_OPDDosage> updatedDosages = new ArrayList<>();
                for (DosageDTO dosageDto : medicationDto.getDosage()) {
                    HMS_TM_OPDDosage dosage = dosageRepository.findByDosageIdAndIsActiveTrue(dosageId)
                            .orElseThrow(() -> new CustomException("Dosage not found for ID: " + dosageId, HttpStatus.NOT_FOUND));
                    dosage.setRemarks(dosageDto.getRemarks());
                    dosage.setDosage(dosageDto.getDosage());
                    dosage.setCreatedBy(dosageDto.getCreatedBy());
                    dosage.setDosageDate(dosageDto.getDosageDate());
                    dosage.setDosageTime(dosageDto.getDosageTime());
                    dosage.setActive(true);
                    HMS_TM_OPDDosage updatedDosage = dosageRepository.save(dosage);
                    updatedDosages.add(updatedDosage);
                }
            }
            return new ApiResponse("success", "", "Medication and Dosage updated successfully", null, null, null, null, null);
        } catch (Exception ex) {
            throw new CustomException("Error updating medication and dosage: " + ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    public void softDeleteDosage(String dosageId) {
        HMS_TM_OPDDosage dosage = dosageRepository.findByDosageIdAndIsActiveTrue(dosageId)
                .orElseThrow(() -> new CustomException("Dosage with ID " + dosageId + " not found", HttpStatus.NOT_FOUND));
        dosage.setActive(false);
        dosageRepository.save(dosage);

    }



}

