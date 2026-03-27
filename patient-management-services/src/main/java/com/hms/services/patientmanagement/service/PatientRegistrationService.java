package com.hms.services.patientmanagement.service;

import com.hms.services.patientmanagement.configuration.TpaManagementInterface;
import com.hms.services.patientmanagement.entity.HMS_TM_EmergencyContacts;
import com.hms.services.patientmanagement.entity.HMS_TM_InsuranceProviders;
import com.hms.services.patientmanagement.entity.HMS_TM_Patients;
import com.hms.services.patientmanagement.exception.CustomException;
import com.hms.services.patientmanagement.model.*;
import com.hms.services.patientmanagement.repository.EmergencyContactRepository;
import com.hms.services.patientmanagement.repository.InsuranceProviderRepository;
import com.hms.services.patientmanagement.repository.PatientRepository;
import com.hms.services.patientmanagement.response.ApiResponse;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import org.json.simple.JSONObject;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class PatientRegistrationService {


    private final ModelMapper modelMapper;
    private final PatientRepository patientRepository;
    private final EmergencyContactRepository emergencyContactRepository;
    private final InsuranceProviderRepository insuranceProviderRepository;
    private final EntityManager entityManager;
    private final TpaManagementInterface tpaManagementInterface;


    @Autowired
    public PatientRegistrationService(final ModelMapper modelMapper, final PatientRepository patientRepository, final EmergencyContactRepository emergencyContactRepository,
                                      final InsuranceProviderRepository insuranceProviderRepository,final EntityManager entityManager,final TpaManagementInterface tpaManagementInterface) {
        this.modelMapper = modelMapper;
        this.patientRepository = patientRepository;
        this.emergencyContactRepository = emergencyContactRepository;
        this.insuranceProviderRepository = insuranceProviderRepository;
        this.entityManager = entityManager;
        this.tpaManagementInterface = tpaManagementInterface;
    }


    @Transactional
    public ApiResponse registerPatient(PatientsDTO patientsDTO) {
        try {
            String patientId = generatePatientId();
            patientsDTO.setPatientId(patientId);
            HMS_TM_Patients patient = modelMapper.map(patientsDTO, HMS_TM_Patients.class);
            patient.setCreatedAt(LocalDateTime.now());
            patient.setCreatedBy("vijay");
            patient.setDate(new Date());
            patient.setIsActive(true);
            patient.setTime(LocalTime.now());
            List<HMS_TM_EmergencyContacts> emergencyContactsList = null;
            if (patientsDTO.getEmergencyContacts() != null && !patientsDTO.getEmergencyContacts().isEmpty()) {
                emergencyContactsList = patientsDTO.getEmergencyContacts().stream()
                        .map(contactDTO -> {
                            contactDTO.setPatientId(patientId);
                            contactDTO.setIsActive(true);
                            return modelMapper.map(contactDTO, HMS_TM_EmergencyContacts.class);
                        })
                        .collect(Collectors.toList());
            }
            patientRepository.save(patient);
            if (emergencyContactsList != null && !emergencyContactsList.isEmpty()) {
                emergencyContactRepository.saveAll(emergencyContactsList);
            }
            return new ApiResponse("success", "", "Record Saved Successfully", patientId, null,null,null);
        }catch(Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    private String generatePatientId() {
       // String year = String.valueOf(LocalDate.now().getYear());
        Optional<HMS_TM_Patients> lastPatient = patientRepository.findTopByOrderByCreatedAtDesc();
        long nextSequenceNumber = lastPatient.map(p -> extractSequenceNumber(p.getPatientId()) + 1).orElse(1L);
        String formattedSequence = String.format("%05d", nextSequenceNumber);
        return "PID" +formattedSequence;
    }

    private Long extractSequenceNumber(String patientId) {
        String numericPart = patientId.substring(3);
        return Long.parseLong(numericPart);
    }

    @Transactional
    public ApiResponse deletePatient(String id) {
        Optional<HMS_TM_Patients> patientOptional = patientRepository.findByPatientIdAndIsActiveTrue(id);
        if (patientOptional.isEmpty()) {
            throw new CustomException("Patient_ID "+id+"not found", HttpStatus.BAD_REQUEST);
        }
        List<HMS_TM_EmergencyContacts> contact = emergencyContactRepository.findAllByPatientIdAndIsActiveTrue(id);
        if (contact == null || contact.isEmpty()) {
            throw new CustomException("Patient_ID " + id + " not found", HttpStatus.BAD_REQUEST);
        }
        patientOptional.get().setIsActive(false);
        for (HMS_TM_EmergencyContacts emergencyContact : contact) {
            emergencyContact.setIsActive(false);
        }
        patientRepository.save(patientOptional.get());
        emergencyContactRepository.saveAll(contact);
        return new ApiResponse("success", "", "Record Deleted Successfully", id, null,null,null);
    }


    public List<PatientsDTO> getAllPatients(int page, int size) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
            Page<HMS_TM_Patients> allPatientsPage = patientRepository.findAllByIsActiveTrue(pageable);
            List<HMS_TM_Patients> allPatients = allPatientsPage.getContent();
            List<String> patientIds = allPatients.stream()
                    .map(HMS_TM_Patients::getPatientId)
                    .collect(Collectors.toList());
            List<String> insuranceIds = allPatients.stream()
                    .map(HMS_TM_Patients::getInsuranceId)
                    .collect(Collectors.toList());
            List<HMS_TM_EmergencyContacts> contactDetails = emergencyContactRepository.findAllByPatientIdInAndIsActiveTrue(patientIds);
            List<HMS_TM_InsuranceProviders> insuranceProvidersList = insuranceProviderRepository.findAllByPatientIdInAndIsActiveTrue(insuranceIds);

            return allPatients.stream()
                    .map(patient -> {
                        PatientsDTO patientDto = modelMapper.map(patient, PatientsDTO.class);
                        List<EmergencyContactsDTO> emergencyContactsForPatient = contactDetails.stream()
                                .filter(contact -> contact.getPatientId().equals(patient.getPatientId()))
                                .map(contact -> modelMapper.map(contact, EmergencyContactsDTO.class))
                                .collect(Collectors.toList());
                        patientDto.setEmergencyContacts(emergencyContactsForPatient);
                        Optional<HMS_TM_InsuranceProviders> insuranceProviderForPatient = insuranceProvidersList.stream()
                                .filter(insuranceProvider -> insuranceProvider.getPatientId().equals(patient.getPatientId()))
                                .findFirst();

                        insuranceProviderForPatient.ifPresent(insuranceProvider -> {
                            InsuranceProvidersDTO insuranceProvidersDTO = modelMapper.map(insuranceProvider, InsuranceProvidersDTO.class);
                            patientDto.setInsuranceProviders(insuranceProvidersDTO);
                        });

                        return patientDto;
                    })
                    .collect(Collectors.toList());
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    public PatientsDTO getPatientById(String id) {
        Optional<HMS_TM_Patients> patientOptional = patientRepository.findByPatientIdAndIsActiveTrue(id);
        if (patientOptional.isPresent()) {
            HMS_TM_Patients patient = patientOptional.get();
            List<HMS_TM_EmergencyContacts> contactDetails = emergencyContactRepository.findAllByPatientIdAndIsActiveTrue(id);
//            Optional<HMS_TM_InsuranceProviders> insuranceProviderOptional = insuranceProviderRepository.findByInsuranceIdAndIsActiveTrue(patientOptional.get().getInsuranceId());
            PatientsDTO patientDetails = modelMapper.map(patient, PatientsDTO.class);
            List<EmergencyContactsDTO> emergencyContactsDTOs = contactDetails.stream()
                    .map(contact -> modelMapper.map(contact, EmergencyContactsDTO.class))
                    .collect(Collectors.toList());
            patientDetails.setEmergencyContacts(emergencyContactsDTOs);
            if(patient.getInsuranceId() != null) {
                TPADetailsDTO insuranceProviderOptional = tpaManagementInterface.getTpaDetailsById(patientOptional.get().getInsuranceId()).getBody();
                if(insuranceProviderOptional!=null) {
                    InsuranceProvidersDTO tpa = new InsuranceProvidersDTO();
                    tpa.setInsuranceId(insuranceProviderOptional.getId());
                    tpa.setProviderName(insuranceProviderOptional.getTpaName());
                    tpa.setPolicyNumber(insuranceProviderOptional.getCode());
//                InsuranceProvidersDTO insuranceProvidersDTO = modelMapper.map(insuranceProviderOptional, InsuranceProvidersDTO.class);
                    patientDetails.setInsuranceProviders(tpa);
                }
            }
            return patientDetails;
        }
        return null;
    }

    @Transactional
    public JSONObject updatePatientById(String id, PatientsDTO patientDto) {
        try {
            Optional<HMS_TM_Patients> patientOptional = patientRepository.findByIdAndIsActiveTrue(id);
            if (!patientOptional.isPresent()) {
                throw new CustomException("Patient with ID " + id + " not found.", HttpStatus.NOT_FOUND);
            }
            HMS_TM_Patients existingPatient = patientOptional.get();
            patientDto.setId(existingPatient.getId());
            patientDto.setPatientId(existingPatient.getPatientId());
            existingPatient.setCreatedAt(LocalDateTime.now());
            existingPatient.setCreatedBy(null);
            existingPatient.setDate(new Date());
            existingPatient.setIsActive(true);
            existingPatient.setTime(LocalTime.now());
            modelMapper.map(patientDto, existingPatient);
            patientRepository.save(existingPatient);
            if (patientDto.getEmergencyContacts() != null && !patientDto.getEmergencyContacts().isEmpty()) {
                for (EmergencyContactsDTO contactDto : patientDto.getEmergencyContacts()) {
                    HMS_TM_EmergencyContacts existingContacts = emergencyContactRepository.findAllByEmergencyContactIdAndIsActiveTrue(contactDto.getEmergencyContactId());
                    if (existingContacts!=null) {
                        existingContacts.setContactName(contactDto.getContactName());
                        existingContacts.setRelationShip(contactDto.getRelationShip());
                        existingContacts.setContactNumber(contactDto.getContactNumber());
                        emergencyContactRepository.save(existingContacts);
                    } else {
                        HMS_TM_EmergencyContacts newContact = modelMapper.map(contactDto, HMS_TM_EmergencyContacts.class);
                        newContact.setPatientId(patientOptional.get().getPatientId());
                        newContact.setContactName(contactDto.getContactName());
                        newContact.setRelationShip(contactDto.getRelationShip());
                        newContact.setContactNumber(contactDto.getContactNumber());
                        newContact.setIsActive(true);
                        emergencyContactRepository.save(newContact);
                    }
                }
            }
            JSONObject obj = new JSONObject();
            obj.put("Message", "Updated Successfully");
            return obj;
        }catch(Exception ex){
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public List<PatientsDTO> getIndividualPatient(String patientId, String dateOfBirth, String contactNumber, String email, String firstName, String lastName, int page, int size) {
        try {
            CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
            CriteriaQuery<HMS_TM_Patients> criteriaQuery = criteriaBuilder.createQuery(HMS_TM_Patients.class);
            Root<HMS_TM_Patients> root = criteriaQuery.from(HMS_TM_Patients.class);
            Predicate predicate = criteriaBuilder.conjunction();
            predicate = criteriaBuilder.and(predicate, criteriaBuilder.isTrue(root.get("isActive")));

            if (patientId != null) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("patientId"), patientId));
            }
            if (dateOfBirth != null) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("dateOfBirth"), dateOfBirth));
            }
            if (contactNumber != null) {
                String normalizedContactNumber = normalizeContactNumber(contactNumber);
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.or(
                                criteriaBuilder.equal(
                                        normalizeContactNumberField(root.get("contactNumber")), normalizedContactNumber
                                ),
                                criteriaBuilder.equal(
                                        normalizeContactNumberField(root.get("contactNumber")), "91" + normalizedContactNumber
                                )
                        )
                );
            }
            if (email != null) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("email"), email));
            }
            if (firstName != null) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.like(root.get("firstName"), "%" + firstName + "%"));
            }
            if (lastName != null) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.like(root.get("lastName"), "%" + lastName + "%"));
            }
            criteriaQuery.select(root).where(predicate);
            TypedQuery<HMS_TM_Patients> query = entityManager.createQuery(criteriaQuery);
            query.setFirstResult(page * size);
            query.setMaxResults(size);
            List<HMS_TM_Patients> patientEntities = query.getResultList();
            if (!patientEntities.isEmpty()) {
                List<PatientsDTO> patientDtos = new ArrayList<>();
                for (HMS_TM_Patients patientEntity : patientEntities) {
                    PatientsDTO patientDto = modelMapper.map(patientEntity, PatientsDTO.class);
                    PageRequest pageRequest = PageRequest.of(0, size);
                    Page<HMS_TM_EmergencyContacts> emergencyContactsPage = emergencyContactRepository.findAllByPatientIdAndIsActiveTrue(patientEntity.getPatientId(), pageRequest);
                    List<HMS_TM_EmergencyContacts> emergencyContacts = emergencyContactsPage.getContent();
                    List<EmergencyContactsDTO> emergencyContactsDto = emergencyContacts.stream()
                            .map(contact -> modelMapper.map(contact, EmergencyContactsDTO.class))
                            .collect(Collectors.toList());
                    patientDto.setEmergencyContacts(emergencyContactsDto);
                    Optional<HMS_TM_InsuranceProviders> insuranceProviderOptional = insuranceProviderRepository.findByInsuranceIdAndIsActiveTrue(patientEntity.getInsuranceId());
                    insuranceProviderOptional.ifPresent(insuranceProvider -> {
                        InsuranceProvidersDTO insuranceProvidersDTO = modelMapper.map(insuranceProvider, InsuranceProvidersDTO.class);
                        patientDto.setInsuranceProviders(insuranceProvidersDTO);
                    });

                    patientDtos.add(patientDto);
                }
                return patientDtos;
            }
            return new ArrayList<>();
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    private String normalizeContactNumber(String contactNumber) {
        return contactNumber.replaceAll("[^\\d]", ""); // Remove all non-digit characters
    }

    private Expression<String> normalizeContactNumberField(Expression<String> contactNumberField) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        return criteriaBuilder.function("REPLACE", String.class,
                criteriaBuilder.function("REPLACE", String.class,
                        criteriaBuilder.function("REPLACE", String.class, contactNumberField,
                                criteriaBuilder.literal("+"), criteriaBuilder.literal("")),
                        criteriaBuilder.literal("-"), criteriaBuilder.literal("")),
                criteriaBuilder.literal(" "), criteriaBuilder.literal(""));
    }


    public List<SearchPatientDTO>  getPatientsBySearchTerm(String searchTerm) {
        return patientRepository.findPatientsBySearchTermIsActiveTrue(searchTerm);

    }

    public String storePrescription(String id, MultipartFile file) throws IOException {
        try {
            HMS_TM_Patients patient = patientRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Patient not found with id: " + id));
            if (file != null && !file.isEmpty()) {
                String encodedAttachment = Base64.getEncoder().encodeToString(file.getBytes());
                patient.setOldPrescription(encodedAttachment);
            }
            patientRepository.save(patient);
        }catch(Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
        return "Uploaded Successfully";
    }


    public List<PatientsDTO> getPatientsByPatientIds(List<String> patientIds) {
        List<HMS_TM_Patients> patients = patientRepository.findAllByPatientIdInAndIsActiveTrue(patientIds);

        List<PatientsDTO> patientDTOs = new ArrayList<>();

        for (HMS_TM_Patients patient : patients) {
            PatientsDTO patientDetails = modelMapper.map(patient, PatientsDTO.class);

            // Emergency Contacts
            List<HMS_TM_EmergencyContacts> contactDetails = emergencyContactRepository.findAllByPatientIdAndIsActiveTrue(patient.getPatientId());
            List<EmergencyContactsDTO> emergencyContactsDTOs = contactDetails.stream()
                    .map(contact -> modelMapper.map(contact, EmergencyContactsDTO.class))
                    .collect(Collectors.toList());
            patientDetails.setEmergencyContacts(emergencyContactsDTOs);

            // Insurance (TPA) Details
            if (patient.getInsuranceId() != null) {
                TPADetailsDTO insuranceProviderOptional = tpaManagementInterface.getTpaDetailsById(patient.getInsuranceId()).getBody();
                if (insuranceProviderOptional != null) {
                    InsuranceProvidersDTO tpa = new InsuranceProvidersDTO();
                    tpa.setInsuranceId(insuranceProviderOptional.getId());
                    tpa.setProviderName(insuranceProviderOptional.getTpaName());
                    tpa.setPolicyNumber(insuranceProviderOptional.getCode());
                    patientDetails.setInsuranceProviders(tpa);
                }
            }

            patientDTOs.add(patientDetails);
        }

        return patientDTOs;
    }

    public List<PatientsDTO> getPatientsBySearch(String searchTerm) {
        List<HMS_TM_Patients> patients = patientRepository.findPatientsBySearchTerm(searchTerm);

        List<PatientsDTO> patientDTOs = new ArrayList<>();

        for (HMS_TM_Patients patient : patients) {
            PatientsDTO patientDetails = modelMapper.map(patient, PatientsDTO.class);

            // Emergency Contacts
            List<HMS_TM_EmergencyContacts> contactDetails = emergencyContactRepository.findAllByPatientIdAndIsActiveTrue(patient.getPatientId());
            List<EmergencyContactsDTO> emergencyContactsDTOs = contactDetails.stream()
                    .map(contact -> modelMapper.map(contact, EmergencyContactsDTO.class))
                    .collect(Collectors.toList());
            patientDetails.setEmergencyContacts(emergencyContactsDTOs);

            // Insurance (TPA) Details
            if (patient.getInsuranceId() != null) {
                TPADetailsDTO insuranceProviderOptional = tpaManagementInterface.getTpaDetailsById(patient.getInsuranceId()).getBody();
                if (insuranceProviderOptional != null) {
                    InsuranceProvidersDTO tpa = new InsuranceProvidersDTO();
                    tpa.setInsuranceId(insuranceProviderOptional.getId());
                    tpa.setProviderName(insuranceProviderOptional.getTpaName());
                    tpa.setPolicyNumber(insuranceProviderOptional.getCode());
                    patientDetails.setInsuranceProviders(tpa);
                }
            }

            patientDTOs.add(patientDetails);
        }

        return patientDTOs;
    }


}









