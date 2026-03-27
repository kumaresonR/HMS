package com.hms.services.financemanagement.controller;

import com.hms.services.financemanagement.entity.HMS_TM_Income;
import com.hms.services.financemanagement.entity.IncomeChanges;
import com.hms.services.financemanagement.exceptionhandler.CustomException;
import com.hms.services.financemanagement.service.IncomeRecordService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/income-records")
public class IncomeRecordController {

    @Autowired
    private IncomeRecordService incomeRecordService;

    @PostMapping("/create")
    public ResponseEntity<HMS_TM_Income> createIncomeRecord(
            @RequestPart("incomeRecordData") String incomeRecordDataJson,
            @RequestPart(value = "attachment", required = false) MultipartFile attachmentFile) {

        try {
            HMS_TM_Income createdRecord = incomeRecordService.generateIncomeRecord(incomeRecordDataJson, attachmentFile);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRecord);
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<HMS_TM_Income>> getAllIncomeRecords() {
        List<HMS_TM_Income> records = incomeRecordService.getAllIncomeRecords();
        return records.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(records);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HMS_TM_Income> getIncomeRecordById(@PathVariable String id) {
        return incomeRecordService.getIncomeRecordById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<HMS_TM_Income> updateIncomeRecord(
            @PathVariable String id,
            @RequestPart("incomeRecordData") String incomeRecordDataJson,
            @RequestPart(value = "attachment", required = false) MultipartFile attachmentFile) {

        try {
            HMS_TM_Income updatedRecord = incomeRecordService.updateIncomeRecord(id, incomeRecordDataJson, attachmentFile);
            return ResponseEntity.ok(updatedRecord);
        } catch (IOException | CustomException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteIncomeRecord(@PathVariable String id) {
        try {
            incomeRecordService.softDeleteIncomeRecord(id);
            return ResponseEntity.ok("Record marked as deleted.");
        } catch (CustomException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Income record not found or cannot be deleted.");
        }
    }

    @GetMapping("/amount")
    public IncomeChanges getGeneralIncomeAmount() {
        return incomeRecordService.getGeneralIncomeAmount();
    }

    @GetMapping("/monthly-amount")
    public Double getMonthlyGeneralIncomeAmount() {
        return incomeRecordService.getMonthlyGeneralIncomeAmount();
    }

    @GetMapping("/monthly-income")
    public Map<Integer, Double> getMonthlyGeneralIncomePerYear() {
        return incomeRecordService.getMonthlyGeneralIncomePerYear();
    }

    @GetMapping("/increase-monthly-income")
    public IncomeChanges getIncreaseMonthlyIncome() {
        return incomeRecordService.getIncreaseMonthlyIncome();
    }
    @GetMapping("/increase-yearly-income")
    public IncomeChanges getIncreaseYearlyIncome() {
        return incomeRecordService.getIncreaseYearlyIncome();
    }
    @GetMapping("/increase-weekly-income")
    public IncomeChanges getIncreaseWeeklyIncome() {
        return incomeRecordService.getIncreaseWeeklyIncome();
    }


    @GetMapping("/additional-income/search")
    public ResponseEntity<Map<String, Object>> searchAdditionalIncome(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Pageable pageable) {
        Map<String, Object> response = incomeRecordService.searchAdditionalIncome(
                timeDuration, startDate, endDate, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/additional-income/export/excel")
    public void exportAdditionalIncomesToExcel(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            HttpServletResponse response) throws IOException {
        incomeRecordService.generateExcelReport(timeDuration, startDate, endDate, response);
    }

}


