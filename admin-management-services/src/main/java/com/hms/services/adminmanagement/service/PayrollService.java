package com.hms.services.adminmanagement.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.services.adminmanagement.entity.*;
import com.hms.services.adminmanagement.model.*;
import com.hms.services.adminmanagement.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.*;

@Service
public class PayrollService {

    private final PayrollRepository payrollRepository;

    private final HMS_TM_EmployeeRepository employeeRepository;

    private final AttendanceRepository attendanceRepository;

    private final RoleRepository roleRepository;

    private final HMS_TM_DepartmentRepository departmentRepository;

   @Autowired
    public PayrollService(PayrollRepository payrollRepository, HMS_TM_EmployeeRepository employeeRepository, AttendanceRepository attendanceRepository, RoleRepository roleRepository, HMS_TM_DepartmentRepository departmentRepository) {
        this.payrollRepository = payrollRepository;
        this.employeeRepository = employeeRepository;
        this.attendanceRepository = attendanceRepository;
       this.roleRepository = roleRepository;
       this.departmentRepository = departmentRepository;
   }

    @Transactional
    public List<EmployeePayrollStatusDTO> getEmployeePayrollStatus(String roleId, String month, String year) {
        List<HMS_TM_Employee> employees = (roleId != null) ?
                employeeRepository.findEmployeesByRoleId(roleId) : employeeRepository.findAll();

        List<EmployeePayrollStatusDTO> payrollStatuses = new ArrayList<>();

        for (HMS_TM_Employee employee : employees) {
            HMS_TM_Role role = roleRepository.findById(employee.getRoleId())
                    .orElseThrow(() -> new RuntimeException("Role not found for ID: " + employee.getRoleId()));

            RolesDTO rolesDTO = new RolesDTO();
            rolesDTO.setRoleId(role.getRoleId());
            rolesDTO.setRoleName(role.getRoleName());
            rolesDTO.setRoleDescription(role.getDescription());

            DepartmentDTO departmentDTO = departmentRepository.findById(employee.getDepartmentId())
                    .map(department -> new DepartmentDTO(department.getDepartmentId(), department.getName()))
                    .orElseThrow(() -> new RuntimeException("Department not found for ID: " + employee.getDepartmentId()));

            EmployeeDTO employeeDTO = new EmployeeDTO(employee, rolesDTO);
            employeeDTO.setDepartmentId(departmentDTO.getDepartmentName());

            List<HMS_TM_Payroll> payrollRecords = payrollRepository
                    .findByEmployeeIdAndMonthAndYear(employee.getEmployeeId(), month,
                            (year != null) ? Integer.parseInt(year) : 0);

            if (!payrollRecords.isEmpty()) {
                for (HMS_TM_Payroll payroll : payrollRecords) {
                    payrollStatuses.add(new EmployeePayrollStatusDTO(
                            employee.getEmployeeId(),
                            employee.getStaffId(),
                            employee.getFirstName(),
                            employee.getLastName(),
                            payroll.getStatus(),
                            payroll.getAction(),
                            payroll.getPayrollId(),
                            employeeDTO
                    ));
                }
            } else {
                payrollStatuses.add(new EmployeePayrollStatusDTO(
                        employee.getEmployeeId(),
                        employee.getStaffId(),
                        employee.getFirstName(),
                        employee.getLastName(),
                        "Not Generated",
                        "Generate Payroll",
                        null,
                        employeeDTO
                ));
            }
        }
        return payrollStatuses;
    }

