package com.hms.services.adminmanagement.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.services.adminmanagement.entity.HMS_TM_Employee;
import com.hms.services.adminmanagement.entity.HMS_TW_Employee;
import com.hms.services.adminmanagement.exceptionhandler.CustomException;
import com.hms.services.adminmanagement.model.*;
import com.hms.services.adminmanagement.service.EmployeeService;
import jakarta.mail.MessagingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/employees")
public class EmployeeController {

    private static final Logger logger = LoggerFactory.getLogger(EmployeeController.class);

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private ObjectMapper objectMapper;


    @PostMapping("/create")
    public ResponseEntity<?> createEmployee(
            @RequestPart("employeeData") String employeeDataJson,
            @RequestPart(value = "photo", required = false) MultipartFile photoFile,
            @RequestPart(value = "resume", required = false) MultipartFile resumeFile,
            @RequestPart(value = "joiningLetter", required = false) MultipartFile joiningLetterFile,
            @RequestPart(value = "resignationLetter", required = false) MultipartFile resignationLetterFile,
            @RequestPart(value = "otherDocuments", required = false) MultipartFile otherDocumentsFile) {

        try {
            HMS_TW_Employee employee = objectMapper.readValue(employeeDataJson, HMS_TW_Employee.class);

            HMS_TW_Employee savedEmployee = employeeService.saveEmployeeInTW(employee, photoFile, resumeFile, joiningLetterFile, resignationLetterFile, otherDocumentsFile);
            return new ResponseEntity<>(savedEmployee, HttpStatus.CREATED);

        } catch (IOException e) {
            return new ResponseEntity<>("Error processing request. Please check the request format.", HttpStatus.BAD_REQUEST);
        } catch (CustomException e) {
            throw new RuntimeException(e);

        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEmployee(
            @PathVariable String id,
            @RequestParam String authStat) {
        try {
            employeeService.deleteEmployee(id, authStat);
            return ResponseEntity.ok("Employee deleted from TM and status updated to UNAUTHORIZED in TW.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Employee not found or cannot be deleted.");
        }
    }

    @GetMapping("/tw/{id}")
    public ResponseEntity<TWEmployeeDTOForAllModules> getEmployeeByIds(@PathVariable String id) {
        try {
            TWEmployeeDTOForAllModules employee = employeeService.getEmployeeByIds(id);
            return ResponseEntity.ok(employee);
        } catch (RuntimeException e) {
            return ResponseEntity.ok().build();
        }
    }

    @GetMapping("/tw/all")
    public ResponseEntity<List<TWEmployeeDTOForAllModules>> getAllEmployees() {
        List<TWEmployeeDTOForAllModules> employees = employeeService.getAllEmployees();
        return ResponseEntity.ok(employees);
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<HMS_TM_Employee> approveEmployee(
            @PathVariable String id) {
        try {
            HMS_TM_Employee approvedEmployee = employeeService.approveEmployee(id);
            return new ResponseEntity<>(approvedEmployee, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            logger.error("Error approving employee: {}", e.getMessage(), e);
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<HMS_TM_Employee> getEmployeeById(@PathVariable String id) {
        return employeeService.getEmployeeById(id)
                .map(employee -> new ResponseEntity<>(employee, HttpStatus.OK))
                .orElse(null);
    }

    @GetMapping("/tm/all")
    public ResponseEntity<List<EmployeeDTO>> getAllEmployeesWithRoles() {
        List<EmployeeDTO> employees = employeeService.getAllEmployeesWithRoles();
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/employeerole/{id}")
    public ResponseEntity<EmployeeDTOForAllModules> getEmployeeWithRoleById(@PathVariable String id) {
        EmployeeDTOForAllModules employeeDTO = employeeService.getEmployeeWithRoleById(id);
        return ResponseEntity.ok(employeeDTO);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateEmployee(
            @PathVariable String id,
            @RequestPart("employeeData") String employeeDataJson,
            @RequestPart(value = "photo", required = false) MultipartFile photoFile,
            @RequestPart(value = "resume", required = false) MultipartFile resumeFile,
            @RequestPart(value = "joiningLetter", required = false) MultipartFile joiningLetterFile,
            @RequestPart(value = "resignationLetter", required = false) MultipartFile resignationLetterFile,
            @RequestPart(value = "otherDocuments", required = false) MultipartFile otherDocumentsFile) {

        try {
            HMS_TW_Employee updatedEmployee = objectMapper.readValue(employeeDataJson, HMS_TW_Employee.class);
            HMS_TW_Employee savedEmployee =employeeService.updateEmployee(
                    id, updatedEmployee, photoFile, resumeFile, joiningLetterFile, resignationLetterFile, otherDocumentsFile);

            return new ResponseEntity<>(savedEmployee, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>("Error processing request. Please check the request format.", HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("Employee not found or cannot be updated.", HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/remove/{id}")
    public ResponseEntity<String> deleteEmployee(@PathVariable String id) {
        try {
            employeeService.deleteEmployee(id);
            return new ResponseEntity<>("Employee marked as exited.", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("Employee not found or cannot be deleted.", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/employees/role/{roleId}")
    public List<HMS_TM_Employee> getEmployeesByRole(@PathVariable String roleId) {
        return employeeService.getEmployeesByRole(roleId);
    }

    @GetMapping("/search")
    public ResponseEntity<List<SearchEmployeeDTO>> searchEmployees(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) String staffId) {

        List<SearchEmployeeDTO> employees = employeeService.searchEmployees(role, department, searchTerm, staffId);

        return new ResponseEntity<>(employees, HttpStatus.OK);
    }

    @GetMapping("/{employeeId}/leaves")
    public ResponseEntity<List<String>> getEmployeeLeaveDetails(@PathVariable String employeeId) {
        List<String> leaveDetails = employeeService.getEmployeeLeaveDetails(employeeId);
        return ResponseEntity.ok(leaveDetails);
    }

    @GetMapping("/role/name/{roleName}")
    public List<HMS_TM_Employee> getEmployeesByRoleName(@PathVariable String roleName) {
        return employeeService.getEmployeesByRoleName(roleName);
    }

    @GetMapping("/certificates/{staffId}")
    public ResponseEntity<?> getEmployeeCertificatesByUsingStaffId(@PathVariable String staffId) {
        try {
            StaffCertificateDTO getEmployeeCertificates = employeeService.getEmployeeCertificatesByUsingStaffId(staffId);
            return ResponseEntity.ok(getEmployeeCertificates);
        } catch (RuntimeException exception) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Employee certificates not found.");
        } catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("Service is currently unavailable. Please try again later.");
        }

    }

    @GetMapping("/role/search")
    public ResponseEntity<List<EmployeeDTO>> searchEmployees(
            @RequestParam(required = false) String roleId,
            @RequestParam(required = false) String staffId) {
        List<EmployeeDTO> employees = employeeService.searchEmployeesByRoleAndName(roleId,staffId);
        return ResponseEntity.ok(employees);
    }




}






