package com.hms.services.patientmanagement.service;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.services.patientmanagement.configuration.AdminManagementInterface;
import com.hms.services.patientmanagement.controller.PatientRegistrationController;
import com.hms.services.patientmanagement.entity.HMS_TM_Appointments;
import com.hms.services.patientmanagement.entity.HMS_TM_Patients;
import com.hms.services.patientmanagement.exception.CustomException;
import com.hms.services.patientmanagement.model.AppointmentsDTO;
import com.hms.services.patientmanagement.model.AppointmentsDetails;
import com.hms.services.patientmanagement.model.EmployeeDetails;
import com.hms.services.patientmanagement.model.PatientsDTO;
import com.hms.services.patientmanagement.repository.AppointmentRepository;
import com.hms.services.patientmanagement.repository.EmergencyContactRepository;
import com.hms.services.patientmanagement.repository.PatientRepository;
import com.hms.services.patientmanagement.response.ApiResponse;
import com.hms.services.patientmanagement.response.AppointmentsResponse;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.validation.constraints.NotBlank;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
// Kafka disabled for local setup
//import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private static final Logger logger = LoggerFactory.getLogger(AppointmentService.class);

    private final AppointmentRepository appointmentRepository;
    private final ModelMapper modelMapper;
    private final EntityManager entityManager;
    private final PatientRepository patientRepository;
    private final AdminManagementInterface adminManagementInterface;
    // Kafka disabled for local setup
    //private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;
    private final PatientRegistrationController patientRegister;

    @Autowired
    public AppointmentService(final ModelMapper modelMapper, final PatientRepository patientRepository, final EmergencyContactRepository emergencyContactRepository,
                              final AppointmentRepository appointmentRepository, final EntityManager entityManager,final AdminManagementInterface adminManagementInterface,
                              //final KafkaTemplate<String, String> kafkaTemplate, 
                              final ObjectMapper objectMapper,final PatientRegistrationController patientRegister) {
        this.modelMapper = modelMapper;
        this.patientRepository = patientRepository;
//        this.emergencyContactRepository = emergencyContactRepository;
        this.appointmentRepository = appointmentRepository;
        this.entityManager = entityManager;
        this.adminManagementInterface = adminManagementInterface;
        //this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
        this.patientRegister = patientRegister;
    }

    public ApiResponse createAppointment(AppointmentsDTO appointments) {
        try {
            ThreadLocalRandom random = ThreadLocalRandom.current();
            //  Long appointmentId=random.nextLong(1, 9999999999L);
            HMS_TM_Appointments appointmentEntity = modelMapper.map(appointments, HMS_TM_Appointments.class);
            appointmentEntity.setCreatedAt(LocalDateTime.now());
            appointmentEntity.setIsActive(true);
            appointmentEntity.setTime(LocalTime.now());
            appointmentEntity.setCreatedBy("vijay");
            // appointmentEntity.setVersion(1);
            HMS_TM_Appointments savedAppointment = appointmentRepository.save(appointmentEntity);
            sendNotification(appointments.getDoctorId(),appointments.getPatientId(),appointments.getReasonForVisit());
            return new ApiResponse("success", "", "Create Appointment Successfully", appointments.getPatientId(), savedAppointment.getAppointmentId(), null, null);
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    private void sendNotification(String doctorId, String patientId,String reasonForVisit) {
        // Kafka disabled for local setup
        PatientsDTO patient= patientRegister.getPatientById(patientId).getBody();
        Map<String, String> event = new HashMap<>();
        event.put("doctorId", doctorId);
        event.put("title", "appointment");
        event.put("reasonForVisit", reasonForVisit);
        event.put("message", "Patient " + patient.getFirstName()+" "+patient.getLastName()+" ("+patientId+")"+" has booked an appointment");
        try {
            String eventMessage = objectMapper.writeValueAsString(event);
            // Kafka disabled - kafkaTemplate.send("patient-appointment-completed", eventMessage);
            logger.info("Appointment event (Kafka disabled): {}", eventMessage);
        } catch (Exception e) {
            logger.error("Error preparing appointment event", e);
        }
    }

    public ApiResponse deleteAppointment(String appointmentId) {
        HMS_TM_Appointments appointment = appointmentRepository.findByAppointmentIdAndIsActiveTrue(appointmentId)
                .orElseThrow(() -> new CustomException("Appointment Not Found", HttpStatus.NOT_FOUND));
        appointment.setIsActive(false);
        appointmentRepository.save(appointment);
        //appointmentRepository.delete(appointment);
        return new ApiResponse("success", "", "Record Deleted Successfully", String.valueOf(appointmentId), null, null, null);
    }

    public List<AppointmentsDetails> getAllAppointments(int page, int size) {
        try {
            Page<HMS_TM_Appointments> appointmentsPage = appointmentRepository.findAllByIsActiveTrue(
                    PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"))
            );
            List<HMS_TM_Appointments> appointments = appointmentsPage.getContent();
            if (appointments == null || appointments.isEmpty()) {
                return new ArrayList<>();
            }
//            final java.lang.reflect.Type targetListType = new TypeToken<List<AppointmentsDTO>>() {
//            }.getType();
//            return modelMapper.map(appointments, targetListType);
            List<AppointmentsDetails> appointmentsDTOList = appointments.stream()
                    .map(appointment -> {
                        AppointmentsDetails appointmentDTO = modelMapper.map(appointment, AppointmentsDetails.class);
                        PatientsDTO patientDTO = patientRepository
                                .findByPatientIdAndIsActiveTrue(appointmentDTO.getPatientId())
                                .map(patient -> modelMapper.map(patient, PatientsDTO.class)) // Using ModelMapper
                                .orElse(null);
                        EmployeeDetails doctorDetails = adminManagementInterface.getEmployeeById(appointment.getDoctorId()).getBody();
                        appointmentDTO.setDoctor(doctorDetails);
                        appointmentDTO.setPatient(patientDTO);
                        return appointmentDTO;
                    })
                    .collect(Collectors.toList());
            return appointmentsDTOList;
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    public AppointmentsDetails getAppointments(String appointmentId) {
        HMS_TM_Appointments appointments = appointmentRepository.findByAppointmentIdAndIsActiveTrue(appointmentId).get();
        if (appointments == null) {
            return null;
        }
        EmployeeDetails doctorDetails = adminManagementInterface.getEmployeeById(appointments.getDoctorId()).getBody();
        AppointmentsDetails details=modelMapper.map(appointments, AppointmentsDetails.class);
        details.setDoctor(doctorDetails);
        return details;
    }

    public AppointmentsDTO updateAppointments(String appointmentId, AppointmentsDTO appointments) {
        try {
            HMS_TM_Appointments updateAppointment = appointmentRepository.findByAppointmentIdAndIsActiveTrue(appointmentId)
                    .orElseThrow(() -> new CustomException("Appointment Not Found", HttpStatus.NOT_FOUND));
            updateAppointment.setDoctorId(appointments.getDoctorId());
            updateAppointment.setRegistrationFees(appointments.getRegistrationFees());
            updateAppointment.setAppointmentTime(appointments.getAppointmentTime());
            updateAppointment.setPaymentType(appointments.getPaymentType());
            updateAppointment.setTokenNo(appointments.getTokenNo());
            updateAppointment.setShift(appointments.getShift());
            updateAppointment.setSpecialist(appointments.getSpecialist());
            updateAppointment.setSlots(appointments.getSlots());
            updateAppointment.setReasonForVisit(appointments.getReasonForVisit());
            updateAppointment.setStatus(appointments.getStatus());
            updateAppointment.setAppointmentDate(appointments.getAppointmentDate());
            updateAppointment.setTime(appointments.getTime());
            updateAppointment.setLastModifiedAt(LocalDateTime.now());
            updateAppointment.setLastModifiedBy("vijay");

            HMS_TM_Appointments savedAppointment = appointmentRepository.save(updateAppointment);
            return modelMapper.map(savedAppointment, AppointmentsDTO.class);
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    public List<AppointmentsResponse> getIndividualAppointments(String patientId, String appointmentDate, String doctorId, String appointmentId, String status, int page, int size) {
        try {
            CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
            CriteriaQuery<HMS_TM_Appointments> criteriaQuery = criteriaBuilder.createQuery(HMS_TM_Appointments.class);
            Root<HMS_TM_Appointments> root = criteriaQuery.from(HMS_TM_Appointments.class);
            Predicate predicate = criteriaBuilder.conjunction();

            if (patientId != null && !patientId.isEmpty()) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("patientId"), patientId));
            }
            if (appointmentDate != null && !appointmentDate.isEmpty()) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("appointmentDate"), appointmentDate));
            }
            if (doctorId != null) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("doctorId"), doctorId));
            }
            if (appointmentId != null) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("appointmentId"), appointmentId));
            }
            if (status != null && !status.isEmpty()) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("status"), status));
            }

            predicate = criteriaBuilder.and(predicate, criteriaBuilder.isTrue(root.get("isActive")));
            criteriaQuery.where(predicate);

            TypedQuery<HMS_TM_Appointments> query = entityManager.createQuery(criteriaQuery);
            query.setFirstResult(page * size);
            query.setMaxResults(size);

            List<HMS_TM_Appointments> appointmentsList = query.getResultList();

            return appointmentsList.stream()
                    .map(appointment -> patientRepository.findByPatientIdAndIsActiveTrue(appointment.getPatientId())
                            .map(patient -> {
                                AppointmentsResponse response = modelMapper.map(appointment, AppointmentsResponse.class);
                                EmployeeDetails doctorDetails = adminManagementInterface.getEmployeeById(response.getDoctorId()).getBody();
                                PatientsDTO responseDto = modelMapper.map(patient, PatientsDTO.class);
                                response.setDoctor(doctorDetails);
                                response.setPatients(responseDto);
                                return response;
                            })
                            .orElse(null))
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());

        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public List<AppointmentsResponse> getIndividualAppointmentsFilter(
            String patientId,
            String appointmentDate,
            String doctorId,
            String status,
            String timeDuration,
            LocalDate fromDate,
            LocalDate toDate
    ) {
        LocalDateTime startDate;
        LocalDateTime endDate = LocalDateTime.now();

        // Normalize the filterType
        timeDuration = timeDuration.toUpperCase();

        switch (timeDuration) {
            case "DAILY":
                startDate = endDate.toLocalDate().atStartOfDay();
                endDate = startDate.plusDays(1).minusSeconds(1);
                break;
//            case "yesterday":
//                startDate = endDate.minusDays(1).toLocalDate().atStartOfDay();
//                endDate = startDate.plusDays(1).minusSeconds(1);
//                break;
            case "WEEKLY":
                startDate = endDate.minusDays(6).toLocalDate().atStartOfDay();
                endDate = endDate.with(LocalTime.MAX);
                break;
            case "MONTHLY":
                startDate = endDate.with(TemporalAdjusters.firstDayOfMonth()).toLocalDate().atStartOfDay();
                endDate = endDate.with(LocalTime.MAX);
                break;
            case "YEARLY":
                startDate = endDate.withDayOfYear(1).toLocalDate().atStartOfDay();
                endDate = endDate.with(TemporalAdjusters.lastDayOfYear()).with(LocalTime.MAX);
                break;
            case "LAST_YEAR":
                LocalDate lastYearDate = endDate.toLocalDate().minusYears(1);
                startDate = lastYearDate.withDayOfYear(1).atStartOfDay();
                endDate = lastYearDate.with(TemporalAdjusters.lastDayOfYear()).atTime(23, 59, 59);
                break;
            case "CUSTOM":
                if (fromDate == null || toDate == null) {
                    throw new IllegalArgumentException("fromDate and toDate are required for 'range' filter.");
                }
                startDate = fromDate.atStartOfDay();
                endDate = toDate.atTime(23, 59, 59);
                break;
            default:
                throw new IllegalArgumentException("Invalid filterType. Use 'daily', 'yesterday', 'weekly', 'monthly', or 'range'.");
        }

        try {
            CriteriaBuilder cb = entityManager.getCriteriaBuilder();
            CriteriaQuery<HMS_TM_Appointments> cq = cb.createQuery(HMS_TM_Appointments.class);
            Root<HMS_TM_Appointments> root = cq.from(HMS_TM_Appointments.class);

            List<Predicate> predicates = new ArrayList<>();

            if (patientId != null && !patientId.isEmpty()) {
                predicates.add(cb.equal(root.get("patientId"), patientId));
            }
            if (doctorId != null && !doctorId.isEmpty()) {
                predicates.add(cb.equal(root.get("doctorId"), doctorId));
            }
            if (appointmentDate != null && !appointmentDate.isEmpty()) {
                predicates.add(cb.equal(cb.function("DATE", LocalDate.class, root.get("appointmentDate")), LocalDate.parse(appointmentDate)));
            }
            if (status != null && !status.isEmpty()) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (startDate != null && endDate != null) {
                predicates.add(cb.between(root.get("createdAt"), startDate, endDate));
            }

            predicates.add(cb.isTrue(root.get("isActive")));

            cq.where(predicates.toArray(new Predicate[0]));

            List<HMS_TM_Appointments> appointments = entityManager.createQuery(cq).getResultList();

            return appointments.stream()
                    .map(appointment -> patientRepository.findByPatientIdAndIsActiveTrue(appointment.getPatientId())
                            .map(patient -> {
                                AppointmentsResponse response = modelMapper.map(appointment, AppointmentsResponse.class);
                                EmployeeDetails doctorDetails = adminManagementInterface.getEmployeeById(response.getDoctorId()).getBody();
                                PatientsDTO responseDto = modelMapper.map(patient, PatientsDTO.class);
                                response.setDoctor(doctorDetails);
                                response.setPatients(responseDto);
                                return response;
                            })
                            .orElse(null))
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            throw new RuntimeException("Error fetching appointments", e);
        }
    }


}

