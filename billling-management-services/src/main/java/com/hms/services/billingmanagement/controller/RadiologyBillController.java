package com.hms.services.billingmanagement.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.services.billingmanagement.entity.HMS_TM_RadiologyBill;
import com.hms.services.billingmanagement.entity.HMS_TM_RadiologyTest;
import com.hms.services.billingmanagement.model.*;
import com.hms.services.billingmanagement.service.RadiologyBillService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/radiology-bills")
public class RadiologyBillController {

    private final RadiologyBillService radiologyBillService;
    private final ObjectMapper objectMapper;

    @Autowired
    public RadiologyBillController(RadiologyBillService radiologyBillService, ObjectMapper objectMapper) {
        this.radiologyBillService = radiologyBillService;
        this.objectMapper = objectMapper;
    }

    @PostMapping("/generate")
    public ResponseEntity<RadiologyBillDTO> generateRadiologyBill(
//            @RequestHeader("Authorization") String authorizationHeader,
            @RequestPart("billData") String billDataJson,
            @RequestPart(value = "photo", required = false) MultipartFile photoFile) {

        RadiologyBillDTO generatedBill = radiologyBillService.generateBill(billDataJson, photoFile);
        return ResponseEntity.status(HttpStatus.CREATED).body(generatedBill);
    }

    @GetMapping
    public ResponseEntity<List<RadiologyBillDTO>> getAllBills(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        List<RadiologyBillDTO> bills = radiologyBillService.getAllBills(page, size);
        return ResponseEntity.ok(bills);
    }

    @GetMapping("/{billId}")
    public ResponseEntity<RadiologyBillDTO> getBillById(@PathVariable String billId) {
        RadiologyBillDTO billDTO = radiologyBillService.getBillById(billId);
        return ResponseEntity.ok(billDTO);
    }

    @GetMapping("/radiology/test/{testId}")
    public ResponseEntity<RadiologyBillDTO> getRadiologyBillByTestId(@PathVariable String testId) {
        RadiologyBillDTO billDTO = radiologyBillService.getBillByTestId(testId);
        return ResponseEntity.ok(billDTO);
    }

