package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_Expense;
import com.hms.services.adminmanagement.entity.HMS_TW_Expense;
import com.hms.services.adminmanagement.repository.HMS_TM_ExpenseRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_ExpenseRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {

    @Autowired
    private HMS_TW_ExpenseRepository twExpenseRepository;

    @Autowired
    private HMS_TM_ExpenseRepository tmExpenseRepository;

    public List<HMS_TW_Expense> createTwExpenses(List<HMS_TW_Expense> expenses) {
        return twExpenseRepository.saveAll(expenses);
    }

    public HMS_TW_Expense getTwExpenseById(String id) {
        return twExpenseRepository.findByIdAndDeletedFalse(id)
                .orElse(null);    }

    public List<HMS_TW_Expense> getAllTwExpenses() {
        return twExpenseRepository.findByDeletedFalse();
    }

    public HMS_TW_Expense updateTwExpense(String id, HMS_TW_Expense updatedExpense) {
        HMS_TW_Expense existingExpense = getTwExpenseById(id);
        existingExpense.setExpenseHead(updatedExpense.getExpenseHead());
        existingExpense.setDescription(updatedExpense.getDescription());
        existingExpense.setModNo(updatedExpense.getModNo());
        return twExpenseRepository.save(existingExpense);
    }


    public HMS_TM_Expense approveTwExpense(String id) {
        HMS_TW_Expense twExpense = getTwExpenseById(id);
        if ("UNAUTHORIZED".equals(twExpense.getAuthStat())) {
            HMS_TM_Expense tmExpense = new HMS_TM_Expense();
            tmExpense.setId(twExpense.getId());
            tmExpense.setModNo(twExpense.getModNo());
            tmExpense.setExpenseHead(twExpense.getExpenseHead());
            tmExpense.setDescription(twExpense.getDescription());
            tmExpense.setAuthStat("AUTHORIZED");
            tmExpenseRepository.save(tmExpense);

            twExpense.setAuthStat("AUTHORIZED");
            twExpense.setRecordStat("OPENED");
            twExpenseRepository.save(twExpense);

            return tmExpense;
        } else {
            throw new RuntimeException("Expense is already approved or rejected");
        }
    }

    public void deleteTwExpenses(String id, String authStat) {
        HMS_TM_Expense tmExpense = tmExpenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found in TM with id: " + id));

        if ("UNAUTHORIZED".equalsIgnoreCase(authStat)) {
            tmExpenseRepository.delete(tmExpense);
            Optional<HMS_TW_Expense> twExpenseOptional = twExpenseRepository.findById(id);

            if (twExpenseOptional.isPresent()) {
                HMS_TW_Expense twExpense = twExpenseOptional.get();
                twExpense.setAuthStat("UNAUTHORIZED");
                twExpense.setRecordStat("CLOSED");
                twExpenseRepository.save(twExpense);
            }
        } else {
            throw new RuntimeException("Invalid authorization status. Only UNAUTHORIZED status is allowed for deletion.");
        }
    }

    public HMS_TM_Expense getTmExpenseById(String id) {
        return tmExpenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found with id: " + id));
    }

    public HMS_TM_Expense updateTmExpense(String id, HMS_TM_Expense updatedExpense) {
        HMS_TM_Expense existingExpense = getTmExpenseById(id);
        existingExpense.setExpenseHead(updatedExpense.getExpenseHead());
        existingExpense.setDescription(updatedExpense.getDescription());
        return tmExpenseRepository.save(existingExpense);
    }

    public void deleteTwExpense(String id) {
        HMS_TW_Expense expense = getTwExpenseById(id);
        expense.setDeleted(true);
        twExpenseRepository.save(expense);
    }

    public List<HMS_TM_Expense> getAllTmExpenses() {
        return tmExpenseRepository.findAll();
    }
}




