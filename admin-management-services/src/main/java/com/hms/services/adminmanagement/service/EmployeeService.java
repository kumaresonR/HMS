package com.hms.services.adminmanagement.service;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.services.adminmanagement.configuration.LoginManagementInterface;
import com.hms.services.adminmanagement.configuration.UserUtils;
import com.hms.services.adminmanagement.entity.*;
import com.hms.services.adminmanagement.exceptionhandler.CustomException;
import com.hms.services.adminmanagement.model.*;
import com.hms.services.adminmanagement.repository.*;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.*;
import jakarta.transaction.Transactional;
import org.apache.kafka.common.errors.ResourceNotFoundException;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import javax.management.relation.Role;
import java.io.IOException;

import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class EmployeeService {

    private static final Logger logger = LoggerFactory.getLogger(EmployeeService.class);

    @Autowired
    private HMS_TM_EmployeeRepository tmEmployeeRepository;

    @Autowired
    private HMS_TW_EmployeeRepository twEmployeeRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PayrollRepository payrollRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private HMS_TM_DepartmentRepository departmentRepository;

    @Autowired
    private TimelineRepository timelineRepository;

    @Autowired
    private LoginManagementInterface loginInterface;

    @Autowired
    private HMS_TM_DepartmentRepository tmDepartmentRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Autowired
    private EntityManager entityManager;


    public HMS_TW_Employee saveEmployeeInTW(HMS_TW_Employee employee,
                                            MultipartFile photoFile,
                                            MultipartFile resumeFile,
                                            MultipartFile joiningLetterFile,
                                            MultipartFile resignationLetterFile,
                                            MultipartFile otherDocumentsFile) throws IOException {

//        HMS_TM_Role role = roleRepository.findById(employee.getRoleId())
//                .orElseThrow(() -> new RuntimeException("Role not found with id: " + employee.getRoleId()));

        String staffNumber = generateStaffNumber();
        employee.setStaffId(staffNumber);

        handleFileUploads(employee, photoFile, resumeFile, joiningLetterFile, resignationLetterFile, otherDocumentsFile);

        return twEmployeeRepository.save(employee);
    }

    private void handleFileUploads(HMS_TW_Employee employee,
                                   MultipartFile photoFile,
                                   MultipartFile resumeFile,
                                   MultipartFile joiningLetterFile,
                                   MultipartFile resignationLetterFile,
                                   MultipartFile otherDocumentsFile) throws IOException {
        if (photoFile != null && !photoFile.isEmpty()) {
            String encodedPhoto = Base64.getEncoder().encodeToString(photoFile.getBytes());
            employee.setPhoto(encodedPhoto);
        }

        if (resumeFile != null && !resumeFile.isEmpty()) {
            String encodedResume = Base64.getEncoder().encodeToString(resumeFile.getBytes());
            employee.setResume(encodedResume);
        }

        if (joiningLetterFile != null && !joiningLetterFile.isEmpty()) {
            String encodedJoiningLetter = Base64.getEncoder().encodeToString(joiningLetterFile.getBytes());
            employee.setJoiningLetter(encodedJoiningLetter);
        }

        if (resignationLetterFile != null && !resignationLetterFile.isEmpty()) {
            String encodedResignationLetter = Base64.getEncoder().encodeToString(resignationLetterFile.getBytes());
            employee.setResignationLetter(encodedResignationLetter);
        }

        if (otherDocumentsFile != null && !otherDocumentsFile.isEmpty()) {
            String encodedOtherDocuments = Base64.getEncoder().encodeToString(otherDocumentsFile.getBytes());
            employee.setOtherDocuments(encodedOtherDocuments);
        }
    }

//    private String generateStaffNumber() {
//        String prefix = "HMS";
//        Long count = twEmployeeRepository.count();
//        int nextId = count.intValue() + 1;
//        return String.format("%s%03d", prefix, nextId);
//    }

    private String generateStaffNumber() {
        String prefix = "HMS";

        String lastStaffId = twEmployeeRepository.findMaxStaffId();

        int nextId = 1;
        if (lastStaffId != null && lastStaffId.startsWith(prefix)) {
            String numericPart = lastStaffId.substring(prefix.length());
            nextId = Integer.parseInt(numericPart) + 1;
        }

        return String.format("%s%03d", prefix, nextId);
    }


//    @Transactional
//    public HMS_TW_Employee getEmployeeByIds(String id) {
//        return twEmployeeRepository.findByEmployeeIdAndExitedFalse(id)
//                .orElse(null);
//    }
//
//    @Transactional
//    public List<HMS_TW_Employee> getAllEmployees() {
//        return twEmployeeRepository.findByExitedFalse();
//    }

    @Transactional
    public List<TWEmployeeDTOForAllModules> getAllEmployees() {
        List<HMS_TW_Employee> employees = twEmployeeRepository.findByExitedFalse();

        return employees.stream().map(employee -> {
            HMS_TM_Role role = roleRepository.findById(employee.getRoleId())
                    .orElseThrow(() -> new RuntimeException("Role not found for ID: " + employee.getRoleId()));

            String departmentName = "Unknown Department";
            if (employee.getDepartmentId() != null) {
                Optional<HMS_TM_Department> department = departmentRepository.findById(employee.getDepartmentId());
                if (department.isPresent()) {
                    departmentName = department.get().getName();
                }
            }

            RolesDTO rolesDTO = new RolesDTO();
            rolesDTO.setRoleId(role.getRoleId());
            rolesDTO.setRoleName(role.getRoleName());
            rolesDTO.setRoleDescription(role.getDescription());

            return new TWEmployeeDTOForAllModules(employee, departmentName, rolesDTO);
        }).toList();
    }

    @Transactional
    public TWEmployeeDTOForAllModules getEmployeeByIds(String id) {
        HMS_TW_Employee employee = twEmployeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found for ID: " + id));

        HMS_TM_Role role = roleRepository.findById(employee.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found for ID: " + employee.getRoleId()));

        String departmentName = "Unknown Department";
        if (employee.getDepartmentId() != null) {
            Optional<HMS_TM_Department> department = departmentRepository.findById(employee.getDepartmentId());
            if (department.isPresent()) {
                departmentName = department.get().getName();
            }
        }

        RolesDTO rolesDTO = new RolesDTO();
        rolesDTO.setRoleId(role.getRoleId());
        rolesDTO.setRoleName(role.getRoleName());
        rolesDTO.setRoleDescription(role.getDescription());

        return new TWEmployeeDTOForAllModules(employee, departmentName, rolesDTO);
    }


    @Transactional
    public HMS_TM_Employee approveEmployee(String id) throws MessagingException {
        try {
            HMS_TW_Employee twEmployee = twEmployeeRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Employee not found in TW with id: " + id));

            if ("UNAUTHORIZED".equals(twEmployee.getAuthStat())) {
                HMS_TM_Employee tmEmployee = new HMS_TM_Employee();
                tmEmployee.setEmployeeId(twEmployee.getEmployeeId());
                tmEmployee.setPassword(tmEmployee.getPassword());
                tmEmployee.setStaffId(twEmployee.getStaffId());
                tmEmployee.setReporterId(twEmployee.getReporterId());
                tmEmployee.setFirstName(twEmployee.getFirstName());
                tmEmployee.setLastName(twEmployee.getLastName());
                tmEmployee.setRoleId(twEmployee.getRoleId());
                tmEmployee.setPassword(twEmployee.getPassword());
                tmEmployee.setDesignation(twEmployee.getDesignation());
                tmEmployee.setAuthStat("AUTHORIZED");
                tmEmployee.setRecordStat("OPENED");
                tmEmployee.setGender(twEmployee.getGender());
                tmEmployee.setDateOfBirth(twEmployee.getDateOfBirth());
                tmEmployee.setDateOfJoining(twEmployee.getDateOfJoining());
                tmEmployee.setEmail(twEmployee.getEmail());
                tmEmployee.setPhone(twEmployee.getPhone());
                tmEmployee.setMaritalStatus(twEmployee.getMaritalStatus());
                tmEmployee.setDoctorFee(twEmployee.getDoctorFee());
                tmEmployee.setPhoto(twEmployee.getPhoto());
                tmEmployee.setDepartmentId(twEmployee.getDepartmentId());
                tmEmployee.setFatherName(twEmployee.getFatherName());
                tmEmployee.setMotherName(twEmployee.getMotherName());
                tmEmployee.setBloodGroup(twEmployee.getBloodGroup());
                tmEmployee.setNationalIdNumber(twEmployee.getNationalIdNumber());
                tmEmployee.setPanNumber(twEmployee.getPanNumber());
                tmEmployee.setLocalIdNumber(twEmployee.getLocalIdNumber());
                tmEmployee.setSpecialist(twEmployee.getSpecialist());
                tmEmployee.setSpecialization(twEmployee.getSpecialization());
                tmEmployee.setNote(twEmployee.getNote());
                tmEmployee.setQualification(twEmployee.getQualification());
                tmEmployee.setWorkExperience(twEmployee.getWorkExperience());
                tmEmployee.setReferenceContact(twEmployee.getReferenceContact());
                tmEmployee.setCurrentAddress(twEmployee.getCurrentAddress());
                tmEmployee.setPermanentAddress(twEmployee.getPermanentAddress());
                tmEmployee.setModNo(twEmployee.getModNo());

                // Payroll Information
                tmEmployee.setEpfNumber(twEmployee.getEpfNumber());
                tmEmployee.setBasicSalary(twEmployee.getBasicSalary());
                tmEmployee.setContractType(twEmployee.getContractType());
                tmEmployee.setWorkShift(twEmployee.getWorkShift());
                tmEmployee.setWorkLocation(twEmployee.getWorkLocation());

                // Leave Details
                tmEmployee.setCasualLeave(twEmployee.getCasualLeave());
                tmEmployee.setPrivilegeLeave(twEmployee.getPrivilegeLeave());
                tmEmployee.setSickLeave(twEmployee.getSickLeave());
                tmEmployee.setMaternityLeave(twEmployee.getMaternityLeave());
                tmEmployee.setPaternityLeave(twEmployee.getPaternityLeave());
                tmEmployee.setFeverLeave(twEmployee.getFeverLeave());
                tmEmployee.setLop(twEmployee.getLop());

                // Bank Account Information
                tmEmployee.setAccountTitle(twEmployee.getAccountTitle());
                tmEmployee.setBankAccountNo(twEmployee.getBankAccountNo());
                tmEmployee.setBankName(twEmployee.getBankName());
                tmEmployee.setIfscCode(twEmployee.getIfscCode());
                tmEmployee.setBankBranchName(twEmployee.getBankBranchName());

                // Social Media Links
                tmEmployee.setFacebookUrl(twEmployee.getFacebookUrl());
                tmEmployee.setTwitterUrl(twEmployee.getTwitterUrl());
                tmEmployee.setLinkedinUrl(twEmployee.getLinkedinUrl());
                tmEmployee.setInstagramUrl(twEmployee.getInstagramUrl());

                // Document Uploads
                tmEmployee.setResume(twEmployee.getResume());
                tmEmployee.setJoiningLetter(twEmployee.getJoiningLetter());
                tmEmployee.setResignationLetter(twEmployee.getResignationLetter());
                tmEmployee.setOtherDocuments(twEmployee.getOtherDocuments());
                HMS_TM_Employee savedTmEmployee = tmEmployeeRepository.save(tmEmployee);
                passwordGenerationForLogin(twEmployee);
                twEmployee.setAuthStat("AUTHORIZED");
                twEmployee.setRecordStat("OPENED");
                twEmployeeRepository.save(twEmployee);

                return savedTmEmployee;
            } else {
                throw new RuntimeException("Employee is already approved or rejected");
            }
        }catch(Exception ex){
            logger.error("Error approving employee: {}", ex.getMessage(), ex);
        }
        return null;
    }


    private void passwordGenerationForLogin(HMS_TW_Employee savedTmEmployee) throws MessagingException {
        try {

            String username = UserUtils.generateUsername(savedTmEmployee.getFirstName());
            String password = UserUtils.generateRandomPassword();
            EmployeeLoginDTO employeeLogin = new EmployeeLoginDTO();
            employeeLogin.setEmployeeId(savedTmEmployee.getEmployeeId());
            employeeLogin.setReporterId(savedTmEmployee.getReporterId());
            employeeLogin.setPassword(password);
            employeeLogin.setUserName(username);
            employeeLogin.setRoleId(savedTmEmployee.getRoleId());
            employeeLogin.setEmail(savedTmEmployee.getEmail());
            employeeLogin.setPhone(savedTmEmployee.getPhone());
            employeeLogin.setLastName(savedTmEmployee.getLastName());
            employeeLogin.setFirstName(savedTmEmployee.getFirstName());
            employeeLogin.setGender(savedTmEmployee.getGender());
            employeeLogin.setActive(true);
            loginInterface.saveEmployee(employeeLogin);
            sendUserEmail(employeeLogin);
        } catch (Exception ex) {
            logger.error("Error generating password for login: {}", ex.getMessage(), ex);
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }

    private void sendUserEmail(EmployeeLoginDTO employeeLogin) throws MessagingException {
        try {
            Context context = new Context();
            context.setVariable("firstName", employeeLogin.getFirstName());
            context.setVariable("lastName", employeeLogin.getLastName());
            context.setVariable("username", employeeLogin.getUserName());
            context.setVariable("password", employeeLogin.getPassword());
            String htmlContent = templateEngine.process("email-template", context);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(employeeLogin.getEmail());
            helper.setSubject("Welcome to HMS - Your Account Details");
            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (Exception ex) {
            logger.error("Error sending user email: {}", ex.getMessage(), ex);
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public void deleteEmployee(String id, String authStat) {
        HMS_TM_Employee tmEmployee = tmEmployeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found in TM with id: " + id));

        if ("UNAUTHORIZED".equals(authStat)) {
            tmEmployeeRepository.delete(tmEmployee);

            Optional<HMS_TW_Employee> twEmployeeOptional = twEmployeeRepository.findById(id);

            if (twEmployeeOptional.isPresent()) {
                HMS_TW_Employee twEmployee = twEmployeeOptional.get();
                twEmployee.setAuthStat("UNAUTHORIZED");
                twEmployee.setRecordStat("CLOSED");
                twEmployeeRepository.save(twEmployee);
                EmployeeLoginDTO employeeLogin = new EmployeeLoginDTO();
                employeeLogin.setEmployeeId(twEmployee.getEmployeeId());
                employeeLogin.setActive(false);
                loginInterface.saveEmployee(employeeLogin);
            }
        } else {
            throw new RuntimeException("Invalid authorization status, only UNAUTHORIZED is allowed");
        }
    }

    @Transactional
    public Optional<HMS_TM_Employee> getEmployeeById(String id) {
        return tmEmployeeRepository.findById(id);
    }

    @Transactional
    public List<EmployeeDTO> getAllEmployeesWithRoles() {
        List<HMS_TM_Employee> employees = tmEmployeeRepository.findAll();
        List<EmployeeDTO> employeeDTOs = new ArrayList<>();

        for (HMS_TM_Employee employee : employees) {
            HMS_TM_Role role = roleRepository.findById(employee.getRoleId())
                    .orElseThrow(() -> new RuntimeException("Role not found for ID: " + employee.getRoleId()));

            RolesDTO rolesDTO = new RolesDTO();
            rolesDTO.setRoleId(role.getRoleId());
            rolesDTO.setRoleName(role.getRoleName());
            rolesDTO.setRoleDescription(role.getDescription());

            employeeDTOs.add(new EmployeeDTO(employee, rolesDTO));
        }

        return employeeDTOs;
    }

//    @Transactional
//    public EmployeeDTOForAllModules getEmployeeWithRoleById(String id) {
//        HMS_TM_Employee employee = tmEmployeeRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Employee not found for ID: " + id));
//
//        HMS_TM_Role role = roleRepository.findById(employee.getRoleId())
//                .orElseThrow(() -> new RuntimeException("Role not found for ID: " + employee.getRoleId()));
//
//        String departmentName = "Unknown Department";
//        if (employee.getDepartmentId() != null) {
//            Optional<HMS_TM_Department> department = departmentRepository.findById(employee.getDepartmentId());
//            if (department.isPresent()) {
//                departmentName = department.get().getName();
//            }
//        }
//
//        List<HMS_TM_Payroll> payrollDetails = payrollRepository.findByEmployeeId(id);
//
//        List<HMS_TM_AttendanceLeave> attendanceLeaves = attendanceRepository.findByStaffId(employee.getStaffId());
//
//        List<HMS_TM_LeaveRequest> leaveRequests = leaveRequestRepository.findByEmployeeIdAndDeletedFalse(id);
//
//        List<HMS_TM_Timeline> timelines = timelineRepository.findByEmployeeIdAndDeletedFalse(id);
//
//        RolesDTO rolesDTO = new RolesDTO();
//        rolesDTO.setRoleId(role.getRoleId());
//        rolesDTO.setRoleName(role.getRoleName());
//        rolesDTO.setRoleDescription(role.getDescription());
//
//        return new EmployeeDTOForAllModules(employee, departmentName, rolesDTO, attendanceLeaves, leaveRequests, payrollDetails,timelines);
//    }

//    @Transactional
//    public EmployeeDTOForAllModules getEmployeeWithRoleById(String id) {
//        HMS_TM_Employee employee = tmEmployeeRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Employee not found for ID: " + id));
//
//        HMS_TM_Role role = roleRepository.findById(employee.getRoleId())
//                .orElseThrow(() -> new RuntimeException("Role not found for ID: " + employee.getRoleId()));
//
//        String departmentName = "Unknown Department";
//        if (employee.getDepartmentId() != null) {
//            Optional<HMS_TM_Department> department = departmentRepository.findById(employee.getDepartmentId());
//            if (department.isPresent()) {
//                departmentName = department.get().getName();
//            }
//        }
//
//        List<HMS_TM_Payroll> payrollDetails = payrollRepository.findByEmployeeId(id);
//
//        List<HMS_TM_AttendanceLeave> attendanceLeaves = attendanceRepository.findByStaffId(employee.getStaffId());
//
//        List<LeaveRequestForEmployeeDTO> leaveRequestDTOs = leaveRequestRepository.findByEmployeeIdAndDeletedFalse(id).stream()
//                .map(leaveRequest -> {
//                    long leaveDays = ChronoUnit.DAYS.between(leaveRequest.getLeaveFromDate(), leaveRequest.getLeaveToDate()) + 1;
//                    String roleNameWithStaffId = role.getRoleName() + " - " + employee.getStaffId();
//                    return new LeaveRequestForEmployeeDTO(leaveRequest, employee, roleNameWithStaffId, leaveDays);
//                })
//                .toList();
//
//
//        List<HMS_TM_Timeline> timelines = timelineRepository.findByEmployeeIdAndDeletedFalse(id);
//
//        RolesDTO rolesDTO = new RolesDTO();
//        rolesDTO.setRoleId(role.getRoleId());
//        rolesDTO.setRoleName(role.getRoleName());
//        rolesDTO.setRoleDescription(role.getDescription());
//
//        return new EmployeeDTOForAllModules(employee, departmentName, rolesDTO, attendanceLeaves, leaveRequestDTOs, payrollDetails, timelines);
//    }

    @Transactional
    public EmployeeDTOForAllModules getEmployeeWithRoleById(String id) {
        HMS_TM_Employee employee = tmEmployeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found for ID: " + id));

        HMS_TM_Role role = roleRepository.findById(employee.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found for ID: " + employee.getRoleId()));

        String departmentName = employee.getDepartmentId() != null
                ? departmentRepository.findById(employee.getDepartmentId()).map(HMS_TM_Department::getName).orElse("Unknown Department")
                : "Unknown Department";

        List<HMS_TM_Payroll> payrollDetails = payrollRepository.findByEmployeeId(id);
        List<HMS_TM_AttendanceLeave> attendanceLeaves = attendanceRepository.findByStaffId(employee.getStaffId());

        List<LeaveRequestForEmployeeDTO> leaveRequests = leaveRequestRepository.findByEmployeeIdAndDeletedFalse(id)
                .stream()
                .filter(leaveRequest -> "APPROVED".equalsIgnoreCase(leaveRequest.getStatus()))
                .map(leaveRequest -> {
                    long leaveDays = ChronoUnit.DAYS.between(leaveRequest.getLeaveFromDate(), leaveRequest.getLeaveToDate()) + 1;
                    String roleNameWithStaffId = role.getRoleName() + " - " + employee.getStaffId();
                    return new LeaveRequestForEmployeeDTO(leaveRequest, employee, roleNameWithStaffId, leaveDays);
                })
                .toList();

        List<HMS_TM_Timeline> timelines = timelineRepository.findByEmployeeIdAndDeletedFalse(id);

        RolesDTO rolesDTO = new RolesDTO();
        rolesDTO.setRoleId(role.getRoleId());
        rolesDTO.setRoleName(role.getRoleName());
        rolesDTO.setRoleDescription(role.getDescription());

        EmployeeDTOForAllModules employeeDTO = new EmployeeDTOForAllModules(employee, departmentName, rolesDTO,
                attendanceLeaves, leaveRequests, payrollDetails, timelines);

        Map<String, String> standardLeaveTypes = Map.of(
                "Casual Leave", "CASUAL LEAVE",
                "Privilege Leave", "PRIVILEGE LEAVE",
                "Sick Leave", "SICK LEAVE",
                "Maternity Leave", "MATERNITY LEAVE",
                "Paternity Leave", "PATERNITY LEAVE",
                "Fever Leave", "FEVER LEAVE",
                "LOP", "LOP"
        );

        Map<String, Integer> usedLeaves = leaveRequests.stream()
                .collect(Collectors.groupingBy(
                        leaveRequest -> {
                            String cleanType = leaveRequest.getLeaveType().replaceAll("\\s*\\(\\d+\\)", "");
                            return standardLeaveTypes.getOrDefault(cleanType, cleanType.toUpperCase());
                        },
                        Collectors.summingInt(leaveRequest -> (int) leaveRequest.getLeaveDays())
                ));

        Map<String, Integer> availableLeaves = Map.of(
                "CASUAL LEAVE", employee.getCasualLeave(),
                "PRIVILEGE LEAVE", employee.getPrivilegeLeave(),
                "SICK LEAVE", employee.getSickLeave(),
                "MATERNITY LEAVE", employee.getMaternityLeave(),
                "PATERNITY LEAVE", employee.getPaternityLeave(),
                "FEVER LEAVE", employee.getFeverLeave(),
                "LOP", employee.getLop()
        );

        Map<String, Integer> totalLeaves = new HashMap<>();
        for (String leaveType : availableLeaves.keySet()) {
            int used = usedLeaves.getOrDefault(leaveType, 0);
            int available = availableLeaves.getOrDefault(leaveType, 0);
            int total = used + available;
            totalLeaves.put(leaveType, total);
        }

        employeeDTO.setUsedLeaves(usedLeaves);
        employeeDTO.setAvailableLeaves(availableLeaves);
        employeeDTO.setTotalLeaves(totalLeaves);

        return employeeDTO;
    }

    public HMS_TW_Employee updateEmployee(String id, HMS_TW_Employee updatedEmployee,
                                          MultipartFile photoFile,
                                          MultipartFile resumeFile,
                                          MultipartFile joiningLetterFile,
                                          MultipartFile resignationLetterFile,
                                          MultipartFile otherDocumentsFile) throws IOException {

        Optional<HMS_TW_Employee> existingEmployeeOptional = twEmployeeRepository.findById(id);

        if (existingEmployeeOptional.isPresent()) {
            HMS_TW_Employee existingEmployee = existingEmployeeOptional.get();

            existingEmployee.setStaffId(updatedEmployee.getStaffId());
            existingEmployee.setReporterId(updatedEmployee.getReporterId());
            existingEmployee.setFirstName(updatedEmployee.getFirstName());
            existingEmployee.setPassword(updatedEmployee.getPassword());
            existingEmployee.setLastName(updatedEmployee.getLastName());
            existingEmployee.setGender(updatedEmployee.getGender());
            existingEmployee.setDateOfBirth(updatedEmployee.getDateOfBirth());
            existingEmployee.setDateOfJoining(updatedEmployee.getDateOfJoining());
            existingEmployee.setEmail(updatedEmployee.getEmail());
            existingEmployee.setPhone(updatedEmployee.getPhone());
            existingEmployee.setMaritalStatus(updatedEmployee.getMaritalStatus());
            existingEmployee.setDesignation(updatedEmployee.getDesignation());
            existingEmployee.setRoleId(updatedEmployee.getRoleId());
            existingEmployee.setDoctorFee(updatedEmployee.getDoctorFee());
            existingEmployee.setDepartmentId(updatedEmployee.getDepartmentId());
            existingEmployee.setFatherName(updatedEmployee.getFatherName());
            existingEmployee.setMotherName(updatedEmployee.getMotherName());
            existingEmployee.setBloodGroup(updatedEmployee.getBloodGroup());
            existingEmployee.setNationalIdNumber(updatedEmployee.getNationalIdNumber());
            existingEmployee.setPanNumber(updatedEmployee.getPanNumber());
            existingEmployee.setLocalIdNumber(updatedEmployee.getLocalIdNumber());
            existingEmployee.setSpecialist(updatedEmployee.getSpecialist());
            existingEmployee.setEpfNumber(updatedEmployee.getEpfNumber());
            existingEmployee.setBasicSalary(updatedEmployee.getBasicSalary());
            existingEmployee.setContractType(updatedEmployee.getContractType());
            existingEmployee.setWorkShift(updatedEmployee.getWorkShift());
            existingEmployee.setWorkLocation(updatedEmployee.getWorkLocation());
            existingEmployee.setCasualLeave(updatedEmployee.getCasualLeave());
            existingEmployee.setPrivilegeLeave(updatedEmployee.getPrivilegeLeave());
            existingEmployee.setSickLeave(updatedEmployee.getSickLeave());
            existingEmployee.setMaternityLeave(updatedEmployee.getMaternityLeave());
            existingEmployee.setPaternityLeave(updatedEmployee.getPaternityLeave());
            existingEmployee.setFeverLeave(updatedEmployee.getFeverLeave());
            existingEmployee.setLop(updatedEmployee.getLop());
            existingEmployee.setAccountTitle(updatedEmployee.getAccountTitle());
            existingEmployee.setBankAccountNo(updatedEmployee.getBankAccountNo());
            existingEmployee.setBankName(updatedEmployee.getBankName());
            existingEmployee.setIfscCode(updatedEmployee.getIfscCode());
            existingEmployee.setBankBranchName(updatedEmployee.getBankBranchName());
            existingEmployee.setFacebookUrl(updatedEmployee.getFacebookUrl());
            existingEmployee.setTwitterUrl(updatedEmployee.getTwitterUrl());
            existingEmployee.setLinkedinUrl(updatedEmployee.getLinkedinUrl());
            existingEmployee.setInstagramUrl(updatedEmployee.getInstagramUrl());
            existingEmployee.setAuthStat(updatedEmployee.getAuthStat());
            existingEmployee.setRecordStat(updatedEmployee.getRecordStat());
            existingEmployee.setModNo(updatedEmployee.getModNo());
            existingEmployee.setCurrentAddress(updatedEmployee.getCurrentAddress());
            existingEmployee.setPermanentAddress(updatedEmployee.getPermanentAddress());
            existingEmployee.setQualification(updatedEmployee.getQualification());
            existingEmployee.setWorkExperience(updatedEmployee.getWorkExperience());
            existingEmployee.setNote(updatedEmployee.getNote());
            existingEmployee.setReferenceContact(updatedEmployee.getReferenceContact());
            existingEmployee.setSpecialization(updatedEmployee.getSpecialization());

            if (photoFile != null && !photoFile.isEmpty()) {
                String encodedPhoto = Base64.getEncoder().encodeToString(photoFile.getBytes());
                existingEmployee.setPhoto(encodedPhoto);
            }

            if (resumeFile != null && !resumeFile.isEmpty()) {
                String encodedResume = Base64.getEncoder().encodeToString(resumeFile.getBytes());
                existingEmployee.setResume(encodedResume);
            }

            if (joiningLetterFile != null && !joiningLetterFile.isEmpty()) {
                String encodedJoiningLetter = Base64.getEncoder().encodeToString(joiningLetterFile.getBytes());
                existingEmployee.setJoiningLetter(encodedJoiningLetter);
            }

            if (resignationLetterFile != null && !resignationLetterFile.isEmpty()) {
                String encodedResignationLetter = Base64.getEncoder().encodeToString(resignationLetterFile.getBytes());
                existingEmployee.setResignationLetter(encodedResignationLetter);
            }

            if (otherDocumentsFile != null && !otherDocumentsFile.isEmpty()) {
                String encodedOtherDocuments = Base64.getEncoder().encodeToString(otherDocumentsFile.getBytes());
                existingEmployee.setOtherDocuments(encodedOtherDocuments);
            }
            updateLoginEmployee(existingEmployee);
            return twEmployeeRepository.save(existingEmployee);
        } else {
            throw new RuntimeException("Employee not found with ID: " + id);
        }
    }

    private void updateLoginEmployee(HMS_TW_Employee existingEmployee) {
        EmployeeLoginDTO employeeLogin = new EmployeeLoginDTO();
        employeeLogin.setEmployeeId(existingEmployee.getEmployeeId());
        employeeLogin.setDepartmentId(existingEmployee.getDepartmentId());
        employeeLogin.setReporterId(existingEmployee.getReporterId());
        employeeLogin.setRoleId(existingEmployee.getRoleId());
        employeeLogin.setEmail(existingEmployee.getEmail());
        employeeLogin.setPhone(existingEmployee.getPhone());
        employeeLogin.setLastName(existingEmployee.getLastName());
        employeeLogin.setFirstName(existingEmployee.getFirstName());
        employeeLogin.setGender(existingEmployee.getGender());
        employeeLogin.setActive(true);
        loginInterface.saveEmployee(employeeLogin);
    }

    public void deleteEmployee(String id) {
        Optional<HMS_TW_Employee> employeeOptional = twEmployeeRepository.findById(id);
        if (employeeOptional.isPresent()) {
            HMS_TW_Employee employee = employeeOptional.get();
            employee.setExited(true);
            twEmployeeRepository.save(employee);
        } else {
            throw new RuntimeException("Employee not found with ID: " + id);
        }
    }

    public List<HMS_TM_Employee> getEmployeesByRole(String role) {
        return tmEmployeeRepository.findByRoleId(role);
    }

    public List<SearchEmployeeDTO> searchEmployees(String role, String department, String searchTerm, String staffId) {
        return tmEmployeeRepository.findEmployeesBySearchTerm(role, department, searchTerm, staffId);
    }

    public List<String> getEmployeeLeaveDetails(String employeeId) {
        HMS_TM_Employee employee = tmEmployeeRepository.findById(employeeId)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with ID: " + employeeId));

        List<String> leaveDetails = new ArrayList<>();
        leaveDetails.add("Casual Leave (" + employee.getCasualLeave() + ")");
        leaveDetails.add("Privilege Leave (" + employee.getPrivilegeLeave() + ")");
        leaveDetails.add("Sick Leave (" + employee.getSickLeave() + ")");
        leaveDetails.add("Maternity Leave (" + employee.getMaternityLeave() + ")");
        leaveDetails.add("Paternity Leave (" + employee.getPaternityLeave() + ")");
        leaveDetails.add("Fever Leave (" + employee.getFeverLeave() + ")");

        return leaveDetails;
    }

    public List<HMS_TM_Employee> getEmployeesByRoleName(String roleName) {
        Optional<HMS_TM_Role> role = roleRepository.findByRoleName(roleName);

        if (role.isEmpty()) {
            throw new ResourceNotFoundException("Role with name " + roleName + " not found");
        }

        String roleId = role.get().getRoleId();

        return tmEmployeeRepository.findByRoleId(roleId);
    }

    public StaffCertificateDTO getEmployeeCertificatesByUsingStaffId(String staffId) {
        Optional<HMS_TM_Employee> employeeOptional = tmEmployeeRepository.findByStaffId(staffId);
        return employeeOptional
                .filter(entity -> Boolean.FALSE.equals(entity.getExited()))
                .map(entity ->
                                StaffCertificateDTO.builder()
                            .photo(entity.getPhoto())
                            .resume(entity.getResume())
                            .joiningLetter(entity.getJoiningLetter())
                            .resignationLetter(entity.getResignationLetter())
                            .otherDocuments(entity.getOtherDocuments())
                   .build()
                )
                .orElseThrow(() -> new RuntimeException("Active employee not found with staff ID: " + staffId));
    }

    @Transactional
    public List<EmployeeDTO> searchEmployeesByRoleAndName(String roleId, String staffId) {
        // Search full Employee entity
        List<HMS_TM_Employee> employees = tmEmployeeRepository.findByRoleAndStaffId(roleId, staffId);
        List<EmployeeDTO> employeeDTOs = new ArrayList<>();

        for (HMS_TM_Employee employee : employees) {
            HMS_TM_Role role = roleRepository.findById(employee.getRoleId())
                    .orElseThrow(() -> new RuntimeException("Role not found for ID: " + employee.getRoleId()));

            RolesDTO roleDto = new RolesDTO();
            roleDto.setRoleId(role.getRoleId());
            roleDto.setRoleName(role.getRoleName());
            roleDto.setRoleDescription(role.getDescription());

            employeeDTOs.add(new EmployeeDTO(employee, roleDto));
        }

        return employeeDTOs;
    }

//    public List<EmployeeDTO> searchEmployeesByRoleAndName(String roles, String name) {
////    return tmEmployeeRepository.searchByRoleAndName(roles, name);
//
//                ModelMapper mapper = new ModelMapper();
//
//        List<EmployeeRoleDTO> employees = tmEmployeeRepository.searchByRoleAndName(roles,name);
//        return employees.stream()
//                .map(employee -> {
//                    EmployeeDTO dto = mapper.map(employee, EmployeeDTO.class);
//                    RolesDTO roleDto = new RolesDTO();
//                    roleRepository.findById(employee.getRoleId()).ifPresent(role -> {
//                        roleDto.setRoleName(role.getRoleName());
//                        roleDto.setRoleDescription(role.getDescription());
//                    });
//                    dto.setRoleDetails(roleDto);
//
//                    return dto;
//                })
//                .collect(Collectors.toList());
//
//    }





}





