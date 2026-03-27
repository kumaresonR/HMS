package com.hms.services.billingmanagement.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.services.billingmanagement.entity.HMS_TM_PathologyBill;
import com.hms.services.billingmanagement.entity.HMS_TM_PathologyTest;
import com.hms.services.billingmanagement.model.*;
import com.hms.services.billingmanagement.service.PathologyBillService;
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
@RequestMapping("/pathology-bills")
public class PathologyBillController {

    private final PathologyBillService pathologyBillService;
    private final ObjectMapper objectMapper;

    @Autowired
    public PathologyBillController(PathologyBillService pathologyBillService, ObjectMapper objectMapper) {
        this.pathologyBillService = pathologyBillService;
        this.objectMapper = objectMapper;
    }

    @PostMapping("/generate")
    public ResponseEntity<PathologyBillDTO> generatePathologyBill(
//            @RequestHeader("Authorization") String authorizationHeader,
            @RequestPart("billData") String billDataJson,
            @RequestPart(value = "photo", required = false) MultipartFile photoFile) {

        PathologyBillDTO generatedBill = pathologyBillService.generateBill(billDataJson, photoFile);
        return ResponseEntity.status(HttpStatus.CREATED).body(generatedBill);
    }

//    @GetMapping
//    public ResponseEntity<List<PathologyBillDTO>> getAllBills() {
//        List<PathologyBillDTO> bills = pathologyBillService.getAllBills();
//        return ResponseEntity.ok(bills);
//    }

    @GetMapping
    public ResponseEntity<List<PathologyBillDTO>> getAllBills(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        List<PathologyBillDTO> bills = pathologyBillService.getAllBills(page, size);
        return ResponseEntity.ok(bills);
    }

    @GetMapping("/{billId}")
    public ResponseEntity<PathologyBillDTO> getBillById(@PathVariable String billId) {
        PathologyBillDTO billDTO = pathologyBillService.getBillById(billId);
        return ResponseEntity.ok(billDTO);
    }

    @PutMapping("/update/{billId}")
    public ResponseEntity<PathologyBillDTO> updatePathologyBill(
//            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable String billId,
            @RequestPart("billData") String pathologyDataJson,
            @RequestPart(value = "photo", required = false) MultipartFile photoFile) {

        PathologyBillDTO updatedBill = pathologyBillService.updatePathologyBill(billId, pathologyDataJson, photoFile);
        return ResponseEntity.ok(updatedBill);
    }

    @GetMapping("/test/{testId}")
    public ResponseEntity<PathologyBillDTO> getBillByTestId(@PathVariable String testId) {
        PathologyBillDTO billDTO = pathologyBillService.getBillByTestId(testId);
        return ResponseEntity.ok(billDTO);
    }

