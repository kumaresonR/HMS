package com.hms.services.opdmanagement.controller;


import com.hms.services.opdmanagement.entity.HMS_TM_OPDPayments;
import com.hms.services.opdmanagement.model.IncomeChanges;
import com.hms.services.opdmanagement.service.OPDPaymentsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;


@RestController
@RequestMapping("/opd-payments")
public class OPDPaymentController {


    private final OPDPaymentsService opdPaymentsService;

    @Autowired
    public OPDPaymentController(OPDPaymentsService opdPaymentsService) {
        this.opdPaymentsService = opdPaymentsService;
    }

    @PostMapping("/add")
    public ResponseEntity<HMS_TM_OPDPayments> createIPDPayment(@RequestPart("payment") HMS_TM_OPDPayments payment,
                                                               @RequestPart(value = "file", required = false) MultipartFile file) {
        HMS_TM_OPDPayments createdPayment = opdPaymentsService.createOPDPayment(payment, file);
        return ResponseEntity.ok(createdPayment);
    }

    // Get IPD Payment by ID (ipdChargeId)
    @GetMapping("/{opdChargeId}")
    public HMS_TM_OPDPayments getOPDPaymentById(@PathVariable String opdChargeId) {
        return opdPaymentsService.getOPDPaymentById(opdChargeId);
    }

    // Get list of IPD Payments by IPD ID
    @GetMapping("/by-opd/{opdId}")
    public List<HMS_TM_OPDPayments> getIPDPaymentsByIpdId(@PathVariable String opdId) {
        return opdPaymentsService.getOPDPaymentsByOpdId(opdId);
    }


    @PutMapping("/{opdChargeId}")
    public ResponseEntity<HMS_TM_OPDPayments> updateOPDPayment(@PathVariable String opdChargeId,
                                                               @RequestPart("payment") HMS_TM_OPDPayments updatedPayment,
                                                               @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {
        HMS_TM_OPDPayments payment = opdPaymentsService.updateOPDPayment(opdChargeId, updatedPayment, file);
        return ResponseEntity.ok(payment);
    }

    @DeleteMapping("/{opdChargeId}")
    public ResponseEntity<Void> deleteOPDPayment(@PathVariable String opdChargeId) {
        opdPaymentsService.deleteOPDPayment(opdChargeId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/opd-income")
    public IncomeChanges getOPDIncome() {
        return opdPaymentsService.getOPDIncome();
    }

    @GetMapping("/opd-monthly-income")
    public Double getOPDMonthlyIncome() {
        return opdPaymentsService.getOPDMonthlyIncome();
    }

    @GetMapping("/increase-monthly-income")
    public IncomeChanges getOPDIncreaseMonthlyIncome() {
        return opdPaymentsService.getOPDIncreaseMonthlyIncome();
    }

    @GetMapping("/increase-yearly-income")
    public IncomeChanges getOPDIncreaseYearlyIncome() {
        return opdPaymentsService.getOPDIncreaseYearlyIncome();
    }

    @GetMapping("/increase-weekly-income")
    public IncomeChanges getOPDIncreaseWeeklyIncome() {
        return opdPaymentsService.getOPDIncreaseWeeklyIncome();
    }

    @GetMapping("/income-list/today")
    public ResponseEntity<List<HMS_TM_OPDPayments>> getAllOPDIncomeForToday() {
        List<HMS_TM_OPDPayments> incomeList = opdPaymentsService.fetchAllOPDIncomeForToday();
        return ResponseEntity.ok(incomeList);
    }

    @GetMapping("/income-list/month")
    public ResponseEntity<List<HMS_TM_OPDPayments>> getAllOPDIncomeForCurrentMonth() {
        List<HMS_TM_OPDPayments> incomeList = opdPaymentsService.fetchAllOPDIncomeForCurrentMonth();
        return ResponseEntity.ok(incomeList);
    }

    @GetMapping("/income-list/week")
    public ResponseEntity<List<HMS_TM_OPDPayments>> getAllOPDIncomeForCurrentWeek() {
        List<HMS_TM_OPDPayments> incomeList = opdPaymentsService.fetchAllOPDIncomeForCurrentWeek();
        return ResponseEntity.ok(incomeList);
    }

    @GetMapping("/income-list/year")
    public ResponseEntity<List<HMS_TM_OPDPayments>> getAllOPDIncomeForCurrentYear() {
        List<HMS_TM_OPDPayments> incomeList = opdPaymentsService.fetchAllOPDIncomeForCurrentYear();
        return ResponseEntity.ok(incomeList);
    }

}
