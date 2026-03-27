package com.hms.services.financemanagement.controller;

import com.hms.services.financemanagement.entity.HMS_TM_Expense;
import com.hms.services.financemanagement.entity.IncomeChanges;
import com.hms.services.financemanagement.exceptionhandler.CustomException;
import com.hms.services.financemanagement.service.ExpenseService;
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
@RequestMapping("/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @PostMapping("/create")
    public ResponseEntity<HMS_TM_Expense> createExpense(
            @RequestPart("expenseData") String expenseDataJson,
            @RequestPart(value = "attachment", required = false) MultipartFile attachmentFile) {

        try {
            HMS_TM_Expense createdExpense = expenseService.addExpense(expenseDataJson, attachmentFile);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdExpense);
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<HMS_TM_Expense>> getAllExpenses() {
        List<HMS_TM_Expense> expenses = expenseService.getAllExpenses();
        return expenses.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(expenses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HMS_TM_Expense> getExpenseById(@PathVariable String id) {
        return expenseService.getExpenseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<HMS_TM_Expense> updateExpense(
            @PathVariable String id,
            @RequestPart("expenseData") String expenseDataJson,
            @RequestPart(value = "attachment", required = false) MultipartFile attachmentFile) {

        try {
            HMS_TM_Expense updatedExpense = expenseService.updateExpense(id, expenseDataJson, attachmentFile);
            return ResponseEntity.ok(updatedExpense);
        } catch (IOException | CustomException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable String id) {
        try {
            expenseService.softDeleteExpense(id);
            return ResponseEntity.ok("Expense marked as deleted.");
        } catch (CustomException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Expense not found or cannot be deleted.");
        }
    }

    @GetMapping("/amount")
    public IncomeChanges getExpenseAmount() {
        return expenseService.getExpenseAmount();
    }

    @GetMapping("/monthly-amount")
    public Double getMonthlyExpenseAmount() {
        return expenseService.getMonthlyExpenseAmount();
    }

    @GetMapping("/monthly-expense")
    public Map<Integer, Double> getMonthlyExpensePerYear() {
        return expenseService.getMonthlyExpensePerYear();
    }

    @GetMapping("/increase-monthly-income")
    public IncomeChanges getIncreaseMonthlyExpense() {
        return expenseService.getIncreaseMonthlyExpense();
    }

    @GetMapping("/increase-yearly-income")
    public IncomeChanges getIncreaseYearlyExpense() {
        return expenseService.getIncreaseYearlyExpense();
    }

    @GetMapping("/increase-weekly-income")
    public IncomeChanges getIncreaseWeeklyExpense() {
        return expenseService.getIncreaseWeeklyExpense();
    }

    @GetMapping("/list/today")
    public ResponseEntity<List<HMS_TM_Expense>> getAllExpensesForToday() {
        List<HMS_TM_Expense> expenseList = expenseService.fetchAllExpensesForToday();
        return ResponseEntity.ok(expenseList);
    }

    @GetMapping("/list/month")
    public ResponseEntity<List<HMS_TM_Expense>> getAllExpensesForCurrentMonth() {
        List<HMS_TM_Expense> expenseList = expenseService.fetchAllExpensesForCurrentMonth();
        return ResponseEntity.ok(expenseList);
    }

    @GetMapping("/list/year")
    public ResponseEntity<List<HMS_TM_Expense>> getAllExpensesForCurrentYear() {
        List<HMS_TM_Expense> expenseList = expenseService.fetchAllExpensesForCurrentYear();
        return ResponseEntity.ok(expenseList);
    }

    @GetMapping("/list/week")
    public ResponseEntity<List<HMS_TM_Expense>> getAllExpensesForCurrentWeek() {
        List<HMS_TM_Expense> expenseList = expenseService.fetchAllExpensesForCurrentWeek();
        return ResponseEntity.ok(expenseList);
    }

    @GetMapping("/additional-expense/search")
    public ResponseEntity<Map<String, Object>> searchAdditionalExpense(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Pageable pageable) {
        Map<String, Object> response = expenseService.searchAdditionalExpense(
                timeDuration, startDate, endDate, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/additional-expense/export/excel")
    public void exportExpensesToExcel(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            HttpServletResponse response) throws IOException {
        expenseService.generateExcelReport(timeDuration,startDate, endDate, response);
    }

}


