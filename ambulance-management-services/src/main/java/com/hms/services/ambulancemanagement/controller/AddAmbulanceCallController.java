package com.hms.services.ambulancemanagement.controller;


import com.hms.services.ambulancemanagement.entity.HMS_TM_AddAmbulanceCall;
import com.hms.services.ambulancemanagement.entity.HMS_TM_AmbulanceCallTransaction;
import com.hms.services.ambulancemanagement.model.AmbulanceCallDTO;
import com.hms.services.ambulancemanagement.model.AmbulanceCallTransactionDTO;
import com.hms.services.ambulancemanagement.model.BillSummary;
import com.hms.services.ambulancemanagement.model.IncomeChanges;
import com.hms.services.ambulancemanagement.service.AddAmbulanceCallService;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/ambulance_call")
public class AddAmbulanceCallController {


    private final AddAmbulanceCallService ambulanceCallService;

    @Autowired
    public AddAmbulanceCallController(final AddAmbulanceCallService ambulanceCallService) {
        this.ambulanceCallService = ambulanceCallService;
    }


    // Create a new Ambulance Call
    @PostMapping("/add")
    public ResponseEntity<JSONObject> addAmbulanceCall(
            @RequestPart("ambulanceCall") AmbulanceCallDTO ambulanceCallDTO,
            @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {
        JSONObject savedAmbulanceCallDTO = ambulanceCallService.addAmbulanceCall(ambulanceCallDTO, file);
        return ResponseEntity.ok(savedAmbulanceCallDTO);
    }

    @PostMapping("/payment/add/{vehicleChargeId}")
    public ResponseEntity<JSONObject> addAmbulanceCallPayment(@PathVariable("vehicleChargeId") String id,
                                                              @RequestPart("transaction") AmbulanceCallTransactionDTO transaction,
                                                              @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {
        JSONObject savedAmbulanceCallDTO = ambulanceCallService.addAmbulanceCallPayment(id,transaction,file);
        return ResponseEntity.ok(savedAmbulanceCallDTO);
    }

    @GetMapping("/payments/{vehicleChargeId}")
    public ResponseEntity<List<HMS_TM_AmbulanceCallTransaction>> getAllPaymentById(@PathVariable("vehicleChargeId") String id) {
        List<HMS_TM_AmbulanceCallTransaction> ambulanceCall = ambulanceCallService.getAllPaymentById(id);
        return ResponseEntity.ok(ambulanceCall);
    }

    // Get all Ambulance Calls
    @GetMapping("/all")
    public ResponseEntity<List<AmbulanceCallDTO>> getAllAmbulanceCallsWithPayments() {
        List<AmbulanceCallDTO> ambulanceCalls = ambulanceCallService.getAllAmbulanceWithPayments();
        return ResponseEntity.ok(ambulanceCalls);
    }

    @GetMapping("/search")
    public ResponseEntity<List<AmbulanceCallDTO>> getFilteredAmbulanceCalls(
            @RequestParam(required = false) String ipdOrOpdId,
            @RequestParam(required = false) String patientId) {

        List<AmbulanceCallDTO> ambulanceCalls = ambulanceCallService.getFilteredAmbulanceCalls(ipdOrOpdId, patientId);
        return ResponseEntity.ok(ambulanceCalls);
    }

    // Get a specific Ambulance Call by ID
    @GetMapping("/{id}")
    public ResponseEntity<HMS_TM_AddAmbulanceCall> getAmbulanceCallById(@PathVariable String id) {
        Optional<HMS_TM_AddAmbulanceCall> ambulanceCall = ambulanceCallService.getAmbulanceCallById(id);
        return ambulanceCall.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update an existing Ambulance Call
    @PutMapping("/update/{id}")
    public ResponseEntity<JSONObject> updateAmbulanceCall(
            @PathVariable String id,
            @RequestPart("ambulanceCall") AmbulanceCallDTO ambulanceCallDTO,
            @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {

        JSONObject updatedAmbulanceCall = ambulanceCallService.updateAmbulanceCall(id, ambulanceCallDTO, file);
        return ResponseEntity.ok(updatedAmbulanceCall);
    }

    // Delete an Ambulance Call by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<JSONObject> deleteAmbulanceCall(@PathVariable String id) {
        JSONObject isDeleted = ambulanceCallService.deleteAmbulanceCall(id);
        return ResponseEntity.ok(isDeleted);
    }

    @GetMapping("/income")
    public IncomeChanges getAmbulanceIncome() {
        return ambulanceCallService.getAmbulanceIncome();
    }
    @GetMapping("/monthly-income")
    public Double getAmbulanceMonthlyIncome() {
        return ambulanceCallService.getAmbulanceMonthlyIncome();
    }

    @GetMapping("/OpdOrIpd/ambulance-payment/{id}")
    public BillSummary getAmbulanceOpdAndIpdPayment(@PathVariable String id) {
        return ambulanceCallService.getAmbulanceOpdAndIpdPayment(id);
    }

    @GetMapping("/medical-history/{patientId}")
    public Integer getMedicalHistoryAmbulance(@PathVariable String patientId){
        return ambulanceCallService.getMedicalHistoryAmbulance(patientId);
    }

    @GetMapping("/increase-monthly-income")
    public IncomeChanges getAmbulanceIncreaseMonthlyIncome() {
        return ambulanceCallService.getAmbulanceIncreaseMonthlyIncome();
    }

    @GetMapping("/increase-yearly-income")
    public IncomeChanges getAmbulanceIncreaseYearlyIncome() {
        return ambulanceCallService.getAmbulanceIncreaseYearlyIncome();
    }

    @GetMapping("/increase-weekly-income")
    public IncomeChanges getAmbulanceIncreaseWeeklyIncome() {
        return ambulanceCallService.getAmbulanceIncreaseWeeklyIncome();
    }

    @GetMapping("/income-list/today")
    public ResponseEntity<List<HMS_TM_AmbulanceCallTransaction>> getAllAmbulanceIncomeForToday() {
        List<HMS_TM_AmbulanceCallTransaction> incomeList = ambulanceCallService.fetchAllAmbulanceIncomeForToday();
        return ResponseEntity.ok(incomeList);
    }


    @GetMapping("/income-list/monthly")
    public ResponseEntity<List<HMS_TM_AmbulanceCallTransaction>> getAllAmbulanceIncomeForCurrentMonth() {
        List<HMS_TM_AmbulanceCallTransaction> incomeList = ambulanceCallService.fetchAllAmbulanceIncomeForCurrentMonth();
        return ResponseEntity.ok(incomeList);
    }

    @GetMapping("/income-list/yearly")
    public ResponseEntity<List<HMS_TM_AmbulanceCallTransaction>> getAllAmbulanceIncomeForCurrentYear() {
        List<HMS_TM_AmbulanceCallTransaction> incomeList = ambulanceCallService.fetchAllAmbulanceIncomeForCurrentYear();
        return ResponseEntity.ok(incomeList);
    }

    @GetMapping("/income-list/weekly")
    public ResponseEntity<List<HMS_TM_AmbulanceCallTransaction>> getAllAmbulanceIncomeForCurrentWeek() {
        List<HMS_TM_AmbulanceCallTransaction> incomeList = ambulanceCallService.fetchAllAmbulanceIncomeForCurrentWeek();
        return ResponseEntity.ok(incomeList);
    }

}


