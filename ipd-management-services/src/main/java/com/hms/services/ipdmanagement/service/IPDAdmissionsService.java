package com.hms.services.ipdmanagement.service;

import com.hms.services.ipdmanagement.configuration.*;
import com.hms.services.ipdmanagement.entity.*;
import com.hms.services.ipdmanagement.exception.CustomException;
import com.hms.services.ipdmanagement.model.*;
import com.hms.services.ipdmanagement.repository.*;
import com.hms.services.ipdmanagement.response.ApiResponse;
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
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class IPDAdmissionsService {

    private final IPDAdmissionsRepository ipdAdmissionsRepository;
    private final ModelMapper modelMapper;
    private final NurseNotesRepository nurseNotesRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final PrescriptionDetailsRepository prescriptionDetailsRepository;
    private final ConsultantRegisterRepository consultantRegisterRepository;
    private final IPDChargesRepository ipdChargesRepository;
    private final IPDPaymentsRepository ipdPaymentsRepository;
    private final BedGroupRepository bedGroupRepository;
    private final RoomsRepository roomsRepository;
    private final VitalsRepository vitalsRepository;
    private final TimeLineRepository timeLineRepository;
    private final ChargeTypeRepository chargeTypeRepository;
    private final IPDChargesCategoryRepository categoryRepository;
    private final IPDChargesNameRepository chargesNameRepository;
    private final CommentsRepository commentsRepository;
    private final IPDMedicationRepository ipdMedicationRepository;
    private final IPDOperationRepository ipdOperationRepository;
    private final IPDDosageRepository ipdDosageRepository;
    private final AntenatalFindingRepository antenatalFindingRepository;
    private final PreviousObstetricHistoryRepository previousObstetricHistoryRepository;
    private final PostnatalHistoryRepository postnatalHistoryRepository;
    private final ConnectionInterface connectionInterface;
    private final AdminManagementInterface adminManagementInterface;
    private final LabManagementInterface labManagementInterface;
    private final OpdManagementInterface opdManagementInterface;
    private final TpaManagementInterface tpaInterface;
    private static final Logger logger = LoggerFactory.getLogger(IPDAdmissionsService.class);



    @Autowired
    public IPDAdmissionsService(final IPDAdmissionsRepository ipdAdmissionsRepository,
                                final ModelMapper modelMapper, final NurseNotesRepository nurseNotesRepository, final PrescriptionRepository prescriptionRepository, final PrescriptionDetailsRepository prescriptionDetailsRepository,
     final ConsultantRegisterRepository consultantRegisterRepository,final CommentsRepository commentsRepository,
    final IPDChargesRepository ipdChargesRepository, final IPDPaymentsRepository ipdPaymentsRepository,final IPDOperationRepository ipdOperationRepository,
    final BedGroupRepository bedGroupRepository, final RoomsRepository roomsRepository,final IPDMedicationRepository ipdMedicationRepository,
    final VitalsRepository vitalsRepository, final TimeLineRepository timeLineRepository, final ChargeTypeRepository chargeTypeRepository,final IPDChargesCategoryRepository categoryRepository,final IPDChargesNameRepository chargesNameRepository,
    final IPDDosageRepository ipdDosageRepository,AntenatalFindingRepository antenatalFindingRepository, PreviousObstetricHistoryRepository previousObstetricHistoryRepository, PostnatalHistoryRepository postnatalHistoryRepository,final ConnectionInterface connectionInterface,
                                final AdminManagementInterface adminManagementInterface,final LabManagementInterface labManagementInterface,final OpdManagementInterface opdManagementInterface,final TpaManagementInterface tpaInterface) {
        this.ipdAdmissionsRepository = ipdAdmissionsRepository;
        this.modelMapper = modelMapper;
        this.nurseNotesRepository = nurseNotesRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.prescriptionDetailsRepository = prescriptionDetailsRepository;
        this.consultantRegisterRepository = consultantRegisterRepository;
        this.ipdChargesRepository = ipdChargesRepository;
        this.ipdPaymentsRepository = ipdPaymentsRepository;
        this.bedGroupRepository = bedGroupRepository;
        this.roomsRepository=roomsRepository;
        this.vitalsRepository = vitalsRepository;
        this.timeLineRepository=timeLineRepository;
        this.chargeTypeRepository=chargeTypeRepository;
        this.categoryRepository=categoryRepository;
        this.chargesNameRepository=chargesNameRepository;
        this.commentsRepository=commentsRepository;
        this.ipdMedicationRepository=ipdMedicationRepository;
        this.ipdOperationRepository=ipdOperationRepository;
        this.ipdDosageRepository=ipdDosageRepository;
        this.antenatalFindingRepository=antenatalFindingRepository;
        this.previousObstetricHistoryRepository=previousObstetricHistoryRepository;
        this.postnatalHistoryRepository=postnatalHistoryRepository;
        this.connectionInterface=connectionInterface;
        this.adminManagementInterface=adminManagementInterface;
        this.labManagementInterface=labManagementInterface;
        this.opdManagementInterface=opdManagementInterface;
        this.tpaInterface=tpaInterface;
    }

    @Transactional
    public ApiResponse createAdmission(IPDAdmissionsDTO ipdAdmissionsDTO) {

        try {
            if(ipdAdmissionsRepository.existsByPatientIdAndIsActiveTrueAndDischargeDateAfter(ipdAdmissionsDTO.getPatientId(),ipdAdmissionsDTO.getAdmissionDate())){
                throw new CustomException("Patient already has an active IPD admission", HttpStatus.BAD_REQUEST);
            }
            if(opdManagementInterface.checkPatientAdmission(ipdAdmissionsDTO.getPatientId(),ipdAdmissionsDTO.getAdmissionDate())){
                throw new CustomException("Patient already has an active OPD admission.Cannot create an IPD admission.", HttpStatus.BAD_REQUEST);
            }

            String ipdId = generateIpdId();
            Long caseId = generateCaseId();
            HMS_TM_IPDAdmissions admission = modelMapper.map(ipdAdmissionsDTO, HMS_TM_IPDAdmissions.class);
            admission.setIpdId(ipdId);
            admission.setCaseId(caseId);
            admission.setActive(true);
            admission.setCreatedAt(LocalDateTime.now());
            admission.setCreatedBy("system");
            adminManagementInterface.getUpdateRoomEntries(ipdAdmissionsDTO.getRoomId(),true);
            HMS_TM_IPDAdmissions savedAdmission = ipdAdmissionsRepository.save(admission);
            return new ApiResponse("success", "", "Admission created successfully", null,null,savedAdmission.getAdmissionId(),ipdId,caseId);
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    private String generateIpdId() {
//        String year = String.valueOf(LocalDate.now().getYear());
        Optional<HMS_TM_IPDAdmissions> lastRecord = ipdAdmissionsRepository.findTopByOrderByCreatedAtDesc();
        long nextSequenceNumber = lastRecord.map(r -> extractSequenceNumber(r.getIpdId()) + 1).orElse(1L);
        String formattedSequence = String.format("%05d", nextSequenceNumber);
        return "IPD"+ formattedSequence;
    }

    private Long extractSequenceNumber(String patientId) {
        String numericPart = patientId.substring(3);
        return Long.parseLong(numericPart);
    }

    private Long generateCaseId() {
        Optional<HMS_TM_IPDAdmissions> lastRecord = ipdAdmissionsRepository.findTopByOrderByCaseIdDesc();
        return lastRecord.map(r -> r.getCaseId() + 1).orElse(1L);
    }


    public List<IPDAdmissionsDetailsDTO> getAllAdmissions(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Order.desc("createdAt")));
            List<HMS_TM_IPDAdmissions> admissions = ipdAdmissionsRepository.findAllByIsActiveTrueAndDischargeDateIsNull(pageRequest).getContent();
            return admissions.stream().map(admission -> {
                IPDAdmissionsDetailsDTO ipdAdmissionsDTO = modelMapper.map(admission, IPDAdmissionsDetailsDTO.class);
                HMS_TM_Rooms room = roomsRepository.findByRoomIdAndIsActiveTrue(admission.getRoomId())
                        .orElse(null);
                if (room != null) {
                    ipdAdmissionsDTO.setRoom(modelMapper.map(room, RoomsDTO.class));
                } else {
                    ipdAdmissionsDTO.setRoom(null);
                }
                IPDCombinedDTO.PatientDTO patientInfo = connectionInterface.getPatientById(admission.getPatientId())
                        .getBody();
                EmployeeDetails doctor =adminManagementInterface.getEmployeeById(admission.getDoctorId()).getBody();
                ipdAdmissionsDTO.setPatient(patientInfo);
                ipdAdmissionsDTO.setDoctor(doctor);
                return ipdAdmissionsDTO;
            }).collect(Collectors.toList());
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public IPDAdmissionsDTO getAdmissionById(String ipdId) {
        HMS_TM_IPDAdmissions admission = ipdAdmissionsRepository.findByIpdIdAndIsActiveTrue(ipdId)
                .orElseThrow(() -> new CustomException("Admission not found", HttpStatus.NOT_FOUND));
        return modelMapper.map(admission, IPDAdmissionsDTO.class);
    }

    public ApiResponse updateAdmissionById(String id, IPDAdmissionsDTO ipdAdmissionsDTO) {
        try {
            HMS_TM_IPDAdmissions existingAdmission = ipdAdmissionsRepository.findByAdmissionIdAndIsActiveTrue(id)
                    .orElseThrow(() -> new CustomException("Admission not found", HttpStatus.NOT_FOUND));
            existingAdmission.setAdmissionDate(ipdAdmissionsDTO.getAdmissionDate());
            existingAdmission.setRoomId(ipdAdmissionsDTO.getRoomId());
            existingAdmission.setReasonForAdmission(ipdAdmissionsDTO.getReasonForAdmission());
            existingAdmission.setSymptomsType(ipdAdmissionsDTO.getSymptomsType());
            existingAdmission.setSymptomsDescription(ipdAdmissionsDTO.getSymptomsDescription());
            existingAdmission.setNote(ipdAdmissionsDTO.getNote());
            existingAdmission.setPreviousMedicalIssue(ipdAdmissionsDTO.getPreviousMedicalIssue());
            existingAdmission.setCasualty(ipdAdmissionsDTO.isCasualty());
            existingAdmission.setOldPatient(ipdAdmissionsDTO.isOldPatient());
            existingAdmission.setReference(ipdAdmissionsDTO.getReference());
            existingAdmission.setStatus(ipdAdmissionsDTO.getStatus());
            existingAdmission.setAntenatal(ipdAdmissionsDTO.isAntenatal());
            existingAdmission.setCreditLimit(ipdAdmissionsDTO.getCreditLimit());
            existingAdmission.setKnownAllergies(ipdAdmissionsDTO.getKnownAllergies());
            existingAdmission.setLastModifiedAt(LocalDateTime.now());
            existingAdmission.setLastModifiedBy("system");
            ipdAdmissionsRepository.save(existingAdmission);
            return new ApiResponse("success", "", "Admission updated successfully", null, null, id, null, null);
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    @Transactional
    public ApiResponse deleteAdmissionById(String id) {
        HMS_TM_IPDAdmissions admission = ipdAdmissionsRepository.findByAdmissionIdAndIsActiveTrue(id)
                .orElseThrow(() -> new CustomException("Admission not found", HttpStatus.NOT_FOUND));
        admission.setActive(false);
        ipdAdmissionsRepository.save(admission);
        return new ApiResponse("success", "", "Admission Deleted successfully", null,null,id,null,null);
    }

    @Transactional
    public IPDCombinedDTO getAdmissionCombinedById(String ipdId) {

        IPDCombinedDTO ipdCombinedDTO = new IPDCombinedDTO();
        // Fetch and map admissions
        ipdAdmissionsRepository.findByIpdIdAndIsActiveTrue(ipdId).ifPresent(admission -> {
            IPDCombinedDTO.IPDAdmissionsDTO admissionsDTO = modelMapper.map(admission, IPDCombinedDTO.IPDAdmissionsDTO.class);
            ipdCombinedDTO.setAdmissions(admissionsDTO);
        });
        IPDCombinedDTO.PatientDTO patientInfo=connectionInterface.getPatientById(ipdCombinedDTO.getAdmissions().getPatientId()).getBody();
        ipdCombinedDTO.setPatient(patientInfo);
        EmployeeDetails doctor =adminManagementInterface.getEmployeeById(ipdCombinedDTO.getAdmissions().getDoctorId()).getBody();
        ipdCombinedDTO.getAdmissions().setDoctor(doctor);
        // Fetch and map nurse notes
        List<HMS_TM_NurseNotes> nurseNotes = nurseNotesRepository.findByIpdIdAndIsActiveTrue(ipdId);
        if(ipdCombinedDTO.getAdmissions().getTpa()!=null) {
            TPADetailsDTO insurance = tpaInterface.getTpaDetailsById(ipdCombinedDTO.getAdmissions().getTpa()).getBody();
            ipdCombinedDTO.getAdmissions().setInsurance(insurance);
        }
        // Step 2: Map nurse notes to DTO and fetch associated comments for each note
        List<IPDCombinedDTO.NurseNotesDTO> nurseNotesDTOList = nurseNotes.stream()
                .map(note -> {
                    // Map NurseNote entity to NurseNotesDTO
                    IPDCombinedDTO.NurseNotesDTO nurseNotesDTO = modelMapper.map(note, IPDCombinedDTO.NurseNotesDTO.class);
                    EmployeeDetails doctorDetails =adminManagementInterface.getEmployeeById(note.getNurseId()).getBody();
                    nurseNotesDTO.setDoctor(doctorDetails);
                    List<HMS_TM_Comments> comments = commentsRepository.findByNotesIdAndIsActiveTrue(note.getNotesId());

                    // Step 4: Map comments to CommentsDTO and set them in NurseNotesDTO
                    List<IPDCombinedDTO.CommentsDTO> commentsDTOList = comments.stream()
                            .map(comment -> modelMapper.map(comment, IPDCombinedDTO.CommentsDTO.class))
                            .collect(Collectors.toList());

                    // Set the comments in the NurseNotesDTO
                    nurseNotesDTO.setComments(commentsDTOList);
                    return nurseNotesDTO;
                })
                .collect(Collectors.toList());
        ipdCombinedDTO.setNurseNotes(nurseNotesDTOList);

        // Fetch and map prescriptions
        List<HMS_TM_Prescriptions> prescriptions = prescriptionRepository.findByIpdIdAndIsActiveTrue(ipdId);

        // Map prescriptions to the DTO and add prescription details
        List<IPDCombinedDTO.PrescriptionsDTO> prescriptionsDTOList = prescriptions.stream()
                .map(prescription -> {
                    EmployeeDetails doctorDetails =adminManagementInterface.getEmployeeById(prescription.getDoctorId()).getBody();
                    List<PathologyTestDetailsDTO> pathology =labManagementInterface.getPathologyTestsByIds(prescription.getPathologyId(),prescription.getPrescriptionNo()).getBody();
                    List<RadiologyTestDetailsDTO> radiology =labManagementInterface.getRadiologyTestsByIds(prescription.getRadiologyId(),prescription.getPrescriptionNo()).getBody();

                    // Map the prescription to DTO
                    IPDCombinedDTO.PrescriptionsDTO prescriptionDTO = modelMapper.map(prescription, IPDCombinedDTO.PrescriptionsDTO.class);

                    // Fetch prescription details for the current prescriptionId
                    List<HMS_TM_PrescriptionDetails> prescriptionDetails =
                            prescriptionDetailsRepository.findByPrescriptionIdAndIsActiveTrue(prescription.getPrescriptionId());
                    List<IPDCombinedDTO.PrescriptionDetailsDTO> prescriptionDetailsDTOList = prescriptionDetails.stream()
                            .map(detail -> modelMapper.map(detail, IPDCombinedDTO.PrescriptionDetailsDTO.class))
                            .collect(Collectors.toList());

                    // Set the prescription details in the prescription DTO
                    prescriptionDTO.setDoctor(doctorDetails);
                    prescriptionDTO.setPathologyTestDetails(pathology);
                    prescriptionDTO.setRadiologyTestDetails(radiology);
                    prescriptionDTO.setPrescriptionDetails(prescriptionDetailsDTOList);

                    return prescriptionDTO;
                })
                .collect(Collectors.toList());
        ipdCombinedDTO.setPrescriptions(prescriptionsDTOList);

        //medication
        List<HMS_TM_IPDMedication> medications = ipdMedicationRepository.findByIpdIdAndIsActiveTrue(ipdId);

        // Map medications to DTOs and include dosages
        List<IPDCombinedDTO.IPDMedicationDTO> medicationDTOs = medications.stream()
                .map(medication -> {
                    IPDCombinedDTO.IPDMedicationDTO medicationDTO = modelMapper.map(medication, IPDCombinedDTO.IPDMedicationDTO.class);
                    List<HMS_TM_IPDDosage> dosages = ipdDosageRepository.findByMedicationIdAndIsActiveTrue(medication.getMedicationId());
                    List<IPDCombinedDTO.DosageDTO> dosageDTOs = dosages.stream()
                            .map(dosage -> modelMapper.map(dosage, IPDCombinedDTO.DosageDTO.class))
                            .collect(Collectors.toList());
                    medicationDTO.setDosage(dosageDTOs);

                    return medicationDTO;
                })
                .collect(Collectors.toList());

        // Set medications in the combined DTO
        ipdCombinedDTO.setMedication(medicationDTOs);

        // Fetch and map consultant register
        ipdCombinedDTO.setConsultantRegister(
                consultantRegisterRepository.findAllByIpdIdAndIsActiveTrue(ipdId) // Fetch active consultants by IPD ID
                        .stream() // Convert the list of consultants into a stream for processing
                        .map(consultant -> {
                            // Map consultant to DTO
                            IPDCombinedDTO.ConsultantRegisterDTO consultantDTO = modelMapper.map(consultant, IPDCombinedDTO.ConsultantRegisterDTO.class);
                            EmployeeDetails doctorDetails = adminManagementInterface.getEmployeeById(consultant.getDoctorId()).getBody();
                            consultantDTO.setDoctor(doctorDetails);
                            return consultantDTO;
                        })
                        .collect(Collectors.toList())
        );

        //Fetch and map IPD charges
        ipdCombinedDTO.setIpdCharges(ipdChargesRepository.findByIpdIdAndIsActiveTrue(ipdId).stream()
                .map(charge -> {
                    IPDCombinedDTO.IPDChargesDTO chargesDTO = modelMapper.map(charge, IPDCombinedDTO.IPDChargesDTO.class);
                    String insuranceId = (patientInfo != null && patientInfo.getInsuranceProviders() != null) ? patientInfo.getInsuranceProviders().getInsuranceId() : null;
                    IPDCombinedDTO.CombinedCharges chargeName =adminManagementInterface.getAllByChargeId(charge.getChargeNameId(),insuranceId).getBody();
                    chargesDTO.setCombinedCharges(chargeName);
                    return chargesDTO;
                })
                .collect(Collectors.toList()));

//         Fetch and map IPD charges
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


        // Fetch and map IPD payments
        ipdCombinedDTO.setIpdPayments(ipdPaymentsRepository.findByIpdIdAndIsActiveTrue(ipdId).stream()
                .map(payment -> modelMapper.map(payment, IPDCombinedDTO.IPDPaymentsDTO.class))
                .collect(Collectors.toList()));

        // Fetch and map RoomsDTO for the given roomId in admissions
        IPDCombinedDTO.BedDetailsDTO roomDetails=adminManagementInterface.getAllRoomEntries(ipdCombinedDTO.getAdmissions().getRoomId()).getBody();
        ipdCombinedDTO.setBedDetails(roomDetails);
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

// Step 1: Fetch operations by IPD ID and active status
        List<HMS_TM_IPDOperation> operations = ipdOperationRepository.findByIpdIdAndIsActiveTrue(ipdId);

// Step 2: Map the operations to IPDOperationDTO using ModelMapper
        List<IPDCombinedDTO.IPDOperationDTO> operationDTOs = operations.stream()
                .map(operation -> {
                    IPDCombinedDTO.IPDOperationDTO operationDTO = modelMapper.map(operation, IPDCombinedDTO.IPDOperationDTO.class);
                    EmployeeDetails doctorDetails = adminManagementInterface.getEmployeeById(operation.getDoctorId()).getBody();
                    operationDTO.setDoctor(doctorDetails);
                    return operationDTO;
                })
                .collect(Collectors.toList());

// Step 6: Set the list of operations in the main DTO (ipdCombinedDTO)
        ipdCombinedDTO.setOperation(operationDTOs);


        // Fetch and map vitals
        ipdCombinedDTO.setVitals(vitalsRepository.findByIpdId(ipdId).stream()
                .map(vital -> modelMapper.map(vital, IPDCombinedDTO.VitalsDTO.class))
                .collect(Collectors.toList()));

        // Fetch and map timeline
        ipdCombinedDTO.setTimeline(timeLineRepository.findByIpdIdAndIsActiveTrue(ipdId).stream()
                .map(event -> modelMapper.map(event, IPDCombinedDTO.TimeLineDTO.class))
                .collect(Collectors.toList()));

        // Fetch and map antenatal findings
        List<HMS_TM_AntenatalFinding> antenatalFindings =
                antenatalFindingRepository.findByIpdIdAndIsActiveTrue(ipdId);
        List<IPDCombinedDTO.AntenatalFindingDTO> antenatalFindingDTOs =
                antenatalFindings.stream()
                        .map(finding -> modelMapper.map(finding, IPDCombinedDTO.AntenatalFindingDTO.class))
                        .collect(Collectors.toList());
        ipdCombinedDTO.setAntenatalFindings(antenatalFindingDTOs);

        // Fetch and map previous obstetric history
        List<HMS_TM_PreviousObstetricHistory> previousHistories =
                previousObstetricHistoryRepository.findByIpdIdAndIsActiveTrue(ipdId);
        List<IPDCombinedDTO.PreviousObstetricHistoryDTO> previousHistoryDTOs =
                previousHistories.stream()
                        .map(history -> modelMapper.map(history, IPDCombinedDTO.PreviousObstetricHistoryDTO.class))
                        .collect(Collectors.toList());
        ipdCombinedDTO.setPreviousObstetricHistory(previousHistoryDTOs);

        // Fetch and map postnatal history
        List<HMS_TM_PostnatalHistory> postnatalHistories =
                postnatalHistoryRepository.findByIpdIdAndIsActiveTrue(ipdId);
        List<IPDCombinedDTO.PostnatalHistoryDTO> postnatalHistoryDTOs =
                postnatalHistories.stream()
                        .map(history -> modelMapper.map(history, IPDCombinedDTO.PostnatalHistoryDTO.class))
                        .collect(Collectors.toList());
        ipdCombinedDTO.setPostnatalHistory(postnatalHistoryDTOs);

        return ipdCombinedDTO;

    }

    @Transactional
    public JSONObject patchUpdateDischargeDetails(String admissionId, DischargeDetailsDTO dischargeDetailsDTO, MultipartFile file) {
        try {
            HMS_TM_IPDAdmissions existingRecord = ipdAdmissionsRepository.findByAdmissionIdAndIsActiveTrue(admissionId)
                    .orElseThrow(() -> new CustomException("IPD Admission record not found", HttpStatus.NOT_FOUND));
            if (dischargeDetailsDTO.getDischargeDate() != null) {
                existingRecord.setDischargeDate(dischargeDetailsDTO.getDischargeDate());
            }
            if (dischargeDetailsDTO.getDischargeStatus() != null) {
                if(dischargeDetailsDTO.getDischargeStatus().equalsIgnoreCase("Death")){
                if (file != null && !file.isEmpty()) {
                    String encodedAttachment = Base64.getEncoder().encodeToString(file.getBytes());
                    existingRecord.setAttachment(encodedAttachment);
                }}
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
            }if (dischargeDetailsDTO.getGuardianName() != null) {
                existingRecord.setGuardianName(dischargeDetailsDTO.getGuardianName());
            }if (dischargeDetailsDTO.getReport() != null) {
                existingRecord.setReport(dischargeDetailsDTO.getReport());
            }
            if (dischargeDetailsDTO.getReferralDate() != null) {
                existingRecord.setReferralDate(dischargeDetailsDTO.getReferralDate());
            }if (dischargeDetailsDTO.getReferralHospitalName() != null) {
                existingRecord.setReferralHospitalName(dischargeDetailsDTO.getReferralHospitalName());
            }if (dischargeDetailsDTO.getReasonForReferral() != null) {
                existingRecord.setReasonForReferral(dischargeDetailsDTO.getReasonForReferral());
            }
            adminManagementInterface.getUpdateRoomEntries(existingRecord.getRoomId(),false);
            existingRecord.setLastModifiedAt(LocalDateTime.now());
            existingRecord.setLastModifiedBy("system");
            ipdAdmissionsRepository.save(existingRecord);
            JSONObject response = new JSONObject();
            response.put("Message", "Discharge details updated successfully");
            return response;

        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public List<SearchPrescriptionDTO> getPatientsPrescriptionBySearchTerm(String id) {
        return ipdAdmissionsRepository.findPrescriptionsForNonDischargedPatient(id);
    }


    public boolean existsByPatientIdAndIsActiveTrueAndDischargeDateAfter(String patientId, LocalDateTime currentDate) {
        return ipdAdmissionsRepository.existsByPatientIdAndIsActiveTrueAndDischargeDateAfter(patientId, currentDate);
    }

    public String getActiveIpdIdByPatientId(String patientId) {
        return ipdAdmissionsRepository.findActiveIpdIdByPatientId(patientId)
                .orElse(null);
    }

    public IPDCombinedDTO getActivePatientIdByIpdId(String opdOrIpdId) {
        IPDCombinedDTO ipdCombinedDTO = new IPDCombinedDTO();
        ipdAdmissionsRepository.findByIpdIdAndIsActiveTrue(opdOrIpdId).ifPresent(admission -> {
            IPDCombinedDTO.IPDAdmissionsDTO admissionsDTO = modelMapper.map(admission, IPDCombinedDTO.IPDAdmissionsDTO.class);
            ipdCombinedDTO.setAdmissions(admissionsDTO);
        });
        IPDCombinedDTO.PatientDTO patientInfo=connectionInterface.getPatientById(ipdCombinedDTO.getAdmissions().getPatientId()).getBody();
        ipdCombinedDTO.setPatient(patientInfo);
        return ipdCombinedDTO;
    }

    public IPDCombinedDTO getDeathPatientIdByIpdId(String opdOrIpdId) {
        IPDCombinedDTO ipdCombinedDTO = new IPDCombinedDTO();
        ipdAdmissionsRepository.findByDischargeDateIsNotNullAndDischargeStatusIgnoreCaseAndIsActiveTrue(opdOrIpdId,"death").ifPresent(admission -> {
            IPDCombinedDTO.IPDAdmissionsDTO admissionsDTO = modelMapper.map(admission, IPDCombinedDTO.IPDAdmissionsDTO.class);
            ipdCombinedDTO.setAdmissions(admissionsDTO);
        });
        IPDCombinedDTO.PatientDTO patientInfo=connectionInterface.getPatientById(ipdCombinedDTO.getAdmissions().getPatientId()).getBody();
        ipdCombinedDTO.setPatient(patientInfo);
        return ipdCombinedDTO;
    }

    public IPDCombinedDTO getAntenatalPatientIdByIpdId(String opdOrIpdId) {
        IPDCombinedDTO ipdCombinedDTO = new IPDCombinedDTO();
        ipdAdmissionsRepository.findByIpdIdAndAntenatalTrueAndIsActiveTrue(opdOrIpdId).ifPresent(admission -> {
            IPDCombinedDTO.IPDAdmissionsDTO admissionsDTO = modelMapper.map(admission, IPDCombinedDTO.IPDAdmissionsDTO.class);
            ipdCombinedDTO.setAdmissions(admissionsDTO);
        });
        IPDCombinedDTO.PatientDTO patientInfo=connectionInterface.getPatientById(ipdCombinedDTO.getAdmissions().getPatientId()).getBody();
        ipdCombinedDTO.setPatient(patientInfo);
        return ipdCombinedDTO;
    }

    public List<IPDAdmissionsDetailsDTO> getAllDischarge(Integer page, Integer size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Order.desc("createdAt")));
            List<HMS_TM_IPDAdmissions> admissions = ipdAdmissionsRepository.findAllByIsActiveTrueAndDischargeDateIsNotNull(pageRequest).getContent();
            return admissions.stream().map(admission -> {
                IPDAdmissionsDetailsDTO ipdAdmissionsDTO = modelMapper.map(admission, IPDAdmissionsDetailsDTO.class);
                HMS_TM_Rooms room = roomsRepository.findByRoomIdAndIsActiveTrue(admission.getRoomId())
                        .orElse(null);
                if (room != null) {
                    ipdAdmissionsDTO.setRoom(modelMapper.map(room, RoomsDTO.class));
                } else {
                    ipdAdmissionsDTO.setRoom(null);
                }
                IPDCombinedDTO.PatientDTO patientInfo = connectionInterface.getPatientById(admission.getPatientId())
                        .getBody();
                EmployeeDetails doctor =adminManagementInterface.getEmployeeById(admission.getDoctorId()).getBody();
                ipdAdmissionsDTO.setPatient(patientInfo);
                ipdAdmissionsDTO.setDoctor(doctor);
                return ipdAdmissionsDTO;
            }).collect(Collectors.toList());
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


//    public List<IPDTPACombinedDTO> getAllIPDDetailsWithPatientAndTPA() {
//        return ipdAdmissionsRepository.findAll()
//                .stream()
//                .map(ipdAdmission -> {
//                    IPDCombinedDTO.PatientDTO patientDetails = null;
//                    try {
//                        ResponseEntity<IPDCombinedDTO.PatientDTO> patientResponse =
//                                connectionInterface.getPatientById(ipdAdmission.getPatientId());
//                        if (patientResponse != null && patientResponse.getStatusCode().is2xxSuccessful()) {
//                            patientDetails = patientResponse.getBody();
//                        } else {
//                            logger.warn("Patient not found for ID: {}", ipdAdmission.getPatientId());
//                        }
//                    } catch (Exception e) {
//                        logger.error("Error fetching patient {}: {}", ipdAdmission.getPatientId(), e.getMessage());
//                    }
//
//                    TPADetailsDTO tpaDetails = null;
//                    String tpaId = ipdAdmission.getTpa();
//                    if (StringUtils.hasText(tpaId)) {
//                        try {
//                            ResponseEntity<TPADetailsDTO> tpaResponse =
//                                    tpaInterface.getTpaDetailsById(tpaId);
//                            if (tpaResponse != null && tpaResponse.getStatusCode().is2xxSuccessful()) {
//                                tpaDetails = tpaResponse.getBody();
//                            } else {
//                                logger.debug("TPA not found or error for ID: {}", tpaId);
//                            }
//                        } catch (Exception e) {
//                            logger.error("Error fetching TPA {}: {}", tpaId, e.getMessage());
//                        }
//                    }
//
//                    return new IPDTPACombinedDTO(
//                            ipdAdmission.getAdmissionId(),
//                            ipdAdmission.getPatientId(),
//                            ipdAdmission.getDoctorId(),
//                            ipdAdmission.getNurseId(),
//                            ipdAdmission.getAdmissionDate(),
//                            ipdAdmission.getRoomId(),
//                            ipdAdmission.getReasonForAdmission(),
//                            ipdAdmission.getSymptomsType(),
//                            ipdAdmission.getSymptomsTitle(),
//                            ipdAdmission.getSymptomsDescription(),
//                            ipdAdmission.getNote(),
//                            patientDetails,
//                            tpaDetails
//                    );
//                })
//                .collect(Collectors.toList());
//    }

    public List<IPDTPACombinedDTO> getAllIPDDetailsWithPatientAndTPA() {
        List<IPDTPACombinedDTO> combinedList = ipdAdmissionsRepository.findAll()
                .stream()
                .map(ipdAdmission -> {
                    TPADetailsDTO tpaDetails = null;
                    String tpaId = ipdAdmission.getTpa();

                    if (StringUtils.hasText(tpaId)) {
                        try {
                            ResponseEntity<TPADetailsDTO> tpaResponse =
                                    tpaInterface.getTpaDetailsById(tpaId);
                            if (tpaResponse != null && tpaResponse.getStatusCode().is2xxSuccessful()) {
                                tpaDetails = tpaResponse.getBody();
                            } else {
                                logger.debug("TPA not found or error for ID: {}", tpaId);
                            }
                        } catch (Exception e) {
                            logger.error("Error fetching TPA {}: {}", tpaId, e.getMessage());
                        }
                    }

                    if (tpaDetails == null) {
                        return null;
                    }

                    IPDCombinedDTO.PatientDTO patientDetails = null;
                    try {
                        ResponseEntity<IPDCombinedDTO.PatientDTO> patientResponse =
                                connectionInterface.getPatientById(ipdAdmission.getPatientId());
                        if (patientResponse != null && patientResponse.getStatusCode().is2xxSuccessful()) {
                            patientDetails = patientResponse.getBody();
                        } else {
                            logger.warn("Patient not found for ID: {}", ipdAdmission.getPatientId());
                        }
                    } catch (Exception e) {
                        logger.error("Error fetching patient {}: {}", ipdAdmission.getPatientId(), e.getMessage());
                    }

                    return new IPDTPACombinedDTO(
                            ipdAdmission.getAdmissionId(),
                            ipdAdmission.getPatientId(),
                            ipdAdmission.getDoctorId(),
                            ipdAdmission.getNurseId(),
                            ipdAdmission.getAdmissionDate(),
                            ipdAdmission.getRoomId(),
                            ipdAdmission.getReasonForAdmission(),
                            ipdAdmission.getSymptomsType(),
                            ipdAdmission.getSymptomsTitle(),
                            ipdAdmission.getSymptomsDescription(),
                            ipdAdmission.getNote(),
                            patientDetails,
                            tpaDetails
                    );
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        return combinedList;
    }


    public IPDTPACombinedDTO getIPDDetailsByAdmissionId(String admissionId) {
        return ipdAdmissionsRepository.findByAdmissionId(admissionId)
                .map(ipdAdmission -> {
                    IPDCombinedDTO.PatientDTO patientDetails = null;
                    try {
                        ResponseEntity<IPDCombinedDTO.PatientDTO> patientResponse =
                                connectionInterface.getPatientById(ipdAdmission.getPatientId());
                        if (patientResponse != null && patientResponse.getStatusCode().is2xxSuccessful()) {
                            patientDetails = patientResponse.getBody();
                        } else {
                            logger.warn("Patient not found for ID: {}", ipdAdmission.getPatientId());
                        }
                    } catch (Exception e) {
                        logger.error("Error fetching patient {}: {}", ipdAdmission.getPatientId(), e.getMessage());
                    }

                    TPADetailsDTO tpaDetails = null;
                    String tpaId = ipdAdmission.getTpa();
                    if (StringUtils.hasText(tpaId)) {
                        try {
                            ResponseEntity<TPADetailsDTO> tpaResponse =
                                    tpaInterface.getTpaDetailsById(tpaId);
                            if (tpaResponse != null && tpaResponse.getStatusCode().is2xxSuccessful()) {
                                tpaDetails = tpaResponse.getBody();
                            } else {
                                logger.debug("TPA not found or error for ID: {}", tpaId);
                            }
                        } catch (Exception e) {
                            logger.error("Error fetching TPA {}: {}", tpaId, e.getMessage());
                        }
                    }

                    return new IPDTPACombinedDTO(
                            ipdAdmission.getAdmissionId(),
                            ipdAdmission.getPatientId(),
                            ipdAdmission.getDoctorId(),
                            ipdAdmission.getNurseId(),
                            ipdAdmission.getAdmissionDate(),
                            ipdAdmission.getRoomId(),
                            ipdAdmission.getReasonForAdmission(),
                            ipdAdmission.getSymptomsType(),
                            ipdAdmission.getSymptomsTitle(),
                            ipdAdmission.getSymptomsDescription(),
                            ipdAdmission.getNote(),
                            patientDetails,
                            tpaDetails
                    );
                })
                .orElseThrow(() -> new RuntimeException("No IPD Admission found for admission ID: " + admissionId));
    }

    public IPDAdmissionsDTO getAdmissionByIpdId(String ipdId) {
        HMS_TM_IPDAdmissions admission = ipdAdmissionsRepository.findByIpdIdAndIsActiveTrue(ipdId)
                .orElseThrow(() -> new CustomException("Admission not found", HttpStatus.NOT_FOUND));
        return modelMapper.map(admission, IPDAdmissionsDTO.class);
    }

    public IPDAdmissionsDTO getAdmissionByIpdIdAndPatientId(String ipdId, String patientId) {
        HMS_TM_IPDAdmissions admission = ipdAdmissionsRepository.findByIpdIdAndPatientIdAndIsActiveTrue(ipdId, patientId)
                .orElseThrow(() -> new CustomException("Admission not found", HttpStatus.NOT_FOUND));
        return modelMapper.map(admission, IPDAdmissionsDTO.class);
    }

    public IPDAdmissionsDTO getAdmissionByPatientId(String patientId) {
        HMS_TM_IPDAdmissions admission = ipdAdmissionsRepository.findByPatientIdAndIsActiveTrue(patientId)
                .orElseThrow(() -> new CustomException("Admission not found", HttpStatus.NOT_FOUND));
        return modelMapper.map(admission, IPDAdmissionsDTO.class);
    }

    public List<IPDAdmissionsDetailsDTO> searchAdmissions(String searchTerm) {
        if (searchTerm != null && (searchTerm.toLowerCase().startsWith("ipd") || searchTerm.toLowerCase().startsWith("pid"))) {
            List<HMS_TM_IPDAdmissions> admissions = ipdAdmissionsRepository.searchByIpdIdOrPatientIdOrPatientName(searchTerm);
            if (!admissions.isEmpty()) {
                return admissions.stream()
                        .map(admission -> {
                            IPDAdmissionsDetailsDTO ipdAdmissionsDTO = modelMapper.map(admission, IPDAdmissionsDetailsDTO.class);

                            // Room details
                            HMS_TM_Rooms room = roomsRepository.findByRoomIdAndIsActiveTrue(admission.getRoomId()).orElse(null);
                            if (room != null) {
                                ipdAdmissionsDTO.setRoom(modelMapper.map(room, RoomsDTO.class));
                            } else {
                                ipdAdmissionsDTO.setRoom(null);
                            }

                            // Patient info
                            IPDCombinedDTO.PatientDTO patientInfo = connectionInterface.getPatientById(admission.getPatientId()).getBody();
                            if (patientInfo == null) {
                                return null;
                            }

                            // Doctor info
                            EmployeeDetails doctorDetails = adminManagementInterface.getEmployeeById(admission.getDoctorId()).getBody();

                            ipdAdmissionsDTO.setPatient(patientInfo);
                            ipdAdmissionsDTO.setDoctor(doctorDetails);

                            return ipdAdmissionsDTO;
                        })
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList());
            } else {
                return new ArrayList<>();
            }
        } else {
            ResponseEntity<List<IPDCombinedDTO.PatientDTO>> patientSearch = connectionInterface.getPatientListBySearchTerm(searchTerm);
            if (patientSearch.getBody() != null && !patientSearch.getBody().isEmpty()) {
                List<IPDCombinedDTO.PatientDTO> patients = patientSearch.getBody();
                List<String> patientIds = patients.stream()
                        .map(IPDCombinedDTO.PatientDTO::getPatientId)
                        .collect(Collectors.toList());

                List<HMS_TM_IPDAdmissions> admissions = ipdAdmissionsRepository.findAllActiveAdmissionsWithoutDischarge(patientIds);

                return admissions.stream()
                        .map(admission -> {
                            IPDAdmissionsDetailsDTO ipdAdmissionsDTO = modelMapper.map(admission, IPDAdmissionsDetailsDTO.class);

                            // Room info
                            HMS_TM_Rooms room = roomsRepository.findByRoomIdAndIsActiveTrue(admission.getRoomId()).orElse(null);
                            if (room != null) {
                                ipdAdmissionsDTO.setRoom(modelMapper.map(room, RoomsDTO.class));
                            } else {
                                ipdAdmissionsDTO.setRoom(null);
                            }

                            // Patient info from already fetched list
                            IPDCombinedDTO.PatientDTO patientInfo = patients.stream()
                                    .filter(p -> p.getPatientId().equals(admission.getPatientId()))
                                    .findFirst()
                                    .orElse(null);

                            if (patientInfo == null) {
                                return null;
                            }

                            // Doctor info
                            EmployeeDetails doctorDetails = adminManagementInterface.getEmployeeById(admission.getDoctorId()).getBody();

                            ipdAdmissionsDTO.setPatient(patientInfo);
                            ipdAdmissionsDTO.setDoctor(doctorDetails);

                            return ipdAdmissionsDTO;
                        })
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList());
            }
        }
        return new ArrayList<>();
    }


    public List<IPDAdmissionsDetailsDTO> searchDischargedPatients (String searchTerm){
        if (searchTerm != null && (searchTerm.toLowerCase().startsWith("ipd") || searchTerm.toLowerCase().startsWith("pid"))) {
            PageRequest pageRequest = PageRequest.of(0, 1000, Sort.by(Sort.Order.desc("createdAt"))); // adjust size if needed
            List<HMS_TM_IPDAdmissions> admissions = ipdAdmissionsRepository
                    .findAllByIsActiveTrueAndDischargeDateIsNotNull(pageRequest)
                    .getContent();
            if (!admissions.isEmpty()) {
                admissions.stream()
                        .map(admission -> {
                            IPDAdmissionsDetailsDTO ipdAdmissionsDTO = modelMapper.map(admission, IPDAdmissionsDetailsDTO.class);
                            HMS_TM_Rooms room = roomsRepository.findByRoomIdAndIsActiveTrue(admission.getRoomId())
                                    .orElse(null);
                            if (room != null) {
                                ipdAdmissionsDTO.setRoom(modelMapper.map(room, RoomsDTO.class));
                            } else {
                                ipdAdmissionsDTO.setRoom(null);
                            }
                            IPDCombinedDTO.PatientDTO patientInfo = connectionInterface.getPatientById(admission.getPatientId())
                                    .getBody();
                            if (patientInfo == null) {
                                return null;
                            }
                            EmployeeDetails doctorDetails = adminManagementInterface.getEmployeeById(admission.getDoctorId()).getBody();
                            ipdAdmissionsDTO.setPatient(patientInfo);
                            ipdAdmissionsDTO.setDoctor(doctorDetails);
                            return ipdAdmissionsDTO;
                        })
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList());
            }else{
                return new ArrayList<>();
            }
        } else {
            ResponseEntity<List<IPDCombinedDTO.PatientDTO>> patientSearch = connectionInterface.getPatientListBySearchTerm(searchTerm);
            if (patientSearch.getBody() != null) {
                List<IPDCombinedDTO.PatientDTO> patients = patientSearch.getBody();
                List<String> patientIds = patients.stream()
                        .map(IPDCombinedDTO.PatientDTO::getPatientId)
                        .collect(Collectors.toList());
                List<HMS_TM_IPDAdmissions> admissions = ipdAdmissionsRepository.findAllByPatientIdInAndIsActiveTrueAndDischargeDateIsNotNull(patientIds);
                return admissions.stream()
                        .map(admission -> {
                            IPDAdmissionsDetailsDTO ipdAdmissionsDTO = modelMapper.map(admission, IPDAdmissionsDetailsDTO.class);
                            HMS_TM_Rooms room = roomsRepository.findByRoomIdAndIsActiveTrue(admission.getRoomId())
                                    .orElse(null);
                            if (room != null) {
                                ipdAdmissionsDTO.setRoom(modelMapper.map(room, RoomsDTO.class));
                            } else {
                                ipdAdmissionsDTO.setRoom(null);
                            }
                            IPDCombinedDTO.PatientDTO patientInfo = patients.stream()
                                    .filter(p -> p.getPatientId().equals(admission.getPatientId()))
                                    .findFirst()
                                    .orElse(null);
                            if (patientInfo == null) {
                                return null;
                            }
                            EmployeeDetails doctorDetails = adminManagementInterface.getEmployeeById(admission.getDoctorId()).getBody();
                            ipdAdmissionsDTO.setPatient(patientInfo);
                            ipdAdmissionsDTO.setDoctor(doctorDetails);
                            return ipdAdmissionsDTO;
                        })
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList());
            }

        }
        return new ArrayList<>();
    }


}

