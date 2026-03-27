package com.hms.services.ipdmanagement.service;

import com.hms.services.ipdmanagement.configuration.AdminManagementInterface;
import com.hms.services.ipdmanagement.configuration.LabManagementInterface;
import com.hms.services.ipdmanagement.entity.HMS_TM_PrescriptionDetails;
import com.hms.services.ipdmanagement.entity.HMS_TM_Prescriptions;
import com.hms.services.ipdmanagement.exception.CustomException;
import com.hms.services.ipdmanagement.model.*;
import com.hms.services.ipdmanagement.repository.PrescriptionDetailsRepository;
import com.hms.services.ipdmanagement.repository.PrescriptionRepository;
import org.json.simple.JSONObject;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final PrescriptionDetailsRepository prescriptionDetailsRepository;
    private final ModelMapper modelMapper;
    private final AdminManagementInterface adminManagementInterface;
    private final LabManagementInterface labManagementInterface;

    @Autowired
    public PrescriptionService(PrescriptionRepository prescriptionRepository,
                               PrescriptionDetailsRepository prescriptionDetailsRepository,
                               ModelMapper modelMapper, AdminManagementInterface adminManagementInterface,
                LabManagementInterface labManagementInterface) {
        this.prescriptionRepository = prescriptionRepository;
        this.prescriptionDetailsRepository = prescriptionDetailsRepository;
        this.modelMapper = modelMapper;
        this.adminManagementInterface = adminManagementInterface;
        this.labManagementInterface = labManagementInterface;
    }

    @Transactional
    // Create a prescription
    public JSONObject createPrescription(PrescriptionDTO prescriptionDTO, MultipartFile file) {
        try{
        HMS_TM_Prescriptions prescription = modelMapper.map(prescriptionDTO, HMS_TM_Prescriptions.class);
        prescription.setCreatedAt(LocalDateTime.now());
        prescription.setIsActive(true);
        if(file != null && !file.isEmpty()) {
            String encodedAttachment = Base64.getEncoder().encodeToString(file.getBytes());
            prescription.setAttachment(encodedAttachment);
        }
            String prescriptionNo = generatePrescriptionNo();
            prescription.setPrescriptionNo(prescriptionNo);
        HMS_TM_Prescriptions savedPrescription = prescriptionRepository.save(prescription);
        // Save Prescription Details
        List<HMS_TM_PrescriptionDetails> details = prescriptionDTO.getPrescriptionDetails()
                .stream()
                .map(detailDTO -> {
                    HMS_TM_PrescriptionDetails detail = modelMapper.map(detailDTO, HMS_TM_PrescriptionDetails.class);
                    detail.setPrescriptionId(savedPrescription.getPrescriptionId());
                    detail.setActive(true);
                    return detail;
                })
                .collect(Collectors.toList());
        prescriptionDetailsRepository.saveAll(details);
        JSONObject response = new JSONObject();
        response.put("Message", "Prescription created successfully");
        response.put("PrescriptionID", savedPrescription.getPrescriptionId());
        return response;
    } catch (Exception ex) {
        throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }}


    private String generatePrescriptionNo() {
        Optional<HMS_TM_Prescriptions> lastPatient = prescriptionRepository.findTopByOrderByCreatedAtDesc();
        long nextSequenceNumber = lastPatient.map(p -> extractSequenceNumber(p.getPrescriptionNo()) + 1).orElse(1L);
        String formattedSequence = String.format("%05d", nextSequenceNumber);
        return "IPDP" +formattedSequence;
    }

    private Long extractSequenceNumber(String patientId) {
        String numericPart = patientId.substring(4);
        return Long.parseLong(numericPart);
    }



    // Get all prescriptions
    public List<PrescriptionDTO> getAllPrescriptions() {
        try{
        List<HMS_TM_Prescriptions> prescriptions = prescriptionRepository.findAllByIsActiveTrue();
        return prescriptions.stream()
                .map(prescription -> {
                    PrescriptionDTO prescriptionDTO = modelMapper.map(prescription, PrescriptionDTO.class);
                    List<HMS_TM_PrescriptionDetails> details = prescriptionDetailsRepository.findByPrescriptionId(prescription.getPrescriptionId());
                    prescriptionDTO.setPrescriptionDetails(details.stream()
                            .map(detail -> modelMapper.map(detail, PrescriptionDetailsDTO.class))
                            .collect(Collectors.toList()));
                    return prescriptionDTO;
                })
                .collect(Collectors.toList());
    } catch (Exception ex) {
        throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
    }

    // Get prescription by ID
    public PrescriptionDTO getPrescriptionById(String id) {
        try{
        HMS_TM_Prescriptions prescription = prescriptionRepository.findByPrescriptionIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found"));
            EmployeeDetails doctorInfo =adminManagementInterface.getEmployeeById(prescription.getDoctorId()).getBody();
            List<PathologyTestDetailsDTO> pathology =labManagementInterface.getPathologyTestsByIds(prescription.getPathologyId(),prescription.getPrescriptionNo()).getBody();
            List<RadiologyTestDetailsDTO> radiology =labManagementInterface.getRadiologyTestsByIds(prescription.getRadiologyId(),prescription.getPrescriptionNo()).getBody();
            PrescriptionDTO prescriptionDTO = modelMapper.map(prescription, PrescriptionDTO.class);
            prescriptionDTO.setDoctor(doctorInfo);
            prescriptionDTO.setPathologyTestDetails(pathology);
            prescriptionDTO.setRadiologyTestDetails(radiology);
        List<HMS_TM_PrescriptionDetails> details = prescriptionDetailsRepository.findByPrescriptionId(prescription.getPrescriptionId());
        prescriptionDTO.setPrescriptionDetails(details.stream()
                .map(detail -> modelMapper.map(detail, PrescriptionDetailsDTO.class))
                .collect(Collectors.toList()));
        return prescriptionDTO;
    } catch (Exception ex) {
        throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
    }

    // Update a prescription
    @Transactional
    public JSONObject updatePrescription(String id, PrescriptionDTO prescriptionDTO,MultipartFile file ) {
        try{
            HMS_TM_Prescriptions existingPrescription = prescriptionRepository.findByPrescriptionIdAndIsActiveTrue(id)
                    .orElseThrow(() -> new RuntimeException("Prescription not found"));
            if(file != null && !file.isEmpty()) {
                String encodedAttachment = Base64.getEncoder().encodeToString(file.getBytes());
                existingPrescription.setAttachment(encodedAttachment);
            }
            modelMapper.map(prescriptionDTO, existingPrescription);
            existingPrescription.setPrescriptionId(id);
            existingPrescription.setIsActive(true);
            existingPrescription.setLastModifiedAt(LocalDateTime.now());
            if (prescriptionDTO.getPathologyId() != null) {
                existingPrescription.setPathologyId(new ArrayList<>(prescriptionDTO.getPathologyId()));
            }
            if (prescriptionDTO.getRadiologyId() != null) {
                existingPrescription.setRadiologyId(new ArrayList<>(prescriptionDTO.getRadiologyId()));
            }
            HMS_TM_Prescriptions updatedPrescription = prescriptionRepository.save(existingPrescription);

            if (prescriptionDTO.getPrescriptionDetails() != null) {
                prescriptionDetailsRepository.deleteByPrescriptionIdAndIsActiveTrue(id);
                List<HMS_TM_PrescriptionDetails> details = prescriptionDTO.getPrescriptionDetails()
                        .stream()
                        .map(detailDTO -> {
                            HMS_TM_PrescriptionDetails detail = modelMapper.map(detailDTO, HMS_TM_PrescriptionDetails.class);
                            detail.setPrescriptionId(updatedPrescription.getPrescriptionId());
                            detail.setActive(true);
                            return detail;
                        })
                        .collect(Collectors.toList());
                prescriptionDetailsRepository.saveAll(details);
            }
        JSONObject response = new JSONObject();
        response.put("Message", "Prescription updated successfully");
        //response.put("PrescriptionID", updatedPrescription.getPrescriptionId());
        return response;
    } catch (Exception ex) {
        throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
    }

    // Delete a prescription
    public JSONObject deletePrescription(String id) {
        HMS_TM_Prescriptions prescription = prescriptionRepository.findByPrescriptionIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found"));
        prescription.setIsActive(false);
        prescriptionRepository.save(prescription);
        JSONObject response = new JSONObject();
        response.put("Message", "Prescription deleted successfully");
        return response;
    }

    public List<PrescriptionDTO> getPrescriptionByIpdId(String id) {
        try {
            List<HMS_TM_Prescriptions> prescriptions = prescriptionRepository.findByIpdIdAndIsActiveTrue(id);
            return prescriptions.stream()
                    .map(prescription -> {
                        PrescriptionDTO prescriptionDTO = modelMapper.map(prescription, PrescriptionDTO.class);
                        List<HMS_TM_PrescriptionDetails> details = prescriptionDetailsRepository.findByPrescriptionId(prescription.getPrescriptionId());
                        prescriptionDTO.setPrescriptionDetails(details.stream()
                                .map(detail -> modelMapper.map(detail, PrescriptionDetailsDTO.class))
                                .collect(Collectors.toList()));

                        return prescriptionDTO;
                    })
                    .collect(Collectors.toList());
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public List<PrescriptionDTO> getPrescriptionByNumberId(String number) {
        try {
            List<HMS_TM_Prescriptions> prescriptions = prescriptionRepository.findByPrescriptionNoAndIsActiveTrue(number);
            return prescriptions.stream()
                    .map(prescription -> {
                        PrescriptionDTO prescriptionDTO = modelMapper.map(prescription, PrescriptionDTO.class);
                        EmployeeDetails doctorInfo =adminManagementInterface.getEmployeeById(prescription.getDoctorId()).getBody();
                        prescriptionDTO.setDoctor(doctorInfo);
                        List<HMS_TM_PrescriptionDetails> details = prescriptionDetailsRepository.findByPrescriptionId(prescription.getPrescriptionId());
                        prescriptionDTO.setPrescriptionDetails(details.stream()
                                .map(detail -> modelMapper.map(detail, PrescriptionDetailsDTO.class))
                                .collect(Collectors.toList()));

                        return prescriptionDTO;
                    })
                    .collect(Collectors.toList());
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    public void addPrescriptionByPayment(String number, Boolean pharmacyPaid,Boolean pathologyPaid, Boolean radiologyPaid ) {
        List<HMS_TM_Prescriptions> prescriptions = prescriptionRepository.findByPrescriptionNoAndIsActiveTrue(number);
        if(pharmacyPaid!=null) {
            prescriptions.get(0).setPharmacyPaid(pharmacyPaid);
        }else if(pathologyPaid!=null) {
            prescriptions.get(0).setPathologyPaid(pathologyPaid);
        }else if(radiologyPaid!=null) {
            prescriptions.get(0).setRadiologyPaid(radiologyPaid);
        }
        prescriptionRepository.save(prescriptions.get(0));
    }

}
