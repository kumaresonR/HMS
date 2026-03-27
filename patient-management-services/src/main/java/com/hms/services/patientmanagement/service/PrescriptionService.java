package com.hms.services.patientmanagement.service;

import com.hms.services.patientmanagement.entity.HMS_TM_PrescriptionDetails;
import com.hms.services.patientmanagement.entity.HMS_TM_Prescriptions;
import com.hms.services.patientmanagement.exception.CustomException;
import com.hms.services.patientmanagement.model.PrescriptionDTO;
import com.hms.services.patientmanagement.model.PrescriptionDetailsDTO;
import com.hms.services.patientmanagement.repository.PrescriptionDetailsRepository;
import com.hms.services.patientmanagement.repository.PrescriptionsRepository;
import com.hms.services.patientmanagement.response.ApiResponse;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PrescriptionService {

    private final ModelMapper modelMapper;
    private final EntityManager entityManager;
    private final PrescriptionsRepository prescriptionsRepository;
    private final PrescriptionDetailsRepository prescriptionsDetailsRepository;


    @Autowired
    public PrescriptionService(final ModelMapper modelMapper, final EntityManager entityManager,
                               final PrescriptionsRepository prescriptionsRepository,
                               final PrescriptionDetailsRepository prescriptionsDetailsRepository) {
        this.modelMapper = modelMapper;
        this.entityManager = entityManager;
        this.prescriptionsRepository = prescriptionsRepository;
        this.prescriptionsDetailsRepository = prescriptionsDetailsRepository;
    }

    @Transactional
    public ApiResponse createPrescription(@Valid PrescriptionDTO prescription) {
        try {
            HMS_TM_Prescriptions prescriptionEntity = modelMapper.map(prescription, HMS_TM_Prescriptions.class);
            prescriptionEntity.setCreatedAt(LocalDateTime.now());
            prescriptionEntity.setCreatedBy("vijay");
            prescriptionEntity.setIsActive(true);
            prescriptionEntity.setTime(LocalTime.now());
            HMS_TM_Prescriptions savedPrescription = prescriptionsRepository.save(prescriptionEntity);
            List<HMS_TM_PrescriptionDetails> detailsEntities = prescription.getPrescriptionDetails()
                    .stream()
                    .map(detailDTO -> {
                        detailDTO.setIsActive(true);
                        HMS_TM_PrescriptionDetails detailsEntity = modelMapper.map(detailDTO, HMS_TM_PrescriptionDetails.class);
                        detailsEntity.setPrescriptionId(savedPrescription.getPrescriptionId());
                        return detailsEntity;
                    }).collect(Collectors.toList());
            prescriptionsDetailsRepository.saveAll(detailsEntities);
            return new ApiResponse("success", "", "Record Saved Successfully", null, null, null, savedPrescription.getPrescriptionId());
//            PrescriptionDTO savedPrescriptionDTO = modelMapper.map(savedPrescription, PrescriptionDTO.class);
//            savedPrescriptionDTO.setPrescriptionDetails(prescription.getPrescriptionDetails());
//            return savedPrescriptionDTO;
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @Transactional
    public ApiResponse deletePrescriptionById(String id) {
        Optional<HMS_TM_Prescriptions> patientOptional = prescriptionsRepository.findByPrescriptionIdAndIsActiveTrue(id);
        if (patientOptional.isEmpty()) {
            throw new CustomException("PrescriptionId " + id + "not found", HttpStatus.BAD_REQUEST);
        }

        List<HMS_TM_PrescriptionDetails> prescriptionDetails = prescriptionsDetailsRepository.findAllByPrescriptionIdAndIsActiveTrue(id);
        if (prescriptionDetails.isEmpty()) {
            throw new CustomException("PrescriptionId " + id + " not found", HttpStatus.BAD_REQUEST);
        }
        for (HMS_TM_PrescriptionDetails details : prescriptionDetails) {
            details.setActive(false);
        }
        patientOptional.get().setIsActive(false);
        prescriptionsRepository.save(patientOptional.get());
        prescriptionsDetailsRepository.saveAll(prescriptionDetails);
//        prescriptionsRepository.deleteByPrescriptionId(id);
//        prescriptionsDetailsRepository.deleteByPrescriptionId(id);
        return new ApiResponse("success", "", "Record Deleted Successfully", null, null, null, id);

    }


    public List<PrescriptionDTO> getAllPrescriptions(Integer page, Integer size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<HMS_TM_Prescriptions> prescriptionsPage = prescriptionsRepository.findByIsActiveTrue(pageable);
            if (prescriptionsPage.hasContent()) {
                return prescriptionsPage.getContent()
                        .stream()
                        .map(prescription -> {
                            PrescriptionDTO prescriptionDTO = modelMapper.map(prescription, PrescriptionDTO.class);
                            List<HMS_TM_PrescriptionDetails> detailsEntities = prescriptionsDetailsRepository
                                    .findAllByPrescriptionIdAndIsActiveTrue(prescription.getPrescriptionId());
                            List<PrescriptionDetailsDTO> detailsDTOs = detailsEntities
                                    .stream()
                                    .map(detail -> modelMapper.map(detail, PrescriptionDetailsDTO.class))
                                    .collect(Collectors.toList());
                            prescriptionDTO.setPrescriptionDetails(detailsDTOs);
                            return prescriptionDTO;
                        })
                        .collect(Collectors.toList());
            } else {
                return Collections.emptyList();
            }
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    public List<PrescriptionDTO> filterPrescription(String patientId, String datePrescribed, String doctorId, int page, int size) {
        try {
            CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
            CriteriaQuery<HMS_TM_Prescriptions> criteriaQuery = criteriaBuilder.createQuery(HMS_TM_Prescriptions.class);
            Root<HMS_TM_Prescriptions> root = criteriaQuery.from(HMS_TM_Prescriptions.class);
            Predicate predicate = criteriaBuilder.conjunction();
            if (patientId != null && !patientId.isEmpty()) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("patientId"), patientId));
            }
            if (datePrescribed != null && !datePrescribed.isEmpty()) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("datePrescribed"), datePrescribed));
            }
            if (doctorId != null && !doctorId.isEmpty()) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("doctorId"), doctorId));
            }
            criteriaQuery.where(predicate);
            TypedQuery<HMS_TM_Prescriptions> query = entityManager.createQuery(criteriaQuery);
            query.setFirstResult(page * size);
            query.setMaxResults(size);
            List<HMS_TM_Prescriptions> prescriptions = query.getResultList();
            return prescriptions.stream()
                    .map(prescription -> {
                        PrescriptionDTO prescriptionDTO = modelMapper.map(prescription, PrescriptionDTO.class);
                        List<HMS_TM_PrescriptionDetails> detailsEntities = prescriptionsDetailsRepository
                                .findAllByPrescriptionIdAndIsActiveTrue(prescription.getPrescriptionId());
                        List<PrescriptionDetailsDTO> detailsDTOs = detailsEntities
                                .stream()
                                .map(detail -> modelMapper.map(detail, PrescriptionDetailsDTO.class))
                                .collect(Collectors.toList());
                        prescriptionDTO.setPrescriptionDetails(detailsDTOs);
                        return prescriptionDTO;
                    })
                    .collect(Collectors.toList());
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    public PrescriptionDTO updatePrescription(String id, @Valid PrescriptionDTO prescription) {
        try {
            HMS_TM_Prescriptions existingPrescription = prescriptionsRepository.findByPrescriptionIdAndIsActiveTrue(id)
                    .orElseThrow(() -> new CustomException("Prescription Not Found", HttpStatus.NOT_FOUND));
            existingPrescription.setPatientId(prescription.getPatientId());
            existingPrescription.setDoctorId(prescription.getDoctorId());
            existingPrescription.setDatePrescribed(prescription.getDatePrescribed());
            existingPrescription.setValidUntil(prescription.getValidUntil());
            existingPrescription.setLastModifiedAt(LocalDateTime.now());
            existingPrescription.setLastModifiedBy("vijay");
            List<PrescriptionDetailsDTO> updatedDetailsDTOs = prescription.getPrescriptionDetails();
            List<HMS_TM_PrescriptionDetails> updatedDetailsEntities = new ArrayList<>();
            for (PrescriptionDetailsDTO detailsDTO : updatedDetailsDTOs) {
                HMS_TM_PrescriptionDetails detailsEntity = prescriptionsDetailsRepository
                        .findByprescriptionDetailIdAndIsActiveTrue(detailsDTO.getPrescriptionDetailId())
                        .orElseThrow(() -> new CustomException("Prescription Detail Not Found", HttpStatus.NOT_FOUND));
                detailsEntity.setMedicineId(detailsDTO.getMedicineId());
                detailsEntity.setDosage(detailsDTO.getDosage());
                detailsEntity.setRoute(detailsDTO.getRoute());
                detailsEntity.setUom(detailsDTO.getUom());
                detailsEntity.setFrequency(detailsDTO.getFrequency());
                detailsEntity.setDuration(detailsDTO.getDuration());
                detailsEntity.setIntake(detailsDTO.getIntake());
                updatedDetailsEntities.add(detailsEntity);
            }
            prescriptionsRepository.save(existingPrescription);
            prescriptionsDetailsRepository.saveAll(updatedDetailsEntities);
            PrescriptionDTO updatedPrescriptionDTO = modelMapper.map(existingPrescription, PrescriptionDTO.class);
            updatedPrescriptionDTO.setPrescriptionDetails(updatedDetailsDTOs);
            return updatedPrescriptionDTO;
        }catch(Exception ex){
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }



}
