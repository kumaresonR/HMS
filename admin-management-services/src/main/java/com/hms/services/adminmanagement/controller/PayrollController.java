package com.hms.services.adminmanagement.controller;


import com.hms.services.adminmanagement.entity.HMS_TM_Payroll;
import com.hms.services.adminmanagement.model.*;
import com.hms.services.adminmanagement.service.PayrollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payroll")
public class PayrollController {

    private final PayrollService payrollService;

    @Autowired
    public PayrollController(PayrollService payrollService) {
        this.payrollService = payrollService;
    }

    @GetMapping("/payroll-status")
    public List<EmployeePayrollStatusDTO> getEmployeePayrollStatus(
            @RequestParam(required = false) String roleId,
            @RequestParam(required = false) String month,
            @RequestParam(required = false) String year) {

        return payrollService.getEmployeePayrollStatus(roleId, month, year);
    }

    @GetMapping("/generate/{employeeId}")
    public ResponseEntity<EmployeePayrollAndAttendanceDTO> getPayrollTemplateAndAttendanceSummary(@PathVariable String employeeId) {
        return payrollService.getPayrollTemplateAndAttendanceSummary(employeeId);
    }

    @PostMapping("/generate")
    public HMS_TM_Payroll generatePayroll(@RequestBody HMS_TM_Payroll payroll) {
        return payrollService.generatePayroll(payroll);
    }

    @PutMapping(value = "/proceedToPay/{payrollId}")
    public ResponseEntity<HMS_TM_Payroll> proceedToPay(
            @PathVariable String payrollId,
            @RequestPart("data") String dataJson,
            @RequestPart(value = "attachment", required = false) MultipartFile attachment) {

        HMS_TM_Payroll updatedPayroll = payrollService.proceedToPay(dataJson, payrollId, attachment);

        return ResponseEntity.status(HttpStatus.CREATED).body(updatedPayroll);
    }

    @GetMapping("/summary/{employeeId}")
    public PayrollSummaryDTO getPayrollSummaryForEmployee(@PathVariable String employeeId) {
        return payrollService.calculatePayrollSummaryForEmployee(employeeId);
    }


    @GetMapping("/ViewSalary/{payrollId}")
    public ResponseEntity<PayrollDetailsDTO> getPayroll(@PathVariable String payrollId) {
        PayrollDetailsDTO payrollDetails = payrollService.getPayrollDetails(payrollId);
        return ResponseEntity.ok(payrollDetails);
    }


    @GetMapping("/monthly/salarySlip")
    public ResponseEntity<Map<String, Object>> getEmployeeMonthlySalarySlip(
            @RequestParam(required = false) String roleId,
            @RequestParam(required = false) String year,
            @RequestParam(required = false) String staffId,
            @RequestParam(required = false) String fromMonth,
            @RequestParam(required = false) String toMonth,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(payrollService.getEmployeeSalarySlip(
                roleId, year, staffId, fromMonth, toMonth, page, size));
    }


}



