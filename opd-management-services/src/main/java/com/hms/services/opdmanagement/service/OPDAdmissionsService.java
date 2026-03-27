package com.hms.services.opdmanagement.service;

import com.hms.services.opdmanagement.configuration.*;
import com.hms.services.opdmanagement.entity.HMS_TM_OPDAdmissions;
import com.hms.services.opdmanagement.entity.HMS_TM_OPDDosage;
import com.hms.services.opdmanagement.entity.HMS_TM_OPDMedication;
import com.hms.services.opdmanagement.exception.CustomException;
import com.hms.services.opdmanagement.model.*;
import com.hms.services.opdmanagement.repository.*;
import com.hms.services.opdmanagement.response.ApiResponse;
import org.json.simple.JSONObject;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OPDAdmissionsService {

    private final OPDAdmissionsRepository opdAdmissionsRepository;
    private final ModelMapper modelMapper;
    private final OPDMedicationRepository opdMedicationRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final PrescriptionDetailsRepository prescriptionDetailsRepository;
    private final OPDChargesRepository opdChargesRepository;
    private final OPDPaymentsRepository opdPaymentsRepository;
    private final VitalsRepository vitalsRepository;
    private final TimeLineRepository timeLineRepository;
    private final OPDOperationRepository opdOperationRepository;
    private final OPDDosageRepository opdDosageRepository;
    private final ConnectionInterface connectionInterface;
    private final AdminManagementInterface adminManagementInterface;
    private final IpdManagementInterface ipdManagementInterface;
    private final LabManagementInterface labManagementInterface;
    //    private final IPDChargesCategoryRepository categoryRepository;
//    private final IPDChargesNameRepository chargesNameRepository;
    private final TpaInterface tpaInterface;
    private static final Logger logger = LoggerFactory.getLogger(OPDAdmissionsService.class);


    @Autowired
    public OPDAdmissionsService(final OPDAdmissionsRepository opdAdmissionsRepository,
                                final ModelMapper modelMapper,
                                final PrescriptionRepository prescriptionRepository, final PrescriptionDetailsRepository prescriptionDetailsRepository,
                                final OPDChargesRepository opdChargesRepository, final OPDPaymentsRepository opdPaymentsRepository,
                                final VitalsRepository vitalsRepository, final TimeLineRepository timeLineRepository,
                                final OPDMedicationRepository opdMedicationRepository, final OPDOperationRepository opdOperationRepository,
                                final OPDDosageRepository opdDosageRepository, final ConnectionInterface connectionInterface,
                                final AdminManagementInterface adminManagementInterface, final IpdManagementInterface ipdManagementInterface,
                                final LabManagementInterface labManagementInterface, TpaInterface tpaInterface
    ) {
        this.opdAdmissionsRepository = opdAdmissionsRepository;
        this.modelMapper = modelMapper;
        this.prescriptionRepository = prescriptionRepository;
        this.prescriptionDetailsRepository = prescriptionDetailsRepository;
        this.opdChargesRepository = opdChargesRepository;
        this.opdPaymentsRepository = opdPaymentsRepository;
        this.vitalsRepository = vitalsRepository;
        this.timeLineRepository = timeLineRepository;
        this.opdMedicationRepository = opdMedicationRepository;
        this.opdOperationRepository = opdOperationRepository;
        this.opdDosageRepository = opdDosageRepository;
        this.connectionInterface = connectionInterface;
        this.adminManagementInterface = adminManagementInterface;
        this.ipdManagementInterface = ipdManagementInterface;
        this.labManagementInterface = labManagementInterface;
        this.tpaInterface = tpaInterface;
    }

    @Transactional
    public ApiResponse createAdmission(OPDAdmissionsDTO ipdAdmissionsDTO) {

        try {
            if (opdAdmissionsRepository.existsByPatientIdAndIsActiveTrueAndDischargeDateAfter(ipdAdmissionsDTO.getPatientId(), ipdAdmissionsDTO.getAppointmentDate())) {
                throw new CustomException("Patient already has an active OPD admission", HttpStatus.BAD_REQUEST);
            }
            if (ipdManagementInterface.checkPatientAdmission(ipdAdmissionsDTO.getPatientId(), ipdAdmissionsDTO.getAppointmentDate())) {
                throw new CustomException("Patient already has an active IPD admission.Cannot create an OPD admission.", HttpStatus.BAD_REQUEST);
            }
            String ipdId = generateIpdId();
            Long caseId = generateCaseId();
            HMS_TM_OPDAdmissions admission = modelMapper.map(ipdAdmissionsDTO, HMS_TM_OPDAdmissions.class);
            admission.setOpdId(ipdId);
            admission.setCaseId(caseId);
            admission.setActive(true);
            admission.setCreatedAt(LocalDateTime.now());
            admission.setCreatedBy("system");
            HMS_TM_OPDAdmissions savedAdmission = opdAdmissionsRepository.save(admission);
            return new ApiResponse("success", "", "Admission created successfully", null, null, savedAdmission.getAdmissionId(), ipdId, caseId);
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    private String generateIpdId() {
        Optional<HMS_TM_OPDAdmissions> lastRecord = opdAdmissionsRepository.findTopByOrderByCreatedAtDesc();
        long nextSequenceNumber = lastRecord.map(r -> extractSequenceNumber(r.getOpdId()) + 1).orElse(1L);
        String formattedSequence = String.format("%05d", nextSequenceNumber);
        return "OPD" + formattedSequence;
    }

    private Long extractSequenceNumber(String patientId) {
        String numericPart = patientId.substring(3);
        return Long.parseLong(numericPart);
    }

    private Long generateCaseId() {
        Optional<HMS_TM_OPDAdmissions> lastRecord = opdAdmissionsRepository.findTopByOrderByCaseIdDesc();
        return lastRecord.map(r -> r.getCaseId() + 1).orElse(1L);
    }


    public List<OPDAdmissionsDetailsDTO> getAllAdmissions(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Order.desc("createdAt")));
            List<HMS_TM_OPDAdmissions> admissions = opdAdmissionsRepository.findAllByIsActiveTrueAndDischargeDateIsNull(pageRequest).getContent();
            return admissions.stream()
                    .map(admission -> {
                        OPDAdmissionsDetailsDTO opdAdmissionsDTO = modelMapper.map(admission, OPDAdmissionsDetailsDTO.class);
                        List<String> opdIds = opdAdmissionsRepository.findOpdIdsByPatientId(admission.getPatientId());
                        OPDCombinedDTO.PatientDTO patientInfo = connectionInterface.getPatientById(admission.getPatientId())
                                .getBody();
                        if (patientInfo == null) {
                            return null;
                        }
                        EmployeeDetails doctorDetails = adminManagementInterface.getEmployeeById(admission.getDoctorId()).getBody();
                        patientInfo.setLastVisit(admission.getAppointmentDate());
                        patientInfo.setTotalReCheckup(opdIds.size());
                        opdAdmissionsDTO.setPatient(patientInfo);
                        opdAdmissionsDTO.setDoctor(doctorDetails);
                        return opdAdmissionsDTO;
                    })
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public OPDAdmissionsDTO getAdmissionById(String ipdId) {
        HMS_TM_OPDAdmissions admission = opdAdmissionsRepository.findByOpdIdAndIsActiveTrue(ipdId)
                .orElse(null);
        if (admission == null) {
            return null;
        }
        return modelMapper.map(admission, OPDAdmissionsDTO.class);
    }

    public ApiResponse updateAdmissionById(String id, OPDAdmissionsDTO ipdAdmissionsDTO) {
        try {
            HMS_TM_OPDAdmissions existingAdmission = opdAdmissionsRepository.findByAdmissionIdAndIsActiveTrue(id)
                    .orElseThrow(() -> new CustomException("Admission not found", HttpStatus.NOT_FOUND));
//            existingAdmission.setAdmissionDate(ipdAdmissionsDTO.getAdmissionDate());
//           // existingAdmission.setAdmissionTime(ipdAdmissionsDTO.getAdmissionTime());
//            existingAdmission.setRoomId(ipdAdmissionsDTO.getRoomId());
//            existingAdmission.setReasonForAdmission(ipdAdmissionsDTO.getReasonForAdmission());
            existingAdmission.setSymptomsType(ipdAdmissionsDTO.getSymptomsType());
            existingAdmission.setSymptomsDescription(ipdAdmissionsDTO.getSymptomsDescription());
            existingAdmission.setNote(ipdAdmissionsDTO.getNote());
            existingAdmission.setPreviousMedicalIssue(ipdAdmissionsDTO.getPreviousMedicalIssue());
            existingAdmission.setCasualty(ipdAdmissionsDTO.isCasualty());
            existingAdmission.setOldPatient(ipdAdmissionsDTO.isOldPatient());
            existingAdmission.setReference(ipdAdmissionsDTO.getReference());
//            existingAdmission.setStatus(ipdAdmissionsDTO.getStatus());
            existingAdmission.setAntenatal(ipdAdmissionsDTO.isAntenatal());
            existingAdmission.setSymptomsTitle(ipdAdmissionsDTO.getSymptomsTitle());
//            existingAdmission.setDischargeDate(ipdAdmissionsDTO.getDischargeDate());
//           // existingAdmission.setDischargeTime(ipdAdmissionsDTO.getDischargeTime());
//            existingAdmission.setDischargeSummary(ipdAdmissionsDTO.getDischargeSummary());
//            existingAdmission.setCreditLimit(ipdAdmissionsDTO.getCreditLimit());
            existingAdmission.setAnyKnownAllergies(ipdAdmissionsDTO.getAnyKnownAllergies());
            existingAdmission.setLastModifiedAt(LocalDateTime.now());
            existingAdmission.setLastModifiedBy("system");
            opdAdmissionsRepository.save(existingAdmission);
            return new ApiResponse("success", "", "Admission updated successfully", null, null, id, null, null);
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    @Transactional
    public ApiResponse deleteAdmissionById(String id) {
        HMS_TM_OPDAdmissions admission = opdAdmissionsRepository.findByAdmissionIdAndIsActiveTrue(id)
                .orElseThrow(() -> new CustomException("Admission not found", HttpStatus.NOT_FOUND));
        admission.setActive(false);
        opdAdmissionsRepository.save(admission);
        return new ApiResponse("success", "", "Admission Deleted successfully", null, null, id, null, null);
    }

    @Transactional
    public OPDCombinedDTO getAdmissionCombinedById(String opdId) {
        OPDCombinedDTO opdCombinedDTO = new OPDCombinedDTO();

        // Fetch and map admissions
        opdAdmissionsRepository.findByOpdIdAndIsActiveTrue(opdId).ifPresent(admission -> {
            OPDCombinedDTO.OPDAdmissionsDTO admissionsDTO = modelMapper.map(admission, OPDCombinedDTO.OPDAdmissionsDTO.class);
            opdCombinedDTO.setAdmissions(admissionsDTO);
        });
        OPDCombinedDTO.PatientDTO patientInfo = connectionInterface.getPatientById(opdCombinedDTO.getAdmissions().getPatientId()).getBody();
        opdCombinedDTO.setPatient(patientInfo);
        EmployeeDetails doctorDetails = adminManagementInterface.getEmployeeById(opdCombinedDTO.getAdmissions().getDoctorId()).getBody();
        opdCombinedDTO.getAdmissions().setDoctor(doctorDetails);

        opdCombinedDTO.setPrescriptions(
                prescriptionRepository.findByOpdIdAndIsActiveTrue(opdId).stream()
                        .map(prescription -> {
                            // Map the prescription entity to PrescriptionsDTO
                            EmployeeDetails doctorInfo = adminManagementInterface.getEmployeeById(prescription.getDoctorId()).getBody();
                            List<PathologyTestDetailsDTO> pathology = labManagementInterface.getPathologyTestsByIds(prescription.getPathologyId(), prescription.getPrescriptionNo()).getBody();
                            List<RadiologyTestDetailsDTO> radiology = labManagementInterface.getRadiologyTestsByIds(prescription.getRadiologyId(), prescription.getPrescriptionNo()).getBody();
                            OPDCombinedDTO.PrescriptionsDTO prescriptionsDTO = modelMapper.map(prescription, OPDCombinedDTO.PrescriptionsDTO.class);

                            // Fetch and map prescription details based on prescriptionId
                            List<OPDCombinedDTO.PrescriptionDetailsDTO> prescriptionDetails = prescriptionDetailsRepository.findByPrescriptionIdAndIsActiveTrue(prescriptionsDTO.getPrescriptionId()).stream()
                                    .map(detail -> modelMapper.map(detail, OPDCombinedDTO.PrescriptionDetailsDTO.class))
                                    .collect(Collectors.toList());
                            // Set the fetched details into the prescriptionsDTO
                            prescriptionsDTO.setDoctor(doctorInfo);
                            prescriptionsDTO.setPathologyTestDetails(pathology);
                            prescriptionsDTO.setRadiologyTestDetails(radiology);
                            prescriptionsDTO.setPrescriptionDetails(prescriptionDetails);
                            return prescriptionsDTO;
                        })
                        .collect(Collectors.toList())
        );

        List<HMS_TM_OPDMedication> medications = opdMedicationRepository.findByOpdIdAndIsActiveTrue(opdId);
        // Map medications to DTOs and include dosages
        List<OPDCombinedDTO.OPDMedicationDTO> medicationDTOs = medications.stream()
                .map(medication -> {
                    OPDCombinedDTO.OPDMedicationDTO medicationDTO = modelMapper.map(medication, OPDCombinedDTO.OPDMedicationDTO.class);
                    List<HMS_TM_OPDDosage> dosages = opdDosageRepository.findByMedicationIdAndIsActiveTrue(medication.getMedicationId());
                    List<OPDCombinedDTO.DosageDTO> dosageDTOs = dosages.stream()
                            .map(dosage -> modelMapper.map(dosage, OPDCombinedDTO.DosageDTO.class))
                            .collect(Collectors.toList());
                    medicationDTO.setDosage(dosageDTOs);

                    return medicationDTO;
                })
                .collect(Collectors.toList());
        opdCombinedDTO.setMedicationsDetails(medicationDTOs);

        // Fetch and map OPD operations
        // Fetch operations and map them to OPDOperationDTO while enriching with doctor details
        List<OPDCombinedDTO.OPDOperationDTO> opdOperationDetails = opdOperationRepository.findByOpdIdAndIsActiveTrue(opdId)
                .stream()
                .map(operation -> {
                    OPDCombinedDTO.OPDOperationDTO operationDTO = modelMapper.map(operation, OPDCombinedDTO.OPDOperationDTO.class);
                    EmployeeDetails doctorInfo = adminManagementInterface.getEmployeeById(operation.getDoctorId()).getBody();
                    operationDTO.setDoctor(doctorInfo);
                    return operationDTO;
                })
                .collect(Collectors.toList());
        opdCombinedDTO.setOpdOperationDetails(opdOperationDetails);

        // Fetch and map OPD charges
        List<OPDCombinedDTO.OPDChargesDTO> opdCharges = opdChargesRepository.findByOpdIdAndIsActiveTrue(opdId)
                .stream()
                .map(charge -> {
                    OPDCombinedDTO.OPDChargesDTO chargeDTO = modelMapper.map(charge, OPDCombinedDTO.OPDChargesDTO.class);
                    String insuranceId = (patientInfo != null && patientInfo.getInsuranceProviders() != null) ? patientInfo.getInsuranceProviders().getInsuranceId() : null;
                    OPDCombinedDTO.CombinedCharges chargesType = adminManagementInterface.getAllByChargeId(charge.getChargeNameId(), insuranceId).getBody();
                    chargeDTO.setCombinedCharges(chargesType);
                    return chargeDTO;
                })
                .collect(Collectors.toList());
        opdCombinedDTO.setOpdCharges(opdCharges);


        // Fetch and map OPD charges
//        List<OPDCombinedDTO.OPDChargesDTO> opdCharges = opdChargesRepository.findByOpdIdAndIsActiveTrue(opdId)
//                .stream()
//                .map(charge -> {
//                    // Map the charge entity to OPDChargesDTO
//                    OPDCombinedDTO.OPDChargesDTO chargeDTO = modelMapper.map(charge, OPDCombinedDTO.OPDChargesDTO.class);
//                    // Enrich with additional details
//                    OPDCombinedDTO.OPDChargesTypeDTO chargesType=ipdManagementInterface.getChargeTypeById(charge.getChargeTypeId()).getBody();
//                    OPDCombinedDTO.OPDChargesCategoryDTO chargeCategory=ipdManagementInterface.getByChargeCategoryId(charge.getChargeCategoryId()).getBody();
//                    OPDCombinedDTO.OPDChargesNameDTO chargeName=ipdManagementInterface.getByChargeNameId(charge.getChargeNameId()).getBody();
//                    chargeDTO.setOpdChargesTypeDTO(chargesType);
//                    chargeDTO.setOpdChargesCategoryDTO(chargeCategory);
//                    chargeDTO.setOpdChargesNameDTO(chargeName);
//                    return chargeDTO;
//                })
//                .collect(Collectors.toList());
//        opdCombinedDTO.setOpdCharges(opdCharges);

        // Fetch and map OPD payments
        opdCombinedDTO.setOpdPayments(opdPaymentsRepository.findByOpdIdAndIsActiveTrue(opdId).stream()
                .map(payment -> modelMapper.map(payment, OPDCombinedDTO.OPDPaymentsDTO.class))
                .collect(Collectors.toList()));

        // Fetch and map vitals
        opdCombinedDTO.setVitals(vitalsRepository.findByOpdId(opdId).stream()
                .map(vital -> modelMapper.map(vital, OPDCombinedDTO.VitalsDTO.class))
                .collect(Collectors.toList()));

        // Fetch and map timeline events
        opdCombinedDTO.setTimeline(timeLineRepository.findByOpdIdAndIsActiveTrue(opdId).stream()
                .map(event -> modelMapper.map(event, OPDCombinedDTO.TimeLineDTO.class))
                .collect(Collectors.toList()));

        return opdCombinedDTO;
    }

    public JSONObject patchUpdateDischargeDetails(String admissionId, DischargeDetailsDTO dischargeDetailsDTO, MultipartFile file) {
        try {
            HMS_TM_OPDAdmissions existingRecord = opdAdmissionsRepository.findByAdmissionIdAndIsActiveTrue(admissionId)
                    .orElseThrow(() -> new CustomException("OPD Admission record not found", HttpStatus.NOT_FOUND));
            if (dischargeDetailsDTO.getDischargeDate() != null) {
                existingRecord.setDischargeDate(dischargeDetailsDTO.getDischargeDate());
            }
            if (dischargeDetailsDTO.getDischargeStatus() != null) {
                if (dischargeDetailsDTO.getDischargeStatus().equalsIgnoreCase("Death")) {
                    if (file != null && !file.isEmpty()) {
                        String encodedAttachment = Base64.getEncoder().encodeToString(file.getBytes());
                        existingRecord.setAttachment(encodedAttachment);
                    }
                }
                existingRecord.setDischargeStatus(dischargeDetailsDTO.getDischargeStatus());
            }
            if (dischargeDetailsDTO.getDischargeSummary() != null) {
                existingRecord.setDischargeSummary(dischargeDetailsDTO.getDischargeSummary());
            }
            if (dischargeDetailsDTO.getOperation() != null) {
                existingRecord.setOperation(dischargeDetailsDTO.getOperation());
            }
            if (dischargeDetailsDTO.getDiagnosis() != null) {
                existingRecord.setDiagnosis(dischargeDetailsDTO.getDiagnosis());
            }
            if (dischargeDetailsDTO.getInvestigation() != null) {
                existingRecord.setInvestigation(dischargeDetailsDTO.getInvestigation());
            }
            if (dischargeDetailsDTO.getTreatmentHome() != null) {
                existingRecord.setTreatmentHome(dischargeDetailsDTO.getTreatmentHome());
            }
            if (dischargeDetailsDTO.getDeathDate() != null) {
                existingRecord.setDeathDate(dischargeDetailsDTO.getDeathDate());
            }
            if (dischargeDetailsDTO.getGuardianName() != null) {
                existingRecord.setGuardianName(dischargeDetailsDTO.getGuardianName());
            }
            if (dischargeDetailsDTO.getReport() != null) {
                existingRecord.setReport(dischargeDetailsDTO.getReport());
            }
            if (dischargeDetailsDTO.getReferralDate() != null) {
                existingRecord.setReferralDate(dischargeDetailsDTO.getReferralDate());
            }
            if (dischargeDetailsDTO.getReferralHospitalName() != null) {
                existingRecord.setReferralHospitalName(dischargeDetailsDTO.getReferralHospitalName());
            }
            if (dischargeDetailsDTO.getReasonForReferral() != null) {
                existingRecord.setReasonForReferral(dischargeDetailsDTO.getReasonForReferral());
            }
            existingRecord.setLastModifiedAt(LocalDateTime.now());
            existingRecord.setLastModifiedBy("system");
            opdAdmissionsRepository.save(existingRecord);
            JSONObject response = new JSONObject();
            response.put("Message", "Discharge details updated successfully");
            return response;

        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public TotalOPDVisitDTO getCombinedVisitDetailsById(String patientId) {
        List<String> opdIds = opdAdmissionsRepository.findOpdIdsByPatientId(patientId);
        TotalOPDVisitDTO dto = new TotalOPDVisitDTO();
        List<OPDCombinedDTO> combinedDetailsList = new ArrayList<>();
        for (String opdId : opdIds) {
            OPDCombinedDTO combinedDetails = this.getAdmissionCombinedById(opdId);
            if (combinedDetails.getAdmissions().getPatientDetails() == null) {
                combinedDetails.getAdmissions().setPatientDetails(new OPDCombinedDTO.PatientDTO());
            }
            combinedDetails.getAdmissions().getPatientDetails().setTotalReCheckup(opdIds.size());
            combinedDetailsList.add(combinedDetails);
        }
        dto.setTotalOPDVisit(combinedDetailsList);
        return dto;
    }

    public List<SearchPrescriptionDTO> getPatientsPrescriptionBySearchTerm(String id) {
        return opdAdmissionsRepository.findPrescriptionsForNonDischargedPatient(id);
    }


    public boolean existsByPatientIdAndIsActiveTrueAndDischargeDateAfter(String patientId, LocalDateTime currentDate) {
        return opdAdmissionsRepository.existsByPatientIdAndIsActiveTrueAndDischargeDateAfter(patientId, currentDate);
    }

    public String getActiveIpdIdByPatientId(String patientId) {
        return opdAdmissionsRepository.findActiveIpdIdByPatientId(patientId)
                .orElse(null);
    }

    public Integer getMedicalHistoryOpdId(String patientId) {
        Integer opdId = opdAdmissionsRepository.countByPatientId(patientId);
        return (opdId != null) ? opdId : 0;
    }

    public OPDCombinedDTO getPatientCombinedById(String opdOrIpdId) {
        OPDCombinedDTO opdCombinedDTO = new OPDCombinedDTO();
        opdAdmissionsRepository.findByOpdIdAndIsActiveTrue(opdOrIpdId).ifPresent(admission -> {
            OPDCombinedDTO.OPDAdmissionsDTO admissionsDTO = modelMapper.map(admission, OPDCombinedDTO.OPDAdmissionsDTO.class);
            opdCombinedDTO.setAdmissions(admissionsDTO);
        });
        OPDCombinedDTO.PatientDTO patientInfo = connectionInterface.getPatientById(opdCombinedDTO.getAdmissions().getPatientId()).getBody();
        opdCombinedDTO.setPatient(patientInfo);
        return opdCombinedDTO;
    }

    public OPDCombinedDTO getDeathPatientCombinedById(String opdOrIpdId) {
        OPDCombinedDTO opdCombinedDTO = new OPDCombinedDTO();
        opdAdmissionsRepository.findByDischargeDateIsNotNullAndDischargeStatusIgnoreCaseAndIsActiveTrue(opdOrIpdId, "death").ifPresent(admission -> {
            OPDCombinedDTO.OPDAdmissionsDTO admissionsDTO = modelMapper.map(admission, OPDCombinedDTO.OPDAdmissionsDTO.class);
            opdCombinedDTO.setAdmissions(admissionsDTO);
        });
        OPDCombinedDTO.PatientDTO patientInfo = connectionInterface.getPatientById(opdCombinedDTO.getAdmissions().getPatientId()).getBody();
        opdCombinedDTO.setPatient(patientInfo);
        return opdCombinedDTO;
    }

    public OPDCombinedDTO getAntenatalPatientCombinedById(String opdOrIpdId) {
        OPDCombinedDTO opdCombinedDTO = new OPDCombinedDTO();
        opdAdmissionsRepository.findByOpdIdAndAntenatalTrueAndIsActiveTrue(opdOrIpdId).ifPresent(admission -> {
            OPDCombinedDTO.OPDAdmissionsDTO admissionsDTO = modelMapper.map(admission, OPDCombinedDTO.OPDAdmissionsDTO.class);
            opdCombinedDTO.setAdmissions(admissionsDTO);
        });
        OPDCombinedDTO.PatientDTO patientInfo = connectionInterface.getPatientById(opdCombinedDTO.getAdmissions().getPatientId()).getBody();
        opdCombinedDTO.setPatient(patientInfo);
        return opdCombinedDTO;

    }

    public List<OPDAdmissionsDetailsDTO> getAllDischarge(Integer page, Integer size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Order.desc("createdAt")));
            List<HMS_TM_OPDAdmissions> admissions = opdAdmissionsRepository.findAllByIsActiveTrueAndDischargeDateIsNotNull(pageRequest).getContent();
            return admissions.stream()
                    .map(admission -> {
                        OPDAdmissionsDetailsDTO opdAdmissionsDTO = modelMapper.map(admission, OPDAdmissionsDetailsDTO.class);
                        List<String> opdIds = opdAdmissionsRepository.findOpdIdsByPatientId(admission.getPatientId());
                        OPDCombinedDTO.PatientDTO patientInfo = connectionInterface.getPatientById(admission.getPatientId())
                                .getBody();
                        if (patientInfo == null) {
                            return null;
                        }
                        EmployeeDetails doctorDetails = adminManagementInterface.getEmployeeById(admission.getDoctorId()).getBody();
                        patientInfo.setLastVisit(admission.getAppointmentDate());
                        patientInfo.setTotalReCheckup(opdIds.size());
                        opdAdmissionsDTO.setPatient(patientInfo);
                        opdAdmissionsDTO.setDoctor(doctorDetails);
                        return opdAdmissionsDTO;
                    })
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }

//    public List<OPDTPACombinedDTO> getAllOPDDetailsWithPatientAndTPA() {
//        return opdAdmissionsRepository.findAll()
//                .stream()
//                .map(opdAdmission -> {
//                    OPDCombinedDTO.PatientDTO patientDetails = null;
//                    try {
//                        ResponseEntity<OPDCombinedDTO.PatientDTO> patientResponse =
//                                connectionInterface.getPatientById(opdAdmission.getPatientId());
//                        if (patientResponse != null && patientResponse.getStatusCode().is2xxSuccessful()) {
//                            patientDetails = patientResponse.getBody();
//                        } else {
//                            logger.warn("Patient not found for ID: {}", opdAdmission.getPatientId());
//                        }
//                    } catch (Exception e) {
//                        logger.error("Error fetching patient {}: {}", opdAdmission.getPatientId(), e.getMessage());
//                    }
//
//                    TPADetailsDTO tpaDetails = null;
//                    if (opdAdmission.isTpa()) {
//                        try {
//                            ResponseEntity<TPADetailsDTO> tpaResponse =
//                                    tpaInterface.getTpaDetailsById(opdAdmission.getChargeId());
//                            if (tpaResponse != null && tpaResponse.getStatusCode().is2xxSuccessful()) {
//                                tpaDetails = tpaResponse.getBody();
//                            } else {
//                                logger.debug("TPA not found or error for charge ID: {}", opdAdmission.getChargeId());
//                            }
//                        } catch (Exception e) {
//                            logger.error("Error fetching TPA {}: {}", opdAdmission.getChargeId(), e.getMessage());
//                        }
//                    }
//
//                    return new OPDTPACombinedDTO(
//                            opdAdmission.getAdmissionId(),
//                            opdAdmission.getPatientId(),
//                            opdAdmission.getDoctorId(),
//                            opdAdmission.getNurseId(),
//                            opdAdmission.getAppointmentDate(),
//                            opdAdmission.getChargeId(),
//                            opdAdmission.getSymptomsType(),
//                            opdAdmission.getSymptomsTitle(),
//                            opdAdmission.getSymptomsDescription(),
//                            opdAdmission.getNote(),
//                            patientDetails,
//                            tpaDetails
//                    );
//                })
//                .collect(Collectors.toList());
//    }

    public List<OPDTPACombinedDTO> getAllOPDDetailsWithPatientAndTPA() {
        return opdAdmissionsRepository.findAll()
                .stream()
                .filter(HMS_TM_OPDAdmissions::isTpa)
                .map(opdAdmission -> {
                    OPDCombinedDTO.PatientDTO patientDetails = null;
                    try {
                        ResponseEntity<OPDCombinedDTO.PatientDTO> patientResponse =
                                connectionInterface.getPatientById(opdAdmission.getPatientId());
                        if (patientResponse != null && patientResponse.getStatusCode().is2xxSuccessful()) {
                            patientDetails = patientResponse.getBody();
                        } else {
                            logger.warn("Patient not found for ID: {}", opdAdmission.getPatientId());
                        }
                    } catch (Exception e) {
                        logger.error("Error fetching patient {}: {}", opdAdmission.getPatientId(), e.getMessage());
                    }

                    TPADetailsDTO tpaDetails = null;
                    try {
                        ResponseEntity<TPADetailsDTO> tpaResponse =
                                tpaInterface.getTpaDetailsById(opdAdmission.getChargeId());
                        if (tpaResponse != null && tpaResponse.getStatusCode().is2xxSuccessful()) {
                            tpaDetails = tpaResponse.getBody();
                        } else {
                            logger.debug("TPA not found or error for charge ID: {}", opdAdmission.getChargeId());
                        }
                    } catch (Exception e) {
                        logger.error("Error fetching TPA {}: {}", opdAdmission.getChargeId(), e.getMessage());
                    }

                    return new OPDTPACombinedDTO(
                            opdAdmission.getAdmissionId(),
                            opdAdmission.getPatientId(),
                            opdAdmission.getDoctorId(),
                            opdAdmission.getNurseId(),
                            opdAdmission.getAppointmentDate(),
                            opdAdmission.getChargeId(),
                            opdAdmission.getSymptomsType(),
                            opdAdmission.getSymptomsTitle(),
                            opdAdmission.getSymptomsDescription(),
                            opdAdmission.getNote(),
                            patientDetails,
                            tpaDetails
                    );
                })
                .collect(Collectors.toList());
    }


    public OPDTPACombinedDTO getOPDDetailsByAdmissionId(String admissionId) {
        return opdAdmissionsRepository.findByAdmissionId(admissionId)
                .map(opdAdmission -> {
                    OPDCombinedDTO.PatientDTO patientDetails = null;
                    try {
                        ResponseEntity<OPDCombinedDTO.PatientDTO> patientResponse =
                                connectionInterface.getPatientById(opdAdmission.getPatientId());
                        if (patientResponse != null && patientResponse.getStatusCode().is2xxSuccessful()) {
                            patientDetails = patientResponse.getBody();
                        } else {
                            logger.warn("Patient not found for ID: {}", opdAdmission.getPatientId());
                        }
                    } catch (Exception e) {
                        logger.error("Error fetching patient {}: {}", opdAdmission.getPatientId(), e.getMessage());
                    }

                    TPADetailsDTO tpaDetails = null;
                    if (opdAdmission.isTpa()) {
                        try {
                            ResponseEntity<TPADetailsDTO> tpaResponse =
                                    tpaInterface.getTpaDetailsById(opdAdmission.getChargeId());
                            if (tpaResponse != null && tpaResponse.getStatusCode().is2xxSuccessful()) {
                                tpaDetails = tpaResponse.getBody();
                            } else {
                                logger.debug("TPA not found or error for charge ID: {}", opdAdmission.getChargeId());
                            }
                        } catch (Exception e) {
                            logger.error("Error fetching TPA {}: {}", opdAdmission.getChargeId(), e.getMessage());
                        }
                    }

                    return new OPDTPACombinedDTO(
                            opdAdmission.getAdmissionId(),
                            opdAdmission.getPatientId(),
                            opdAdmission.getDoctorId(),
                            opdAdmission.getNurseId(),
                            opdAdmission.getAppointmentDate(),
                            opdAdmission.getChargeId(),
                            opdAdmission.getSymptomsType(),
                            opdAdmission.getSymptomsTitle(),
                            opdAdmission.getSymptomsDescription(),
                            opdAdmission.getNote(),
                            patientDetails,
                            tpaDetails
                    );
                })
                .orElseThrow(() -> new RuntimeException("No OPD Admission found for admission ID: " + admissionId));
    }

//    public OPDAdmissionsDTO getAdmissionByOpdId(String opdId) {
//        HMS_TM_OPDAdmissions admission = opdAdmissionsRepository.findByOpdIdAndIsActiveTrue(opdId)
//                .orElse(null);
//        if (admission == null) {
//            return null;
//        }
//        return modelMapper.map(admission, OPDAdmissionsDTO.class);
//    }
//
//    public OPDAdmissionsDTO getAdmissionByOpdIdAndPatientId(String opdId, String patientId) {
//        HMS_TM_OPDAdmissions admission = opdAdmissionsRepository.findByOpdIdAndPatientIdAndIsActiveTrue(opdId, patientId)
//                .orElse(null);
//        if (admission == null) {
//            return null;
//        }
//        return modelMapper.map(admission, OPDAdmissionsDTO.class);
//    }
//
//    public OPDAdmissionsDTO getAdmissionByPatientId(String patientId) {
//        HMS_TM_OPDAdmissions admission = opdAdmissionsRepository.findByPatientIdAndIsActiveTrue(patientId)
//                .orElse(null);
//        if (admission == null) {
//            return null;
//        }
//        return modelMapper.map(admission, OPDAdmissionsDTO.class);
//    }

    public List<OPDAdmissionsDetailsDTO> searchAdmissions(String searchTerm) {
        if (searchTerm != null && (searchTerm.toLowerCase().startsWith("opd") || searchTerm.toLowerCase().startsWith("pid"))) {
            List<HMS_TM_OPDAdmissions> admissions = opdAdmissionsRepository.searchByOpdIdOrPatientIdOrPatientName(searchTerm);
            if (!admissions.isEmpty()) {
                return admissions.stream()
                        .map(admission -> {
                            OPDAdmissionsDetailsDTO opdAdmissionsDTO = modelMapper.map(admission, OPDAdmissionsDetailsDTO.class);
                            List<String> opdIds = opdAdmissionsRepository.findOpdIdsByPatientId(admission.getPatientId());
                            OPDCombinedDTO.PatientDTO patientInfo = connectionInterface.getPatientById(admission.getPatientId()).getBody();
                            if (patientInfo == null) {
                                return null;
                            }
                            EmployeeDetails doctorDetails = adminManagementInterface.getEmployeeById(admission.getDoctorId()).getBody();
                            patientInfo.setLastVisit(admission.getAppointmentDate());
                            patientInfo.setTotalReCheckup(opdIds.size());
                            opdAdmissionsDTO.setPatient(patientInfo);
                            opdAdmissionsDTO.setDoctor(doctorDetails);
                            return opdAdmissionsDTO;
                        })
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList());
            } else {
                return new ArrayList<>();
            }
        } else {
            ResponseEntity<List<OPDCombinedDTO.PatientDTO>> patientSearch = connectionInterface.getPatientListBySearchTerm(searchTerm);
            if (patientSearch.getBody() != null && !patientSearch.getBody().isEmpty()) {
                List<OPDCombinedDTO.PatientDTO> patients = patientSearch.getBody();
                List<String> patientIds = patients.stream()
                        .map(OPDCombinedDTO.PatientDTO::getPatientId)
                        .collect(Collectors.toList());

                List<HMS_TM_OPDAdmissions> admissions = opdAdmissionsRepository.findAllActiveAdmissionsWithoutDischarge(patientIds);

                return admissions.stream()
                        .map(admission -> {
                            OPDAdmissionsDetailsDTO opdAdmissionsDTO = modelMapper.map(admission, OPDAdmissionsDetailsDTO.class);
                            List<String> opdIds = opdAdmissionsRepository.findOpdIdsByPatientId(admission.getPatientId());
                            OPDCombinedDTO.PatientDTO patientInfo = patients.stream()
                                    .filter(p -> p.getPatientId().equals(admission.getPatientId()))
                                    .findFirst()
                                    .orElse(null);
                            if (patientInfo == null) {
                                return null;
                            }
                            EmployeeDetails doctorDetails = adminManagementInterface.getEmployeeById(admission.getDoctorId()).getBody();
                            patientInfo.setLastVisit(admission.getAppointmentDate());
                            patientInfo.setTotalReCheckup(opdIds.size());
                            opdAdmissionsDTO.setPatient(patientInfo);
                            opdAdmissionsDTO.setDoctor(doctorDetails);
                            return opdAdmissionsDTO;
                        })
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList());
            }
        }

        // Fallback return if no conditions are met
        return new ArrayList<>();
    }


    public List<OPDAdmissionsDetailsDTO> searchDischargedPatients(String searchTerm) {
        List<OPDAdmissionsDetailsDTO> resultList = new ArrayList<>();

        if (searchTerm.toLowerCase().startsWith("opd") || searchTerm.toLowerCase().startsWith("pid")) {
            PageRequest pageRequest = PageRequest.of(0, 1000, Sort.by(Sort.Order.desc("createdAt")));
            List<HMS_TM_OPDAdmissions> admissions = opdAdmissionsRepository
                    .findAllByIsActiveTrueAndDischargeDateIsNotNull(pageRequest)
                    .getContent();

            if (admissions != null && !admissions.isEmpty()) {
                resultList = admissions.stream()
                        .map(admission -> {
                            OPDAdmissionsDetailsDTO opdAdmissionsDTO = modelMapper.map(admission, OPDAdmissionsDetailsDTO.class);
                            List<String> opdIds = opdAdmissionsRepository.findOpdIdsByPatientId(admission.getPatientId());
                            OPDCombinedDTO.PatientDTO patientInfo = connectionInterface.getPatientById(admission.getPatientId()).getBody();
                            if (patientInfo == null) return null;

                            EmployeeDetails doctorDetails = adminManagementInterface.getEmployeeById(admission.getDoctorId()).getBody();
                            patientInfo.setLastVisit(admission.getAppointmentDate());
                            patientInfo.setTotalReCheckup(opdIds.size());
                            opdAdmissionsDTO.setPatient(patientInfo);
                            opdAdmissionsDTO.setDoctor(doctorDetails);
                            return opdAdmissionsDTO;
                        })
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList());
            }
        } else {
            ResponseEntity<List<OPDCombinedDTO.PatientDTO>> patientSearch = connectionInterface.getPatientListBySearchTerm(searchTerm);
            List<OPDCombinedDTO.PatientDTO> patients = patientSearch.getBody();

            if (patients != null && !patients.isEmpty()) {
                List<String> patientIds = patients.stream()
                        .map(OPDCombinedDTO.PatientDTO::getPatientId)
                        .collect(Collectors.toList());

                List<HMS_TM_OPDAdmissions> admissions = opdAdmissionsRepository.findAllByPatientIdInAndIsActiveTrueAndDischargeDateIsNotNull(patientIds);

                resultList = admissions.stream()
                        .map(admission -> {
                            OPDAdmissionsDetailsDTO opdAdmissionsDTO = modelMapper.map(admission, OPDAdmissionsDetailsDTO.class);
                            List<String> opdIds = opdAdmissionsRepository.findOpdIdsByPatientId(admission.getPatientId());
                            OPDCombinedDTO.PatientDTO patientInfo = patients.stream()
                                    .filter(p -> p.getPatientId().equals(admission.getPatientId()))
                                    .findFirst()
                                    .orElse(null);
                            if (patientInfo == null) return null;

                            EmployeeDetails doctorDetails = adminManagementInterface.getEmployeeById(admission.getDoctorId()).getBody();
                            patientInfo.setLastVisit(admission.getAppointmentDate());
                            patientInfo.setTotalReCheckup(opdIds.size());
                            opdAdmissionsDTO.setPatient(patientInfo);
                            opdAdmissionsDTO.setDoctor(doctorDetails);
                            return opdAdmissionsDTO;
                        })
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList());
            }
        }

        return resultList;
    }


}