    @Transactional
    public ResponseEntity<EmployeePayrollAndAttendanceDTO> getPayrollTemplateAndAttendanceSummary(String employeeId) {
        Optional<HMS_TM_Employee> employee = employeeRepository.findById(employeeId);
        if (employee.isPresent()) {
            HMS_TM_Employee emp = employee.get();

            List<HMS_TM_AttendanceLeave> attendanceLeaveList = attendanceRepository.findByStaffId(emp.getStaffId());

            PayrollFields payrollFields = new PayrollFields();
            payrollFields.setBasicSalary(0);
            payrollFields.setEarnings(0);
            payrollFields.setDeductions(0);
            payrollFields.setGrossSalary(0);
            payrollFields.setTaxPercentage(0);
            payrollFields.setTax(0);
            payrollFields.setNetSalary(0);

            HMS_TM_Role role = roleRepository.findByRoleId(emp.getRoleId());
            String roleName = (role != null) ? role.getRoleName() : "Unknown Role";

            String departmentName = "Unknown Department";
            if (emp.getDepartmentId() != null) {
                Optional<HMS_TM_Department> department = departmentRepository.findById(emp.getDepartmentId());
                if (department.isPresent()) {
                    departmentName = department.get().getName();
                }
            }

            EmployeePayrollAndAttendanceDTO responseDTO = new EmployeePayrollAndAttendanceDTO(
                    emp.getEmployeeId(),
                    emp.getFirstName() + " " + emp.getLastName(),
                    emp.getRoleId(),
                    roleName,
                    emp.getPhone(),
                    emp.getPhoto(),
                    emp.getDepartmentId(),
                    departmentName,
                    emp.getDesignation(),
                    emp.getEpfNumber(),
                    emp.getEmail(),
                    payrollFields,
                    attendanceLeaveList
            );

            return new ResponseEntity<>(responseDTO, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    public HMS_TM_Payroll generatePayroll(HMS_TM_Payroll payroll) {
        LocalDate currentDate = LocalDate.now();
        payroll.setPayrollDate(currentDate.toString());
        payroll.setMonth(payroll.getMonth());
        payroll.setYear(payroll.getYear());
        double totalEarnings = Optional.ofNullable(payroll.getEarnings())
                .orElse(Collections.emptyList())
                .stream()
                .mapToDouble(HMS_TM_Earning::getAmount)
                .sum();

        double totalDeductions = Optional.ofNullable(payroll.getDeductions())
                .orElse(Collections.emptyList())
                .stream()
                .mapToDouble(HMS_TM_Deduction::getAmount)
                .sum();
        payroll.setStatus("Generated");
        payroll.setAction("Proceed to pay");

        Optional.ofNullable(payroll.getEarnings()).orElse(Collections.emptyList()).forEach(earning -> earning.setPayroll(payroll));
        Optional.ofNullable(payroll.getDeductions()).orElse(Collections.emptyList()).forEach(deduction -> deduction.setPayroll(payroll));

        return payrollRepository.save(payroll);
    }

    public PayrollDetailsDTO getPayrollDetails(String payrollId) {
        HMS_TM_Payroll payroll = payrollRepository.findById(payrollId)
                .orElseThrow(() -> new EntityNotFoundException("Payroll not found with ID: " + payrollId));

        HMS_TM_Employee employee = employeeRepository.findById(payroll.getEmployeeId())
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with ID: " + payroll.getEmployeeId()));

        DepartmentDTO departmentDTO = departmentRepository.findById(employee.getDepartmentId())
                .map(department -> new DepartmentDTO(department.getDepartmentId(), department.getName()))
                .orElseThrow(() -> new RuntimeException("Department not found for ID: " + employee.getDepartmentId()));

        EmployeeDTO employeeDTO = new EmployeeDTO(employee, null);
        employeeDTO.setDepartmentId(departmentDTO.getDepartmentName());

        PayrollDetailsDTO payrollDetailsDTO = new PayrollDetailsDTO();
        payrollDetailsDTO.setPayroll(payroll);
        payrollDetailsDTO.setEmployeeDetails(employeeDTO);

        return payrollDetailsDTO;
    }

//    public HMS_TM_Payroll proceedToPay(String dataJson, String payrollId, MultipartFile attachment) {
//        try {
//            ObjectMapper objectMapper = new ObjectMapper();
//            Map<String, String> data = objectMapper.readValue(dataJson, new TypeReference<>() {});
//
//            String paymentMode = data.get("paymentMode");
//            String note = data.get("note");
//            String payrollDate = data.get("payrollDate");
//
//            HMS_TM_Payroll payroll = payrollRepository.findById(payrollId)
//                    .orElseThrow(() -> new EntityNotFoundException("Payroll not found with ID: " + payrollId));
//
//            payroll.setPaymentMode(paymentMode);
//            payroll.setNote(note);
//            payroll.setStatus("Paid");
//            payroll.setAction("View Salary");
//
//            if (payrollDate != null && !payrollDate.isEmpty()) {
//                payroll.setPayrollDate(payrollDate);
//            }
//
//            if (attachment != null && !attachment.isEmpty()) {
//                byte[] fileContent = attachment.getBytes();
//                String encodedFile = Base64.getEncoder().encodeToString(fileContent);
//                payroll.setAttachDocument(encodedFile);
//            }
//
//            payrollRepository.save(payroll);
//
//            return payroll;
//        } catch (IOException e) {
//            throw new RuntimeException("Error processing attachment file", e);
//        }
//    }

    public PayrollSummaryDTO calculatePayrollSummaryForEmployee(String employeeId) {
        List<HMS_TM_Payroll> paidPayrolls = payrollRepository.findByStatusAndEmployeeId("Paid", employeeId);

        double totalNetSalary = paidPayrolls.stream()
                .mapToDouble(HMS_TM_Payroll::getNetSalary)
                .sum();

        double totalGrossSalary = paidPayrolls.stream()
                .mapToDouble(HMS_TM_Payroll::getGrossSalary)
                .sum();

        double totalEarnings = paidPayrolls.stream()
                .flatMap(payroll -> Optional.ofNullable(payroll.getEarnings())
                        .orElse(Collections.emptyList())
                        .stream())
                .mapToDouble(HMS_TM_Earning::getAmount)
                .sum();

        double totalDeductions = paidPayrolls.stream()
                .flatMap(payroll -> Optional.ofNullable(payroll.getDeductions())
                        .orElse(Collections.emptyList())
                        .stream())
                .mapToDouble(HMS_TM_Deduction::getAmount)
                .sum();

        return new PayrollSummaryDTO(totalNetSalary, totalGrossSalary, totalEarnings, totalDeductions);
    }

    public HMS_TM_Payroll proceedToPay(String dataJson, String payrollId, MultipartFile attachment) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, String> data = objectMapper.readValue(dataJson, new TypeReference<>() {});

            String paymentMode = data.get("paymentMode");
            String note = data.get("note");
            String payrollDate = data.get("payrollDate");

            HMS_TM_Payroll payroll = payrollRepository.findById(payrollId)
                    .orElseThrow(() -> new EntityNotFoundException("Payroll not found with ID: " + payrollId));

            payroll.setPaymentMode(paymentMode);
            payroll.setNote(note);
            payroll.setStatus("Paid");
            payroll.setAction("View Salary");

            if (payrollDate != null && !payrollDate.isEmpty()) {
                payroll.setPayrollDate(payrollDate);
            }

            if (attachment != null && !attachment.isEmpty()) {
                byte[] fileContent = attachment.getBytes();
                String encodedFile = Base64.getEncoder().encodeToString(fileContent);
                payroll.setAttachDocument(encodedFile);
            }

            payrollRepository.save(payroll);

            String employeeId = payroll.getEmployeeId();
            PayrollSummaryDTO summary = calculatePayrollSummaryForEmployee(employeeId);

            return payroll;
        } catch (IOException e) {
            throw new RuntimeException("Error processing attachment file", e);
        }
    }

    @Transactional
    public Map<String, Object> getEmployeeSalarySlip(
            String roleId,String year, String staffId,
            String fromMonth, String toMonth, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<EmployeeMinimalDTO> employeePage;

//        if (roleId != null || name != null && !name.isEmpty()) {
            employeePage = employeeRepository.findMinimalByRoleIdAndNameLike(roleId, staffId, pageable);
//        } else if (roleId != null) {
//            employeePage = employeeRepository.findMinimalByRoleId(roleId, pageable);
//        } else {
//            employeePage = Page.empty();
//        }

        List<SalarySlipDTO> payrollDetailsDTO = new ArrayList<>();

        for (EmployeeMinimalDTO employee : employeePage.getContent()) {
            SalarySlipDTO payrollData = new SalarySlipDTO();

            HMS_TM_Role role = roleRepository.findById(employee.getRoleId())
                    .orElseThrow(() -> new RuntimeException("Role not found for ID: " + employee.getRoleId()));

            RolesDTO rolesDTO = new RolesDTO();
            rolesDTO.setRoleId(role.getRoleId());
            rolesDTO.setRoleName(role.getRoleName());
            rolesDTO.setRoleDescription(role.getDescription());

            DepartmentDTO departmentDTO = departmentRepository.findById(employee.getDepartmentId())
                    .map(department -> new DepartmentDTO(department.getDepartmentId(), department.getName()))
                    .orElse(null);

            EmployeePayDTO employeeDTO = new EmployeePayDTO(employee, rolesDTO);
            if (departmentDTO != null) {
                employeeDTO.setDepartmentId(departmentDTO.getDepartmentId());
                employeeDTO.setDepartmentName(departmentDTO.getDepartmentName());
            }

            List<HMS_TM_Payroll> payrollRecords = new ArrayList<>();

            int parsedYear = (year != null) ? Integer.parseInt(year) : 0;

            if (fromMonth != null && toMonth != null) {
                payrollRecords = payrollRepository.findByEmployeeIdAndMonthRange(employee.getEmployeeId(), fromMonth, toMonth, parsedYear);
            } else if (fromMonth != null) {
                payrollRecords = payrollRepository.findByEmployeeIdAndSingleMonth(employee.getEmployeeId(), fromMonth, parsedYear);
            }else if (year != null) {
                payrollRecords = payrollRepository.findByEmployeeIdAndYear(
                        employee.getEmployeeId(), parsedYear
                );
            }
            if (!payrollRecords.isEmpty()) {
                payrollData.setPayroll(payrollRecords.get(0)); // or handle all
            }

            payrollData.setEmployeeDetails(employeeDTO);
            payrollDetailsDTO.add(payrollData);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("data", payrollDetailsDTO);
        response.put("currentPage", employeePage.getNumber());
        response.put("totalItems", employeePage.getTotalElements());
        response.put("totalPages", employeePage.getTotalPages());

        return response;
    }






}



