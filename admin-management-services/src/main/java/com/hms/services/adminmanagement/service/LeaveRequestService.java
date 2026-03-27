package com.hms.services.adminmanagement.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.services.adminmanagement.entity.HMS_TM_Department;
import com.hms.services.adminmanagement.entity.HMS_TM_Employee;
import com.hms.services.adminmanagement.entity.HMS_TM_LeaveRequest;
import com.hms.services.adminmanagement.entity.HMS_TM_Role;
import com.hms.services.adminmanagement.exceptionhandler.CustomException;
import com.hms.services.adminmanagement.model.*;
import com.hms.services.adminmanagement.repository.HMS_TM_DepartmentRepository;
import com.hms.services.adminmanagement.repository.HMS_TM_EmployeeRepository;
import com.hms.services.adminmanagement.repository.LeaveRequestRepository;
import com.hms.services.adminmanagement.repository.RoleRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDate;
import java.time.Month;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class LeaveRequestService {

    private static final Logger logger = LoggerFactory.getLogger(LeaveRequestService.class);

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private HMS_TM_EmployeeRepository employeeRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private HMS_TM_DepartmentRepository tmDepartmentRepository;

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    public HMS_TM_LeaveRequest applyLeave(LeaveRequestApplyDTO leaveRequestApplyDTO, String employeeId) {
        Optional<HMS_TM_Employee> employeeOptional = employeeRepository.findById(employeeId);

        if (!employeeOptional.isPresent()) {
            throw new IllegalArgumentException("Employee not found for employeeId: " + employeeId);
        }

        HMS_TM_Employee employee = employeeOptional.get();
        int leaveDays = (int) ChronoUnit.DAYS.between(leaveRequestApplyDTO.getLeaveFromDate(), leaveRequestApplyDTO.getLeaveToDate()) + 1;
        String leaveType = leaveRequestApplyDTO.getLeaveType().split("\\s*\\(")[0].toUpperCase();

        switch (leaveType) {
            case "CASUAL LEAVE":
                if (employee.getCasualLeave() < leaveDays) {
                    throw new IllegalArgumentException("Not enough Casual Leave balance.");
                }
                break;
            case "PRIVILEGE LEAVE":
                if (employee.getPrivilegeLeave() < leaveDays) {
                    throw new IllegalArgumentException("Not enough Privilege Leave balance.");
                }
                break;
            case "SICK LEAVE":
                if (employee.getSickLeave() < leaveDays) {
                    throw new IllegalArgumentException("Not enough Sick Leave balance.");
                }
                break;
            case "MATERNITY LEAVE":
                if (employee.getMaternityLeave() < leaveDays) {
                    throw new IllegalArgumentException("Not enough Maternity Leave balance.");
                }
                break;
            case "PATERNITY LEAVE":
                if (employee.getPaternityLeave() < leaveDays) {
                    throw new IllegalArgumentException("Not enough Paternity Leave balance.");
                }
                break;
            case "FEVER LEAVE":
                if (employee.getFeverLeave() < leaveDays) {
                    throw new IllegalArgumentException("Not enough Fever Leave balance.");
                }
                break;
            case "LOP":
                break;
            default:
                throw new IllegalArgumentException("Invalid leave type.");
        }

        HMS_TM_LeaveRequest leaveRequest = new HMS_TM_LeaveRequest();
        leaveRequest.setEmployeeId(employeeId);
        leaveRequest.setLeaveType(leaveRequestApplyDTO.getLeaveType());
        leaveRequest.setLeaveFromDate(leaveRequestApplyDTO.getLeaveFromDate());
        leaveRequest.setLeaveToDate(leaveRequestApplyDTO.getLeaveToDate());
        leaveRequest.setReason(leaveRequestApplyDTO.getReason());
        leaveRequest.setApproverId(employee.getReporterId());
        leaveRequest.setStatus("PENDING");
        leaveRequest.setApplyDate(LocalDate.now());

        HMS_TM_LeaveRequest savedRequest = leaveRequestRepository.save(leaveRequest);

        sendLeaveNotification(employeeOptional.get().getFirstName(),employeeOptional.get().getLastName(),savedRequest,employee.getReporterId());

        return savedRequest;
    }

    public void sendLeaveNotification(String firstName,String lastName,HMS_TM_LeaveRequest leave,String reporterId) {
        try {
//            HMS_TM_Department department = tmDepartmentRepository.findByDepartmentId(departmentId);
//            HMS_TM_Employee employeeDetails = employeeRepository.findByEmployeeId(department.getEmployeeId());
                   Map<String, String> event = new HashMap<>();
                   event.put("employeeId", reporterId);
                   event.put("firstName", firstName);
                   event.put("lastName", lastName);
                   event.put("title", "LeaveRequest");
                   event.put("leaveType", leave.getLeaveType());
                   event.put("message", "Employee [" + firstName + " " + lastName + "] applied for [" + leave.getLeaveType() + "] leave.");
                   String eventMessage = objectMapper.writeValueAsString(event);
                   kafkaTemplate.send("leave-requests-notifications", eventMessage);
                   logger.info("Published leave request event: {}", eventMessage);
        } catch (Exception e) {
            logger.error("Error publishing leave request event", e);
        }
    }
//    public HMS_TM_LeaveRequest processLeaveRequest(String id, String approverRole, String status) {
//        Optional<HMS_TM_LeaveRequest> leaveRequestOptional = leaveRequestRepository.findById(id);
//
//        if (!leaveRequestOptional.isPresent()) {
//            throw new IllegalArgumentException("Leave request not found.");
//        }
//
//        HMS_TM_LeaveRequest leaveRequest = leaveRequestOptional.get();
//
//        if (!"PENDING".equals(leaveRequest.getStatus())) {
//            throw new IllegalArgumentException("Only pending leave requests can be approved.");
//        }
//
//        Optional<HMS_TM_Employee> employeeOptional = employeeRepository.findById(leaveRequest.getEmployeeId());
//
//        if (!employeeOptional.isPresent()) {
//            throw new IllegalArgumentException("Employee not found.");
//        }
//
//        HMS_TM_Employee leaveApplicant = employeeOptional.get();
//
//        if (!isValidApprover(leaveApplicant.getDesignation(), approverRole)) {
//            throw new IllegalArgumentException("Unauthorized: You don't have permission to approve this leave request.");
//        }
//
//        int leaveDays = (int) ChronoUnit.DAYS.between(leaveRequest.getLeaveFromDate(), leaveRequest.getLeaveToDate()) + 1;
//        String leaveType = leaveRequest.getLeaveType().split("\\s*\\(")[0].toUpperCase();
//
//        switch (leaveType) {
//            case "CASUAL LEAVE":
//                leaveApplicant.setCasualLeave(leaveApplicant.getCasualLeave() - leaveDays);
//                break;
//            case "PRIVILEGE LEAVE":
//                leaveApplicant.setPrivilegeLeave(leaveApplicant.getPrivilegeLeave() - leaveDays);
//                break;
//            case "SICK LEAVE":
//                leaveApplicant.setSickLeave(leaveApplicant.getSickLeave() - leaveDays);
//                break;
//            case "MATERNITY LEAVE":
//                leaveApplicant.setMaternityLeave(leaveApplicant.getMaternityLeave() - leaveDays);
//                break;
//            case "PATERNITY LEAVE":
//                leaveApplicant.setPaternityLeave(leaveApplicant.getPaternityLeave() - leaveDays);
//                break;
//            case "FEVER LEAVE":
//                leaveApplicant.setFeverLeave(leaveApplicant.getFeverLeave() - leaveDays);
//                break;
//            default:
//                throw new IllegalArgumentException("Invalid leave type.");
//        }
//
//        employeeRepository.save(leaveApplicant);
//
//        leaveRequest.setStatus(status.toUpperCase());
//        return leaveRequestRepository.save(leaveRequest);
//    }
//

    public HMS_TM_LeaveRequest processLeaveRequest(String id, String departmentHeadId, String status) {
        Optional<HMS_TM_LeaveRequest> leaveRequestOptional = leaveRequestRepository.findById(id);

        if (!leaveRequestOptional.isPresent()) {
            throw new IllegalArgumentException("Leave request not found.");
        }

        HMS_TM_LeaveRequest leaveRequest = leaveRequestOptional.get();

        if (!"PENDING".equalsIgnoreCase(leaveRequest.getStatus())) {
            throw new IllegalArgumentException("Only pending leave requests can be processed.");
        }

        Optional<HMS_TM_Employee> employeeOptional = employeeRepository.findById(leaveRequest.getEmployeeId());

        if (!employeeOptional.isPresent()) {
            throw new IllegalArgumentException("Employee not found.");
        }

        HMS_TM_Employee leaveApplicant = employeeOptional.get();

        String applicantRoleName = roleRepository.findRoleNameById(leaveApplicant.getRoleId())
                .orElseThrow(() -> new IllegalArgumentException("Applicant's role not found."));

//        if (!isValidApprover(applicantRoleName, approverRole)) {
//            throw new IllegalArgumentException("Unauthorized: You don't have permission to approve this leave request.");
//        }

        int leaveDays = (int) ChronoUnit.DAYS.between(leaveRequest.getLeaveFromDate(), leaveRequest.getLeaveToDate()) + 1;
        String leaveType = leaveRequest.getLeaveType().split("\\s*\\(")[0].toUpperCase();

        if ("APPROVED".equalsIgnoreCase(status)) {
            switch (leaveType) {
                case "CASUAL LEAVE":
                    if (leaveApplicant.getCasualLeave() < leaveDays) {
                        throw new IllegalArgumentException("Not enough Casual Leave balance.");
                    }
                    leaveApplicant.setCasualLeave(leaveApplicant.getCasualLeave() - leaveDays);
                    break;
                case "PRIVILEGE LEAVE":
                    if (leaveApplicant.getPrivilegeLeave() < leaveDays) {
                        throw new IllegalArgumentException("Not enough Privilege Leave balance.");
                    }
                    leaveApplicant.setPrivilegeLeave(leaveApplicant.getPrivilegeLeave() - leaveDays);
                    break;
                case "SICK LEAVE":
                    if (leaveApplicant.getSickLeave() < leaveDays) {
                        throw new IllegalArgumentException("Not enough Sick Leave balance.");
                    }
                    leaveApplicant.setSickLeave(leaveApplicant.getSickLeave() - leaveDays);
                    break;
                case "MATERNITY LEAVE":
                    if (leaveApplicant.getMaternityLeave() < leaveDays) {
                        throw new IllegalArgumentException("Not enough Maternity Leave balance.");
                    }
                    leaveApplicant.setMaternityLeave(leaveApplicant.getMaternityLeave() - leaveDays);
                    break;
                case "PATERNITY LEAVE":
                    if (leaveApplicant.getPaternityLeave() < leaveDays) {
                        throw new IllegalArgumentException("Not enough Paternity Leave balance.");
                    }
                    leaveApplicant.setPaternityLeave(leaveApplicant.getPaternityLeave() - leaveDays);
                    break;
                case "FEVER LEAVE":
                    if (leaveApplicant.getFeverLeave() < leaveDays) {
                        throw new IllegalArgumentException("Not enough Fever Leave balance.");
                    }
                    leaveApplicant.setFeverLeave(leaveApplicant.getFeverLeave() - leaveDays);
                    break;
                case "LOP":
                    leaveApplicant.setLop(leaveApplicant.getLop() + leaveDays);
                    break;
                default:
                    throw new IllegalArgumentException("Invalid leave type.");
            }
            employeeRepository.save(leaveApplicant);
        }
        else if ("DISAPPROVED".equalsIgnoreCase(status) || "REJECTED".equalsIgnoreCase(status)) {
            leaveRequest.setStatus("DISAPPROVED");}

        leaveRequest.setStatus(status.toUpperCase());
        sendLeaveApproveNotification(leaveRequest.getEmployeeId(), leaveRequest.getLeaveType(), departmentHeadId, status);
        return leaveRequestRepository.save(leaveRequest);
    }

    private void sendLeaveApproveNotification(String employeeId, String leaveType, String departmentHeadId, String status) {
        try {
            Optional<HMS_TM_Employee> employeeOptional = employeeRepository.findById(departmentHeadId);
            HMS_TM_Employee employee=employeeOptional.get();
            logger.debug("Publishing leave approval event for employeeId: {}", employee.getEmployeeId());
            Map<String, String> event = new HashMap<>();
            event.put("employeeId", employeeId);
            event.put("title", "Leave"+status);
            event.put("leaveType", leaveType);
            event.put("message", "Employee Leave Request [" + status + "] by ["+ employee.getFirstName()+" "+employee.getLastName()+" ]");
            String eventMessage = objectMapper.writeValueAsString(event);
            kafkaTemplate.send("leave-approve-notifications", eventMessage);
            logger.info("Published leave approval event: {}", eventMessage);
        } catch (Exception e) {
            logger.error("Error publishing leave approval event", e);
        }

    }

//    private boolean isValidApprover(String applicantRole, String approverRole) {
//        if (("SUPERADMIN".equalsIgnoreCase(applicantRole) && "ADMIN".equalsIgnoreCase(approverRole)) ||
//                ("ADMIN".equalsIgnoreCase(applicantRole) && "SUPERADMIN".equalsIgnoreCase(approverRole))) {
//            return true;
//        }
//
//        switch (applicantRole.toUpperCase()) {
//            case "DOCTOR":
//                return "ADMIN".equalsIgnoreCase(approverRole) || "SUPERADMIN".equalsIgnoreCase(approverRole);
//            case "NURSE":
//            case "RADIOLOGIST":
//            case "PATHOLOGIST":
//            case "PHARMACIST":
//            case "RECEPTIONIST":
//            case "ACCOUNTANT":
//                return "DOCTOR".equalsIgnoreCase(approverRole);
//            default:
//                return false;
//        }
//    }

//    @Transactional
//    public List<LeaveRequestForEmployeeDTO> getAllLeaveRequestsForEmployee() {
//        List<HMS_TM_LeaveRequest> leaveRequests = leaveRequestRepository.findByDeletedFalse();
//        return leaveRequests.stream()
//                .map(leaveRequest -> {
//                    HMS_TM_Employee employeeDetails = employeeRepository.findByEmployeeId(leaveRequest.getEmployeeId());
//                    HMS_TM_Role roleDetails = roleRepository.findByRoleId(employeeDetails.getRoleId());
//                    String roleName = roleDetails != null ? roleDetails.getRoleName() : null;
//                    String roleNameWithStaffId = roleName != null ? roleName + " (" + employeeDetails.getStaffId() + ")" : null;
//                    return new LeaveRequestForEmployeeDTO(leaveRequest, employeeDetails, roleNameWithStaffId);
//                })
//                .collect(Collectors.toList());
//    }

    @Transactional
    public List<LeaveRequestForEmployeeDTO> getAllLeaveRequestsForEmployee(String approverId) {
        List<HMS_TM_Employee> employees = employeeRepository.findByReporterId(approverId);
        if (employees.isEmpty()) {
            return Collections.emptyList();
        }
        List<String> employeeIds = employees.stream()
                .map(HMS_TM_Employee::getEmployeeId)
                .collect(Collectors.toList());

        List<HMS_TM_LeaveRequest> leaveRequests = leaveRequestRepository.findByEmployeeIdInAndDeletedFalse(employeeIds);
        if (leaveRequests.isEmpty()) {
            return Collections.emptyList();
        }
        return leaveRequests.stream()
                .map(leaveRequest -> {
                    HMS_TM_Employee employeeDetails = employeeRepository.findByEmployeeId(leaveRequest.getEmployeeId());
                    HMS_TM_Role roleDetails = roleRepository.findByRoleId(employeeDetails.getRoleId());
                    String roleName = roleDetails != null ? roleDetails.getRoleName() : null;
                    String roleNameWithStaffId = roleName != null ? roleName + " (" + employeeDetails.getStaffId() + ")" : null;

                    long leaveDays = 0;
                    if (leaveRequest.getLeaveFromDate() != null && leaveRequest.getLeaveToDate() != null) {
                        leaveDays = ChronoUnit.DAYS.between(leaveRequest.getLeaveFromDate(), leaveRequest.getLeaveToDate()) + 1;
                    }

                    return new LeaveRequestForEmployeeDTO(leaveRequest, employeeDetails, roleNameWithStaffId, leaveDays);
                })
                .collect(Collectors.toList());
    }




    @Transactional
    public LeaveRequestForEmployeeDTO getLeaveRequestById(String leaveRequestId) {
        HMS_TM_LeaveRequest leaveRequest = leaveRequestRepository.findByLeaveRequestIdAndDeletedFalse(leaveRequestId)
                .orElseThrow(() -> new CustomException("LeaveRequest Id Not Found", HttpStatus.NOT_FOUND));

        HMS_TM_Employee employeeDetails = employeeRepository.findByEmployeeId(leaveRequest.getEmployeeId());
        HMS_TM_Role roleDetails = roleRepository.findByRoleId(employeeDetails.getRoleId());
        String roleName = roleDetails != null ? roleDetails.getRoleName() : null;
        String roleNameWithStaffId = roleName != null ? roleName + " (" + employeeDetails.getStaffId() + ")" : null;

        long leaveDays = 0;
        if (leaveRequest.getLeaveFromDate() != null && leaveRequest.getLeaveToDate() != null) {
            leaveDays = ChronoUnit.DAYS.between(leaveRequest.getLeaveFromDate(), leaveRequest.getLeaveToDate()) + 1;
        }

        return new LeaveRequestForEmployeeDTO(leaveRequest, employeeDetails, roleNameWithStaffId ,leaveDays);
    }

   @Transactional
    public List<LeaveRequestDTO> getLeaveRequestsByEmployee(String employeeId) {
        List<HMS_TM_LeaveRequest> leaveRequests = leaveRequestRepository.findByEmployeeIdAndDeletedFalse(employeeId);

        return leaveRequests.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private LeaveRequestDTO convertToDTO(HMS_TM_LeaveRequest leaveRequest) {
        LeaveRequestDTO dto = new LeaveRequestDTO(leaveRequest);

        employeeService.getEmployeeById(leaveRequest.getEmployeeId())
                .ifPresent(employee -> dto.setEmployeeName(employee.getFirstName() + " " + employee.getLastName()));

        long days = ChronoUnit.DAYS.between(leaveRequest.getLeaveFromDate(), leaveRequest.getLeaveToDate()) + 1;
        dto.setDuration(days);

        return dto;
    }

    public void deleteLeaveRequest(String leaveRequestId) {
        Optional<HMS_TM_LeaveRequest> leaveRequestOptional = leaveRequestRepository.findById(leaveRequestId);
        if (leaveRequestOptional.isPresent()) {
            HMS_TM_LeaveRequest leaveRequest = leaveRequestOptional.get();
            leaveRequest.setDeleted(true);
            leaveRequestRepository.save(leaveRequest);
        } else {
            throw new RuntimeException("Leave Request not found with ID: " + leaveRequestId);
        }
    }

    public List<LeaveSummaryDTO> calculateLeaveSummary(String employeeId) {
        HMS_TM_Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with ID: " + employeeId));

        Map<String, Integer> allocatedLeaves = Map.of(
                "Casual Leave", employee.getCasualLeave(),
                "Privilege Leave", employee.getPrivilegeLeave(),
                "Sick Leave", employee.getSickLeave(),
                "Maternity Leave", employee.getMaternityLeave(),
                "Paternity Leave", employee.getPaternityLeave(),
                "Fever Leave", employee.getFeverLeave()
        );

        List<HMS_TM_LeaveRequest> approvedLeaveRequests = leaveRequestRepository.findByEmployeeIdAndStatus(employeeId, "APPROVED");

        Map<String, Integer> usedLeaves = approvedLeaveRequests.stream()
                .collect(Collectors.groupingBy(
                        HMS_TM_LeaveRequest::getLeaveType,
                        Collectors.summingInt(leaveRequest ->
                                (int) ChronoUnit.DAYS.between(leaveRequest.getLeaveFromDate(), leaveRequest.getLeaveToDate()) + 1
                        )
                ));

        List<LeaveSummaryDTO> leaveSummary = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : allocatedLeaves.entrySet()) {
            String leaveType = entry.getKey();
            int allocated = entry.getValue();
            int used = usedLeaves.getOrDefault(leaveType, 0);
            int remaining = Math.max(allocated - used, 0);

            leaveSummary.add(new LeaveSummaryDTO(leaveType, allocated, used, remaining));
        }

        return leaveSummary;
    }

    public Page<EmployeeLeaveSummaryDTO> calculateLeaveSummaries(
            String roleId, String fromMonth, String toMonth, String year,
            String staffId, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<EmployeeMinimalDTO> employees;

//        if (roleId != null && name != null && !name.isEmpty()) {
            employees = employeeRepository.findMinimalByRoleIdAndNameLike(roleId, staffId, pageable);
//        } else if (roleId != null) {
//            employees = employeeRepository.findMinimalByRoleId(roleId, pageable);
//        } else {
//            return Page.empty(); // Or handle differently
//        }

        List<EmployeeLeaveSummaryDTO> result = new ArrayList<>();
        Integer yearInt = (year != null && !year.isEmpty()) ? Integer.parseInt(year) : null;
        Integer fromMonthInt = (fromMonth != null) ? getMonthNumber(fromMonth) : null;
        Integer toMonthInt = (toMonth != null) ? getMonthNumber(toMonth) : null;

        for (EmployeeMinimalDTO employee : employees.getContent()) {
            HMS_TM_Role role = roleRepository.findById(employee.getRoleId())
                    .orElseThrow(() -> new RuntimeException("Role not found for ID: " + employee.getRoleId()));

            RolesDTO rolesDTO = new RolesDTO();
            rolesDTO.setRoleId(role.getRoleId());
            rolesDTO.setRoleName(role.getRoleName());
            rolesDTO.setRoleDescription(role.getDescription());

            List<HMS_TM_LeaveRequest> approvedLeaveRequests;

            if (fromMonthInt != null && toMonthInt != null) {
                approvedLeaveRequests = leaveRequestRepository.findApprovedLeavesByEmployeeAndMonthRange(
                        employee.getEmployeeId(), fromMonthInt, toMonthInt, yearInt);
            } else if (fromMonthInt != null) {
                approvedLeaveRequests = leaveRequestRepository.findApprovedLeavesByEmployeeAndSingleMonth(
                        employee.getEmployeeId(), fromMonthInt, yearInt);
            } else {
                approvedLeaveRequests = leaveRequestRepository.findApprovedLeavesByEmployeeAndYear(
                        employee.getEmployeeId(), yearInt);
            }

            Map<String, Integer> allocatedLeaves = Map.of(
                    "Casual Leave", employee.getCasualLeave(),
                    "Privilege Leave", employee.getPrivilegeLeave(),
                    "Sick Leave", employee.getSickLeave(),
                    "Maternity Leave", employee.getMaternityLeave(),
                    "Paternity Leave", employee.getPaternityLeave(),
                    "Fever Leave", employee.getFeverLeave()
            );

            Map<String, Integer> usedLeaves = approvedLeaveRequests.stream()
                    .collect(Collectors.groupingBy(
                            lr -> normalizeLeaveType(lr.getLeaveType()),
                            Collectors.summingInt(lr -> (int) ChronoUnit.DAYS.between(
                                    lr.getLeaveFromDate(), lr.getLeaveToDate()) + 1)
                    ));

            List<LeaveSummaryDTO> leaveSummary = new ArrayList<>();
            for (Map.Entry<String, Integer> entry : allocatedLeaves.entrySet()) {
                String leaveType = entry.getKey();
                int allocated = entry.getValue();
                int used = usedLeaves.getOrDefault(leaveType, 0);
                int remaining = Math.max(allocated - used, 0);
                leaveSummary.add(new LeaveSummaryDTO(leaveType, allocated, used, remaining));
            }

            EmployeeDTO employeeData = new EmployeeDTO(employee, rolesDTO);
            EmployeeLeaveSummaryDTO leaveTotal = new EmployeeLeaveSummaryDTO();
            leaveTotal.setEmployeeDetails(employeeData);
            leaveTotal.setLeaveSummary(leaveSummary);

            result.add(leaveTotal);
        }

        return new PageImpl<>(result, pageable, employees.getTotalElements());
    }


    private String normalizeLeaveType(String rawType) {
        if (rawType == null) return "";
        rawType = rawType.toLowerCase();
        if (rawType.contains("casual")) return "Casual Leave";
        if (rawType.contains("privilege")) return "Privilege Leave";
        if (rawType.contains("sick")) return "Sick Leave";
        if (rawType.contains("maternity")) return "Maternity Leave";
        if (rawType.contains("paternity")) return "Paternity Leave";
        if (rawType.contains("fever")) return "Fever Leave";
        return rawType;
    }


    private Integer getMonthNumber(String monthName) {
        try {
            return Month.valueOf(monthName.toUpperCase()).getValue();
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid month: " + monthName);
        }
    }

}