//    public IPDCombinedDTO getAdmissionCombinedById(String ipdId) {
//
//        IPDCombinedDTO ipdCombinedDTO = new IPDCombinedDTO();
//        // Fetch and map admissions
//        ipdAdmissionsRepository.findByIpdIdAndIsActiveTrue(ipdId).ifPresent(admission -> {
//            IPDCombinedDTO.IPDAdmissionsDTO admissionsDTO = modelMapper.map(admission, IPDCombinedDTO.IPDAdmissionsDTO.class);
//            ipdCombinedDTO.setAdmissions(admissionsDTO);
//        });
//
//        // Fetch and map nurse notes
//        ipdCombinedDTO.setNurseNotes(nurseNotesRepository.findByIpdIdAndIsActiveTrue(ipdId).stream()
//                .map(note -> modelMapper.map(note, IPDCombinedDTO.NurseNotesDTO.class))
//                .collect(Collectors.toList()));
//
//        // Fetch and map prescriptions
//        ipdCombinedDTO.setPrescriptions(prescriptionRepository.findByIpdIdAndIsActiveTrue(ipdId).stream()
//                .map(prescription -> modelMapper.map(prescription, IPDCombinedDTO.PrescriptionsDTO.class))
//                .collect(Collectors.toList()));
//
//        // Fetch and map prescription details
//        ipdCombinedDTO.setPrescriptionDetails(prescriptionDetailsRepository.findByIpdIdAndIsActiveTrue(ipdId).stream()
//                .map(detail -> modelMapper.map(detail, IPDCombinedDTO.PrescriptionDetailsDTO.class))
//                .collect(Collectors.toList()));
//
//        // Fetch and map consultant register
//        ipdCombinedDTO.setConsultantRegister(consultantRegisterRepository.findAllByIpdIdAndIsActiveTrue(ipdId).stream()
//                .map(consultant -> modelMapper.map(consultant, IPDCombinedDTO.ConsultantRegisterDTO.class))
//                .collect(Collectors.toList()));
//
//        // Fetch and map IPD charges
//        ipdCombinedDTO.setIpdCharges(ipdChargesRepository.findByIpdIdAndIsActiveTrue(ipdId).stream()
//                .map(charge -> {
//                    IPDCombinedDTO.IPDChargesDTO chargesDTO = modelMapper.map(charge, IPDCombinedDTO.IPDChargesDTO.class);
//
//                    // Map Charge Type
//                    chargeTypeRepository.findByChargeTypeIdAndIsActiveTrue(charge.getChargeTypeId()).ifPresent(chargeType -> {
//                        IPDCombinedDTO.IPDChargesTypeDTO chargeTypeDTO = modelMapper.map(chargeType, IPDCombinedDTO.IPDChargesTypeDTO.class);
//                        chargesDTO.setIpdChargesTypeDTO(chargeTypeDTO);
//                    });
//
//                    // Map Charge Category
//                    categoryRepository.findByChargeCategoryIdAndIsActiveTrue(charge.getChargeCategoryId()).ifPresent(chargeCategory -> {
//                        IPDCombinedDTO.IPDChargesCategoryDTO chargeCategoryDTO = modelMapper.map(chargeCategory, IPDCombinedDTO.IPDChargesCategoryDTO.class);
//                        chargesDTO.setIpdChargesCategoryDTO(chargeCategoryDTO);
//                    });
//
//                    // Map Charge Name
//                    chargesNameRepository.findByChargeNameIdAndIsActiveTrue(charge.getChargeNameId()).ifPresent(chargeName -> {
//                        IPDCombinedDTO.IPDChargesNameDTO chargeNameDTO = modelMapper.map(chargeName, IPDCombinedDTO.IPDChargesNameDTO.class);
//                        chargesDTO.setIpdChargesNameDTO(chargeNameDTO);
//                    });
//
//                    return chargesDTO;
//                })
//                .collect(Collectors.toList())
//        );
//
//        // Fetch and map IPD payments
//        ipdCombinedDTO.setIpdPayments(ipdPaymentsRepository.findByIpdIdAndIsActiveTrue(ipdId).stream()
//                .map(payment -> modelMapper.map(payment, IPDCombinedDTO.IPDPaymentsDTO.class))
//                .collect(Collectors.toList()));
//
//        // Fetch and map RoomsDTO for the given roomId in admissions
//        Optional<HMS_TM_Rooms> roomEntity = roomsRepository.findByRoomIdAndIsActiveTrue(ipdCombinedDTO.getAdmissions().getRoomId());
//        roomEntity.ifPresent(room -> {
//            IPDCombinedDTO.RoomsDTO roomsDTO = modelMapper.map(room, IPDCombinedDTO.RoomsDTO.class);
//
//            // Fetch and map BedGroupDTO if room exists
//            bedGroupRepository.findByBedGroupIdAndIsActiveTrue(roomsDTO.getBedGroupId()).ifPresent(bedGroup -> {
//                IPDCombinedDTO.BedGroupDTO bedGroupDTO = modelMapper.map(bedGroup, IPDCombinedDTO.BedGroupDTO.class);
//
//                // Set the mapped room to the bed group
//                bedGroupDTO.setRooms(roomsDTO);
//                ipdCombinedDTO.setBedGroup(bedGroupDTO);
//            });
//        });
//
//
//        // Fetch and map vitals
//        ipdCombinedDTO.setVitals(vitalsRepository.findByIpdId(ipdId).stream()
//                .map(vital -> modelMapper.map(vital, IPDCombinedDTO.VitalsDTO.class))
//                .collect(Collectors.toList()));
//
//        // Fetch and map timeline
//        ipdCombinedDTO.setTimeline(timeLineRepository.findByIpdIdAndIsActiveTrue(ipdId).stream()
//                .map(event -> modelMapper.map(event, IPDCombinedDTO.TimeLineDTO.class))
//                .collect(Collectors.toList()));
//
//        return ipdCombinedDTO;
//
//    }


