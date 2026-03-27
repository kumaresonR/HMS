package com.hms.services.ipdmanagement.controller;


import com.hms.services.ipdmanagement.entity.HMS_TM_IPDPayments;
import com.hms.services.ipdmanagement.model.IncomeChanges;
import com.hms.services.ipdmanagement.service.IPDPaymentsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;


@RestController
@RequestMapping("/ipd-payments")
public class IPDPaymentController {


    private final IPDPaymentsService ipdPaymentsService;

    @Autowired
    public IPDPaymentController(IPDPaymentsService ipdPaymentsService) {
        this.ipdPaymentsService = ipdPaymentsService;
    }

    @PostMapping("/add")
    public ResponseEntity<HMS_TM_IPDPayments> createIPDPayment(@RequestPart("payment") HMS_TM_IPDPayments payment,
                                                               @RequestPart(value="file", required = false) MultipartFile file) {
        HMS_TM_IPDPayments createdPayment = ipdPaymentsService.createIPDPayment(payment,file);
        return ResponseEntity.ok(createdPayment);
    }

    // Get IPD Payment by ID (ipdChargeId)
    @GetMapping("/{ipdChargeId}")
    public HMS_TM_IPDPayments getIPDPaymentById(@PathVariable String ipdChargeId) {
        return ipdPaymentsService.getIPDPaymentById(ipdChargeId);
    }

    // Get list of IPD Payments by IPD ID
    @GetMapping("/by-ipd/{ipdId}")
    public List<HMS_TM_IPDPayments> getIPDPaymentsByIpdId(@PathVariable String ipdId) {
        return ipdPaymentsService.getIPDPaymentsByIpdId(ipdId);
    }


    @PutMapping("/{ipdPaymentId}")
    public ResponseEntity<HMS_TM_IPDPayments> updateIPDPayment(@PathVariable String ipdPaymentId,
                                                               @RequestPart("payment") HMS_TM_IPDPayments updatedPayment,
                                                               @RequestPart(value="file", required = false) MultipartFile file) throws IOException {
        HMS_TM_IPDPayments payment = ipdPaymentsService.updateIPDPayment(ipdPaymentId, updatedPayment, file);
        return ResponseEntity.ok(payment);
    }

    @DeleteMapping("/{ipdPaymentId}")
    public ResponseEntity<Void> deleteIPDPayment(@PathVariable String ipdPaymentId) {
        ipdPaymentsService.deleteIPDPayment(ipdPaymentId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/ipd-income")
    public IncomeChanges getIPDIncome() {
        return ipdPaymentsService.getIPDIncome();
    }

    @GetMapping("/ipd-monthly-income")
    public Double getIPDMonthlyIncome() {
        return ipdPaymentsService.getIPDMonthlyIncome();

    }
    @GetMapping("/increase-monthly-income")
    public IncomeChanges getIPDIncreaseMonthlyIncome() {
        return ipdPaymentsService.getIPDIncreaseMonthlyIncome();
    }
    @GetMapping("/increase-yearly-income")
    public IncomeChanges getIPDIncreaseYearlyIncome() {
        return ipdPaymentsService.getIPDIncreaseYearlyIncome();
    }

    @GetMapping("/increase-weekly-income")
    public IncomeChanges getIPDIncreaseWeeklyIncome() {
        return ipdPaymentsService.getIPDIncreaseWeeklyIncome();
    }


    @GetMapping("/income-list/today")
    public ResponseEntity<List<HMS_TM_IPDPayments>> getAllIPDIncomeForToday() {
        List<HMS_TM_IPDPayments> incomeList = ipdPaymentsService.fetchAllIPDIncomeForToday();
        return ResponseEntity.ok(incomeList);
    }

    @GetMapping("/income-list/month")
    public ResponseEntity<List<HMS_TM_IPDPayments>> getAllIPDIncomeForCurrentMonth() {
        List<HMS_TM_IPDPayments> incomeList = ipdPaymentsService.fetchAllIPDIncomeForCurrentMonth();
        return ResponseEntity.ok(incomeList);
    }

    @GetMapping("/income-list/week")
    public ResponseEntity<List<HMS_TM_IPDPayments>> getAllIPDIncomeForCurrentWeek() {
        List<HMS_TM_IPDPayments> incomeList = ipdPaymentsService.fetchAllIPDIncomeForCurrentWeek();
        return ResponseEntity.ok(incomeList);
    }

    @GetMapping("/income-list/year")
    public ResponseEntity<List<HMS_TM_IPDPayments>> getAllIPDIncomeForCurrentYear() {
        List<HMS_TM_IPDPayments> incomeList = ipdPaymentsService.fetchAllIPDIncomeForCurrentYear();
        return ResponseEntity.ok(incomeList);
    }


}