//    public ApiResponse registerPatient(PatientsDTO patientsDTO) {
//        String patientId = generatePatientId();
//        patientsDTO.setPatientId(patientId);
//        HMS_TM_Patients patient = modelMapper.map(patientsDTO, HMS_TM_Patients.class);
//        Random random = new Random();
//        HMS_TM_Appointments appointments = null;
//        Long appointmentId=null;
//        if (patientsDTO.getAppointments() != null && !patientsDTO.getAppointments().isEmpty()){
//            appointmentId = random.nextLong(1, 9999999999L);
//            AppointmentsDTO app = patientsDTO.getAppointments().get(0);
//            app.setAppointmentId(appointmentId);
//            app.setPatientId(patientId);
//            appointments = modelMapper.map(app, HMS_TM_Appointments.class);
//    }
//        List<HMS_TM_EmergencyContacts> emergencyContactsList =null;
//        if(patientsDTO.getEmergencyContacts()!=null && !patientsDTO.getEmergencyContacts().isEmpty()) {
//            emergencyContactsList =
//                    patientsDTO.getEmergencyContacts().stream()
//                            .map(contactDTO -> {
//                                contactDTO.setEmergencyContactId(random.nextLong(1, 9999999999L));
//                                contactDTO.setPatientId(patientId);
//                                HMS_TM_EmergencyContacts emergencyContact = modelMapper.map(contactDTO, HMS_TM_EmergencyContacts.class);
//                                return emergencyContact;
//                            })
//                            .collect(Collectors.toList());
//        }
//        patientRepository.save(patient);
//        emergencyContactRepository.saveAll(emergencyContactsList);
//        appointmentRepository.save(appointments);
//        return new ApiResponse("success", "", "Record Saved Successfully", patientId, appointmentId);
//    }
//
//    private String generatePatientId() {
//        String year = String.valueOf(LocalDate.now().getYear());
//        Optional<HMS_TM_Patients> lastPatient = patientRepository.findTopByOrderByIdDesc();
//        int nextSequenceNumber = lastPatient.map(p -> extractSequenceNumber(p.getPatientId()) + 1).orElse(1);
//        String formattedSequence = String.format("%05d", nextSequenceNumber);
//        return "HMS" + year + formattedSequence;
//    }
//    private Integer extractSequenceNumber(String patientId) {
//            return Integer.parseInt(patientId.substring(patientId.length() - 5));
//        }



