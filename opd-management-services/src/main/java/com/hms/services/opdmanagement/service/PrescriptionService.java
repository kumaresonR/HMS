package com.hms.services.opdmanagement.service;


import com.hms.services.opdmanagement.configuration.AdminManagementInterface;
import com.hms.services.opdmanagement.configuration.IpdManagementInterface;
import com.hms.services.opdmanagement.configuration.LabManagementInterface;
import com.hms.services.opdmanagement.entity.HMS_TM_OPDPrescriptionDetails;
import com.hms.services.opdmanagement.entity.HMS_TM_OPDPrescriptions;
import com.hms.services.opdmanagement.exception.CustomException;
import com.hms.services.opdmanagement.model.*;
import com.hms.services.opdmanagement.repository.PrescriptionDetailsRepository;
import com.hms.services.opdmanagement.repository.PrescriptionRepository;
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
    private final IpdManagementInterface ipdManagementInterface;
    private final LabManagementInterface labManagementInterface;

    @Autowired
    public PrescriptionService(PrescriptionRepository prescriptionRepository,
                               PrescriptionDetailsRepository prescriptionDetailsRepository,
                               ModelMapper modelMapper,AdminManagementInterface adminManagementInterface,
                               IpdManagementInterface ipdManagementInterface,LabManagementInterface labManagementInterface) {
        this.prescriptionRepository = prescriptionRepository;
        this.prescriptionDetailsRepository = prescriptionDetailsRepository;
        this.modelMapper = modelMapper;
        this.adminManagementInterface = adminManagementInterface;
        this.ipdManagementInterface = ipdManagementInterface;
        this.labManagementInterface = labManagementInterface;
    }

    @Transactional
    // Create a prescription
    public JSONObject createPrescription(OPDPrescriptionsDTO prescriptionDTO, MultipartFile file) {
        try{
        HMS_TM_OPDPrescriptions prescription = modelMapper.map(prescriptionDTO, HMS_TM_OPDPrescriptions.class);
        prescription.setCreatedAt(LocalDateTime.now());
        prescription.setIsActive(true);
        if(file != null && !file.isEmpty()) {
            String encodedAttachment = Base64.getEncoder().encodeToString(file.getBytes());
            prescription.setAttachment(encodedAttachment);
        }
            String prescriptionNo = generatePrescriptionNo();
            prescription.setPrescriptionNo(prescriptionNo);
            HMS_TM_OPDPrescriptions savedPrescription = prescriptionRepository.save(prescription);
        // Save Prescription Details
        List<HMS_TM_OPDPrescriptionDetails> details = prescriptionDTO.getPrescriptionDetails()
                .stream()
                .map(detailDTO -> {
                    HMS_TM_OPDPrescriptionDetails detail = modelMapper.map(detailDTO, HMS_TM_OPDPrescriptionDetails.class);
                    detail.setPrescriptionId(savedPrescription.getPrescriptionId());
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
        Optional<HMS_TM_OPDPrescriptions> lastPatient = prescriptionRepository.findTopByOrderByCreatedAtDesc();
        long nextSequenceNumber = lastPatient.map(p -> extractSequenceNumber(p.getPrescriptionNo()) + 1).orElse(1L);
        String formattedSequence = String.format("%05d", nextSequenceNumber);
        return "OPDP" +formattedSequence;
    }

    private Long extractSequenceNumber(String patientId) {
        String numericPart = patientId.substring(4);
        return Long.parseLong(numericPart);
    }


    // Get all prescriptions
    public List<OPDPrescriptionsDTO> getAllPrescriptions() {
        try{
        List<HMS_TM_OPDPrescriptions> prescriptions = prescriptionRepository.findAllByIsActiveTrue();
        return prescriptions.stream()
                .map(prescription -> {
                    OPDPrescriptionsDTO prescriptionDTO = modelMapper.map(prescription, OPDPrescriptionsDTO.class);
                    List<HMS_TM_OPDPrescriptionDetails> details = prescriptionDetailsRepository.findByPrescriptionId(prescription.getPrescriptionId());
                    prescriptionDTO.setPrescriptionDetails(details.stream()
                            .map(detail -> modelMapper.map(detail, OPDPrescriptionDetailsDTO.class))
                            .collect(Collectors.toList()));
                    return prescriptionDTO;
                })
                .collect(Collectors.toList());
    } catch (Exception ex) {
        throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
    }

    // Get prescription by ID
    public OPDPrescriptionsDTO getPrescriptionById(String id) {
        try{
        HMS_TM_OPDPrescriptions prescription = prescriptionRepository.findByPrescriptionIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found"));

            EmployeeDetails doctorInfo =adminManagementInterface.getEmployeeById(prescription.getDoctorId()).getBody();
            List<PathologyTestDetailsDTO> pathology =labManagementInterface.getPathologyTestsByIds(prescription.getPathologyId(),prescription.getPrescriptionNo()).getBody();
            List<RadiologyTestDetailsDTO> radiology =labManagementInterface.getRadiologyTestsByIds(prescription.getRadiologyId(),prescription.getPrescriptionNo()).getBody();
            OPDPrescriptionsDTO prescriptionDTO = modelMapper.map(prescription, OPDPrescriptionsDTO.class);
            prescriptionDTO.setDoctor(doctorInfo);
            prescriptionDTO.setPathologyTestDetails(pathology);
            prescriptionDTO.setRadiologyTestDetails(radiology);
        List<HMS_TM_OPDPrescriptionDetails> details = prescriptionDetailsRepository.findByPrescriptionId(prescription.getPrescriptionId());
        prescriptionDTO.setPrescriptionDetails(details.stream()
                .map(detail -> modelMapper.map(detail, OPDPrescriptionDetailsDTO.class))
                .collect(Collectors.toList()));
        return prescriptionDTO;
    } catch (Exception ex) {
        throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
    }

    @Transactional
    // Update a prescription
    public JSONObject updatePrescription(String id, OPDPrescriptionsDTO prescriptionDTO,MultipartFile file) {
        try{
        HMS_TM_OPDPrescriptions prescription = prescriptionRepository.findByPrescriptionIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found"));
            if(file != null && !file.isEmpty()) {
                String encodedAttachment = Base64.getEncoder().encodeToString(file.getBytes());
                prescription.setAttachment(encodedAttachment);
            }
            modelMapper.map(prescriptionDTO, prescription);
            prescription.setPrescriptionId(id);
            prescription.setIsActive(true);
            prescription.setLastModifiedAt(LocalDateTime.now());
            if (prescriptionDTO.getPathologyId() != null) {
                prescription.setPathologyId(new ArrayList<>(prescriptionDTO.getPathologyId()));
            }
            if (prescriptionDTO.getRadiologyId() != null) {
                prescription.setRadiologyId(new ArrayList<>(prescriptionDTO.getRadiologyId()));
            }
            HMS_TM_OPDPrescriptions updatedPrescription = prescriptionRepository.save(prescription);

            if (prescriptionDTO.getPrescriptionDetails() != null) {
                prescriptionDetailsRepository.deleteByPrescriptionIdAndIsActiveTrue(id);
                List<HMS_TM_OPDPrescriptionDetails> details = prescriptionDTO.getPrescriptionDetails()
                        .stream()
                        .map(detailDTO -> {
                            HMS_TM_OPDPrescriptionDetails detail = modelMapper.map(detailDTO, HMS_TM_OPDPrescriptionDetails.class);
                            detail.setPrescriptionId(updatedPrescription.getPrescriptionId());
                            detail.setActive(true);
                            return detail;
                        })
                        .collect(Collectors.toList());
                prescriptionDetailsRepository.saveAll(details);
            }
        JSONObject response = new JSONObject();
        response.put("Message", "Prescription updated successfully");
        //response.put("PrescriptionID", prescription.getPrescriptionId());
        return response;
    } catch (Exception ex) {
        throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }}

    // Delete a prescription
    public JSONObject deletePrescription(String id) {
        HMS_TM_OPDPrescriptions prescription = prescriptionRepository.findByPrescriptionIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found"));
        prescription.setIsActive(false);
        prescriptionRepository.save(prescription);
        JSONObject response = new JSONObject();
        response.put("Message", "Prescription deleted successfully");
        return response;
    }

    public List<OPDPrescriptionsDTO> getPrescriptionByIpdId(String id) {
        try {
            List<HMS_TM_OPDPrescriptions> prescriptions = prescriptionRepository.findByOpdIdAndIsActiveTrue(id);
            return prescriptions.stream()
                    .map(prescription -> {
                        OPDPrescriptionsDTO prescriptionDTO = modelMapper.map(prescription, OPDPrescriptionsDTO.class);
                        List<HMS_TM_OPDPrescriptionDetails> details = prescriptionDetailsRepository.findByPrescriptionId(prescription.getPrescriptionId());
                        prescriptionDTO.setPrescriptionDetails(details.stream()
                                .map(detail -> modelMapper.map(detail, OPDPrescriptionDetailsDTO.class))
                                .collect(Collectors.toList()));

                        return prescriptionDTO;
                    })
                    .collect(Collectors.toList());
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public List<OPDPrescriptionsDTO> getPrescriptionByNumberId(String number) {
        try {
            List<HMS_TM_OPDPrescriptions> prescriptions = prescriptionRepository.findByPrescriptionNoAndIsActiveTrue(number);
            return prescriptions.stream()
                    .map(prescription -> {
                        OPDPrescriptionsDTO prescriptionDTO = modelMapper.map(prescription, OPDPrescriptionsDTO.class);
                        EmployeeDetails doctorInfo =adminManagementInterface.getEmployeeById(prescription.getDoctorId()).getBody();
                        prescriptionDTO.setDoctor(doctorInfo);
                        List<HMS_TM_OPDPrescriptionDetails> details = prescriptionDetailsRepository.findByPrescriptionId(prescription.getPrescriptionId());
                        prescriptionDTO.setPrescriptionDetails(details.stream()
                                .map(detail -> modelMapper.map(detail, OPDPrescriptionDetailsDTO.class))
                                .collect(Collectors.toList()));

                        return prescriptionDTO;
                    })
                    .collect(Collectors.toList());
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public void addPrescriptionByPayment(String number, Boolean pharmacyPaid,Boolean pathologyPaid, Boolean radiologyPaid ) {
        List<HMS_TM_OPDPrescriptions> prescriptions = prescriptionRepository.findByPrescriptionNoAndIsActiveTrue(number);
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
