package com.hms.services.financemanagement.controller;

import com.hms.services.financemanagement.entity.HMS_TM_DailyIncome;
import com.hms.services.financemanagement.service.ProfitAndLossServices;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reports")
public class ProfitAndLossController {

    @Autowired
    private ProfitAndLossServices profitAndLossServices;


    @GetMapping("/income/search")
    public ResponseEntity<Map<String, Object>> searchIncomeBills(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Pageable pageable) {
        Map<String, Object> response = profitAndLossServices.SearchDailyIncomeBills(
                timeDuration, startDate, endDate, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/income/export/excel")
    public void exportIncomeToExcel(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            HttpServletResponse response) throws IOException {
        profitAndLossServices.generateExcelReport(timeDuration,startDate, endDate, response);
    }


    @GetMapping("/expense/search")
    public ResponseEntity<Map<String, Object>> searchExpenseBills(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Pageable pageable) {
        Map<String, Object> response = profitAndLossServices.SearchDailyExpenseBills(
                timeDuration, startDate, endDate, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/expense/export/excel")
    public void exportExpensesToExcel(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            HttpServletResponse response) throws IOException {
        profitAndLossServices.exportExpensesToExcel(timeDuration,startDate, endDate, response);
    }


    @GetMapping("/profitOrLoss/search")
    public ResponseEntity<Map<String, Object>> searchProfitOrLossBills(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Pageable pageable) {
        Map<String, Object> response = profitAndLossServices.SearchDailyProfitOrLossBills(
                timeDuration, startDate, endDate, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/profitOrLoss/export/excel")
    public void exportProfitOrLossToExcel(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            HttpServletResponse response) throws IOException {
        profitAndLossServices.exportProfitOrLossToExcel(timeDuration,startDate, endDate, response);
    }



}