    @PutMapping("/test/{testId}")
    public ResponseEntity<HMS_TM_PathologyTest> updateTestDetails(
//            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable("testId") String testId,
            @RequestPart("testData") String pathologyDataJson,
            @RequestPart(value = "uploadReport", required = false) MultipartFile uploadReportFile) {

        try {
            PathologyTestUpdateRequest updateDTO = objectMapper.readValue(pathologyDataJson, PathologyTestUpdateRequest.class);

            HMS_TM_PathologyTest updatedTest = pathologyBillService.updateTestDetailsByTestId(testId, updateDTO, uploadReportFile);

            return ResponseEntity.ok(updatedTest);
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/update-by-test/{testId}")
    public ResponseEntity<HMS_TM_PathologyTest> updatePathologyTestByTestId(
//            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable("testId") String testId,
            @Valid @RequestBody PathologyBillUpdateDTO updateDTO) {
        try {
            HMS_TM_PathologyTest updatedTest = pathologyBillService.updatePathologyTest(testId, updateDTO);
            return ResponseEntity.ok(updatedTest);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/remove/{billId}")
    public ResponseEntity<String> deletePathologyBill(@PathVariable String billId) {
        try {
            pathologyBillService.deletePathologyBill(billId);
            return new ResponseEntity<>("Radiology Bill marked as deleted.", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("Pathology Bill not found or cannot be deleted.", HttpStatus.NOT_FOUND);
        }
    }

//    @GetMapping("/pathology-tests")
//    public ResponseEntity<List<PathologyTestDTO>> getPathologyTestsByIds(@RequestParam List<String> ids,@RequestParam String id ) {
//        List<PathologyTestDTO> pathologyTests = pathologyBillService.getPathologyTestsByIds(ids,id);
//        return new ResponseEntity<>(pathologyTests, HttpStatus.OK);
//    }

    @GetMapping("/pathology-tests")
    public ResponseEntity<List<PathologyTestDTO>> getPathologyTestsByIds(@RequestParam List<String> ids,@RequestParam String prescriptionNo) {
        List<PathologyTestDTO> pathologyTests = pathologyBillService.getPathologyTestsByIds(ids,prescriptionNo);
        return new ResponseEntity<>(pathologyTests, HttpStatus.OK);
    }


//    @GetMapping("/pathology-income")
//    public Double getPathologyIncome() {
//        return pathologyBillService.getPathologyIncome();
//    }
    @GetMapping("/pathology-income")
    public IncomeChanges getPathologyIncome() {
        return pathologyBillService.getPathologyIncome();
    }

    @GetMapping("/pathology-monthly-income")
    public Double getPathologyMonthlyIncome() {
        return pathologyBillService.getPathologyMonthlyIncome();
    }

    @GetMapping("/OpdOrIpd/pathology-payment/{id}")
    public BillSummary getPathologyOpdAndIpdPayment(@PathVariable String id) {
        return pathologyBillService.getPathologyOpdAndIpdPayment(id);
    }

    @GetMapping("/medical-history/{patientId}")
    public Integer getMedicalHistoryPathology(@PathVariable String patientId){
        return pathologyBillService.getMedicalHistoryPathology(patientId);
    }

    @GetMapping("/increase-monthly-income")
    public IncomeChanges getPathologyIncreaseMonthlyIncome() {
        return pathologyBillService.getPathologyIncreaseMonthlyIncome();
    }

    @GetMapping("/increase-yearly-income")
    public IncomeChanges getPathologyIncreaseYearlyIncome() {
        return pathologyBillService.getPathologyIncreaseYearlyIncome();
    }

    @GetMapping("/increase-weekly-income")
    public IncomeChanges getPathologyIncreaseWeeklyIncome() {
        return pathologyBillService.getPathologyIncreaseWeeklyIncome();
    }

    @GetMapping("/ipdOrOpdId/{ipdOrOpdId}")
    public ResponseEntity<List<HMS_TM_PathologyBill>> getPathologyBillByIpdOrOpdId(@PathVariable String ipdOrOpdId) {
        List<HMS_TM_PathologyBill> pathologyBills = pathologyBillService.getPathologyBillByIpdOrOpdId(ipdOrOpdId);
        if (!pathologyBills.isEmpty()) {
            return ResponseEntity.ok(pathologyBills);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<PathologyBillResponse>> searchBills(
            @RequestParam(required = false) String sampleCollected,
            @RequestParam(required = false) String categoryName,
            @RequestParam(required = false) String testName,
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<PathologyBillResponse> response = pathologyBillService.searchBills(
                sampleCollected,
                categoryName,
                testName,
                timeDuration,
                startDate,
                endDate
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/income-list/today")
    public ResponseEntity<List<HMS_TM_PathologyBill>> getAllPathologyIncomeForToday() {
        List<HMS_TM_PathologyBill> incomeList = pathologyBillService.fetchAllPathologyIncomeForToday();
        return ResponseEntity.ok(incomeList);
    }

    @GetMapping("/income-list/month")
    public ResponseEntity<List<HMS_TM_PathologyBill>> getAllPathologyIncomeForMonth() {
        List<HMS_TM_PathologyBill> incomeList = pathologyBillService.fetchAllPathologyIncomeForMonth();
        return ResponseEntity.ok(incomeList);
    }

    @GetMapping("/income-list/year")
    public ResponseEntity<List<HMS_TM_PathologyBill>> getAllPathologyIncomeForYear() {
        List<HMS_TM_PathologyBill> incomeList = pathologyBillService.fetchAllPathologyIncomeForYear();
        return ResponseEntity.ok(incomeList);
    }


    @GetMapping("/income-list/week")
    public ResponseEntity<List<HMS_TM_PathologyBill>> getAllPathologyIncomeForWeek() {
        List<HMS_TM_PathologyBill> incomeList = pathologyBillService.fetchAllPathologyIncomeForWeek();
        return ResponseEntity.ok(incomeList);
    }

}


