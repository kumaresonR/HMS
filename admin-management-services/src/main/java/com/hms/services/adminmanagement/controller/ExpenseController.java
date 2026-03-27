package com.hms.services.adminmanagement.controller;

import com.hms.services.adminmanagement.entity.HMS_TM_Expense;
import com.hms.services.adminmanagement.entity.HMS_TW_Expense;
import com.hms.services.adminmanagement.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/expenses-head")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @PostMapping("/create")
    public ResponseEntity<List<HMS_TW_Expense>> createTwExpenses(@Valid @RequestBody List<HMS_TW_Expense> expenses) {
        return ResponseEntity.ok(expenseService.createTwExpenses(expenses));
    }

    @GetMapping("/tw/{id}")
    public ResponseEntity<HMS_TW_Expense> getTwExpenseById(@PathVariable String id) {
        try {
            HMS_TW_Expense expense = expenseService.getTwExpenseById(id);
            return ResponseEntity.ok(expense);
        } catch (RuntimeException e) {
            return ResponseEntity.ok().build();
        }
    }

    @GetMapping("/tw/all")
    public ResponseEntity<List<HMS_TW_Expense>> getAllTwExpenses() {
        List<HMS_TW_Expense> expenses = expenseService.getAllTwExpenses();
        return ResponseEntity.ok(expenses);
    }


    @PutMapping("/tw/{id}")
    public ResponseEntity<HMS_TW_Expense> updateTwExpense(
            @PathVariable String id,
            @Valid @RequestBody HMS_TW_Expense expense) {
        return ResponseEntity.ok(expenseService.updateTwExpense(id, expense));
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<HMS_TM_Expense> approveTwExpense(@PathVariable String id) {
        return ResponseEntity.ok(expenseService.approveTwExpense(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTwExpense(@PathVariable String id, @RequestParam String authStat) {
        try {
            expenseService.deleteTwExpenses(id, authStat);
            return ResponseEntity.ok("Expense deleted from TM and status updated in TW.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Expense not found or cannot be deleted.");
        }
    }

    @GetMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_Expense> getTmExpenseById(@PathVariable String id) {
        return ResponseEntity.ok(expenseService.getTmExpenseById(id));
    }

    @PutMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_Expense> updateTmExpense(
            @PathVariable String id,
            @Valid @RequestBody HMS_TM_Expense expense) {
        return ResponseEntity.ok(expenseService.updateTmExpense(id, expense));
    }

    @DeleteMapping("/tw/{id}")
    public ResponseEntity<String> deleteTwExpense(@PathVariable String id) {
        expenseService.deleteTwExpense(id);
        return ResponseEntity.ok("Expense marked as deleted.");
    }

    @GetMapping("/tm/all")
    public ResponseEntity<List<HMS_TM_Expense>> getAllTmExpenses() {
        return ResponseEntity.ok(expenseService.getAllTmExpenses());
    }
}




