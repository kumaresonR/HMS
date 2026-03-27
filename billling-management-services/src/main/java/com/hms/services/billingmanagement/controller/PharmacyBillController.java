package com.hms.services.billingmanagement.controller;

import com.hms.services.billingmanagement.model.BillSummary;
import com.hms.services.billingmanagement.entity.HMS_TM_PharmacyBill;
import com.hms.services.billingmanagement.model.IncomeChanges;
import com.hms.services.billingmanagement.model.PharmacyBillDTO;
import com.hms.services.billingmanagement.model.PharmacyBillResponse;
import com.hms.services.billingmanagement.service.PharmacyBillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/pharmacy-bill")
public class PharmacyBillController {

    @Autowired
    private PharmacyBillService pharmacyBillService;

    @PostMapping("/generate")
    public ResponseEntity<PharmacyBillDTO> generatePharmacyBill(
//            @RequestHeader("Authorization") String authorizationHeader,
            @RequestPart("medicineData") String medicineDataJson,
            @RequestPart(value = "photo", required = false) MultipartFile photoFile) {

        PharmacyBillDTO generatedBill = pharmacyBillService.generateBill(medicineDataJson, photoFile);
        return ResponseEntity.status(HttpStatus.CREATED).body(generatedBill);
    }

    @GetMapping
    public ResponseEntity<List<PharmacyBillDTO>> getAllPharmacyBills(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<PharmacyBillDTO> bills = pharmacyBillService.getAllPharmacyBills(page, size);
        return ResponseEntity.ok(bills);
    }

    @GetMapping("/{billId}")
    public ResponseEntity<PharmacyBillDTO> getPharmacyBillById(@PathVariable String billId) {
        PharmacyBillDTO bill = pharmacyBillService.getPharmacyBillById(billId);
        return ResponseEntity.ok(bill);
    }

    @PutMapping("/update/{billId}")
    public ResponseEntity<PharmacyBillDTO> updatePharmacyBill(
//            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable String billId,
            @RequestPart("medicineData") String medicineDataJson,
            @RequestPart(value = "photo", required = false) MultipartFile photoFile) {

        PharmacyBillDTO updatedBill = pharmacyBillService.updatePharmacyBill(billId, medicineDataJson, photoFile);
        return ResponseEntity.ok(updatedBill);
    }


    @DeleteMapping("/remove/{id}")
    public ResponseEntity<String> deletePharmacyBill(@PathVariable String id) {
        try {
            pharmacyBillService.deletePharmacyBill(id);
            return new ResponseEntity<>("Pharmacy Bill marked as deleted.", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("Pharmacy bill not found or cannot be deleted.", HttpStatus.NOT_FOUND);
        }
    }

//    @GetMapping("/pharmacy-income")
//    public Double getPharmacyIncome() {
//        return pharmacyBillService.getPharmacyIncome();
//    }
    @GetMapping("/pharmacy-income")
    public IncomeChanges getPharmacyIncome() {
        return pharmacyBillService.getPharmacyIncome();
    }

    @GetMapping("/pharmacy-monthly-income")
    public Double getPharmacyMonthlyIncome() {
        return pharmacyBillService.getPharmacyMonthlyIncome();
    }

    @GetMapping("/monthly-pharmacySale")
    public Map<Integer, Double> getPharmacyMonthlySalePerYear() {
        return pharmacyBillService.getPharmacyMonthlySalePerYear();
    }

    @GetMapping("/common-medicines")
    public List<Object> getCommonlyUsedMedicines() {
        return pharmacyBillService.getCommonlyUsedMedicines();
    }

    @GetMapping("/OpdOrIpd/pharmacy-payment/{id}")
    public BillSummary getPharmacyOpdAndIpdPayment(@PathVariable String id) {
        return pharmacyBillService.getPharmacyOpdAndIpdPayment(id);
    }

    @GetMapping("/medical-history/{patientId}")
    public Integer getMedicalHistoryPharmacy(@PathVariable String patientId){
        return pharmacyBillService.getMedicalHistoryPharmacy(patientId);
    }

    @GetMapping("/increase-monthly-income")
    public IncomeChanges getPharmacyIncreaseMonthlyIncome() {
        return pharmacyBillService.getPharmacyIncreaseMonthlyIncome();
    }
    @GetMapping("/increase-yearly-income")
    public IncomeChanges getPharmacyIncreaseYearlyIncome() {
        return pharmacyBillService.getPharmacyIncreaseYearlyIncome();
    }
    @GetMapping("/increase-weekly-income")
    public IncomeChanges getPharmacyIncreaseWeeklyIncome() {
        return pharmacyBillService.getPharmacyIncreaseWeeklyIncome();
    }

    @GetMapping("/ipdOrOpdId/{ipdOrOpdId}")
    public ResponseEntity<List<HMS_TM_PharmacyBill>> getPharmacyBillByIpdOrOpdId(@PathVariable String ipdOrOpdId) {
        List<HMS_TM_PharmacyBill> pharmacyBills = pharmacyBillService.getPharmacyBillByIpdOrOpdId(ipdOrOpdId);
        if (!pharmacyBills.isEmpty()) {
            return ResponseEntity.ok(pharmacyBills);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<PharmacyBillResponse>> searchPharmacyBills(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) String doctorName,
            @RequestParam(required = false) String paymentMode,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<PharmacyBillResponse> response = pharmacyBillService.searchPharmacyBills(
                timeDuration,
                doctorName,
                paymentMode,
                startDate,
                endDate
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/income-list/today")
    public ResponseEntity<List<HMS_TM_PharmacyBill>> getAllPharmacyIncomeForToday() {
        List<HMS_TM_PharmacyBill> incomeList = pharmacyBillService.fetchAllPharmacyIncomeForToday();
        return ResponseEntity.ok(incomeList);
    }


    @GetMapping("/income-list/monthly")
    public ResponseEntity<List<HMS_TM_PharmacyBill>> getAllPharmacyIncomeForMonth() {
        List<HMS_TM_PharmacyBill> incomeList = pharmacyBillService.fetchAllPharmacyIncomeForMonth();
        return ResponseEntity.ok(incomeList);
    }

    @GetMapping("/income-list/yearly")
    public ResponseEntity<List<HMS_TM_PharmacyBill>> getAllPharmacyIncomeForYear() {
        List<HMS_TM_PharmacyBill> incomeList = pharmacyBillService.fetchAllPharmacyIncomeForYear();
        return ResponseEntity.ok(incomeList);
    }

    @GetMapping("/income-list/weekly")
    public ResponseEntity<List<HMS_TM_PharmacyBill>> getAllPharmacyIncomeForWeek() {
        List<HMS_TM_PharmacyBill> incomeList = pharmacyBillService.fetchAllPharmacyIncomeForWeek();
        return ResponseEntity.ok(incomeList);
    }



    }