    @PutMapping("/radiology/{testId}")
    public ResponseEntity<HMS_TM_RadiologyTest> updateRadiologyTestDetails(
//            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable("testId") String testId,
            @RequestPart("testData") String radiologyDataJson,
            @RequestPart(value = "uploadReport", required = false) MultipartFile uploadReportFile) {

        try {
            RadiologyTestUpdateRequest updateDTO = objectMapper.readValue(radiologyDataJson, RadiologyTestUpdateRequest.class);

            HMS_TM_RadiologyTest updatedTest = radiologyBillService.updateRadiologyTestDetailsByTestId(testId, updateDTO, uploadReportFile);

            return ResponseEntity.ok(updatedTest);
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @PutMapping("/radiology/update-by-test/{testId}")
    public ResponseEntity<HMS_TM_RadiologyTest> updateRadiologyTestByTestId(
//            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable("testId") String testId,
            @Valid @RequestBody RadiologyBillUpdateDTO updateDTO) {
        try {
            HMS_TM_RadiologyTest updatedTest = radiologyBillService.updateRadiologyTest(testId, updateDTO);
            return ResponseEntity.ok(updatedTest);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/update/{billId}")
    public ResponseEntity<RadiologyBillDTO> updateRadiologyBill(
//            .@RequestHeader("Authorization") String authorizationHeader,
            @PathVariable String billId,
            @RequestPart("billData") String radiologyDataJson,
            @RequestPart(value = "photo", required = false) MultipartFile photoFile) {

        RadiologyBillDTO updatedBill = radiologyBillService.updateRadiologyBill(billId, radiologyDataJson, photoFile);
        return ResponseEntity.ok(updatedBill);
    }

    @DeleteMapping("/remove/{billId}")
    public ResponseEntity<String> deleteRadiologyBill(@PathVariable String billId) {
        try {
            radiologyBillService.deleteRadiologyPathologyBill(billId);
            return new ResponseEntity<>("Radiology Bill marked as deleted.", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("Radiology Bill not found or cannot be deleted.", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/radiology-tests")
    public ResponseEntity<List<RadiologyTestDTO>> getRadiologyTestsByIds(@RequestParam List<String> ids,@RequestParam String prescriptionNo) {
        List<RadiologyTestDTO> radiologyTests = radiologyBillService.getRadiologyTestsByIds(ids,prescriptionNo);
        return new ResponseEntity<>(radiologyTests, HttpStatus.OK);
    }

//    @GetMapping("/radiology-tests")
//    public ResponseEntity<List<RadiologyTestDTO>> getRadiologyTestsByIds(@RequestParam List<String> ids,@RequestParam String id) {
//        List<RadiologyTestDTO> radiologyTests = radiologyBillService.getRadiologyTestsByIds(ids,id);
//        return new ResponseEntity<>(radiologyTests, HttpStatus.OK);
//    }


//    @GetMapping("/radiology-income")
//    public Double getRadiologyIncome() {
//        return radiologyBillService.getRadiologyIncome();
//    }

    @GetMapping("/radiology-income")
    public IncomeChanges getRadiologyIncome() {
        return radiologyBillService.getRadiologyIncome();
    }

    @GetMapping("/radiology-monthly-income")
    public Double getMonthlyRadiologyIncome() {
        return radiologyBillService.getMonthlyRadiologyIncome();
    }

    @GetMapping("/OpdOrIpd/radiology-payment/{id}")
    public BillSummary getRadiologyOpdAndIpdPayment(@PathVariable String id) {
        return radiologyBillService.getRadiologyOpdAndIpdPayment(id);
    }
    @GetMapping("/medical-history/{patientId}")
    public Integer getMedicalHistoryRadiology(@PathVariable String patientId){
        return radiologyBillService.getMedicalHistoryRadiology(patientId);
    }

    @GetMapping("/increase-monthly-income")
    public IncomeChanges getRadiologyIncreaseMonthlyIncome() {
        return radiologyBillService.getRadiologyIncreaseMonthlyIncome();
    }
    @GetMapping("/increase-yearly-income")
    public IncomeChanges getRadiologyIncreaseYearlyIncome() {
        return radiologyBillService.getRadiologyIncreaseYearlyIncome();
    }

    @GetMapping("/increase-weekly-income")
    public IncomeChanges getRadiologyIncreaseWeeklyIncome() {
        return radiologyBillService.getRadiologyIncreaseWeeklyIncome();
    }

    @GetMapping("/ipdOrOpdId/{ipdOrOpdId}")
    public ResponseEntity<List<HMS_TM_RadiologyBill>> getRadiologyBillByIpdOrOpdId(@PathVariable String ipdOrOpdId) {
        List<HMS_TM_RadiologyBill> radiologyBills = radiologyBillService.getRadiologyBillByIpdOrOpdId(ipdOrOpdId);
        if (!radiologyBills.isEmpty()) {
            return ResponseEntity.ok(radiologyBills);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<RadiologyBillResponse>> searchRadiologyBills(
            @RequestParam(required = false) String sampleCollected,
            @RequestParam(required = false) String categoryName,
            @RequestParam(required = false) String testName,
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        List<RadiologyBillResponse> response = radiologyBillService.searchRadiologyBills(
                sampleCollected, categoryName, testName, timeDuration, startDate, endDate
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/income-list/today")
    public ResponseEntity<List<HMS_TM_RadiologyBill>> getAllRadiologyIncomeForToday() {
        List<HMS_TM_RadiologyBill> incomeList = radiologyBillService.fetchAllRadiologyIncomeForToday();
        return ResponseEntity.ok(incomeList);
    }


    @GetMapping("/income-list/monthly")
    public ResponseEntity<List<HMS_TM_RadiologyBill>> getAllRadiologyIncomeForMonth() {
        List<HMS_TM_RadiologyBill> incomeList = radiologyBillService.fetchAllRadiologyIncomeForMonth();
        return ResponseEntity.ok(incomeList);
    }

    @GetMapping("/income-list/yearly")
    public ResponseEntity<List<HMS_TM_RadiologyBill>> getAllRadiologyIncomeForYear() {
        List<HMS_TM_RadiologyBill> incomeList = radiologyBillService.fetchAllRadiologyIncomeForYear();
        return ResponseEntity.ok(incomeList);
    }

    @GetMapping("/income-list/weekly")
    public ResponseEntity<List<HMS_TM_RadiologyBill>> getAllRadiologyIncomeForWeek() {
        List<HMS_TM_RadiologyBill> incomeList = radiologyBillService.fetchAllRadiologyIncomeForWeek();
        return ResponseEntity.ok(incomeList);
    }

}



