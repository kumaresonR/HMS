package com.hms.services.financemanagement.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.services.financemanagement.entity.HMS_TM_Expense;
import com.hms.services.financemanagement.entity.HMS_TM_Income;
import com.hms.services.financemanagement.entity.IncomeChanges;
import com.hms.services.financemanagement.exceptionhandler.CustomException;
import com.hms.services.financemanagement.model.AdditionalExpenseDTO;
import com.hms.services.financemanagement.repository.ExpenseRepository;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.IsoFields;
import java.util.*;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private ProfitAndLossServices profitAndLossServices;

    @Autowired
    private IncomeRecordService incomeRecordService;

    public HMS_TM_Expense addExpense(String expenseDataJson, MultipartFile attachmentFile) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        HMS_TM_Expense expense = objectMapper.readValue(expenseDataJson, HMS_TM_Expense.class);

        if (attachmentFile != null) {
            byte[] documentBytes = attachmentFile.getBytes();
            String attachmentUrl = Base64.getEncoder().encodeToString(documentBytes);
            expense.setAttachment(attachmentUrl);
        }

        return expenseRepository.save(expense);
    }

    @Transactional
    public List<HMS_TM_Expense> getAllExpenses() {
        return expenseRepository.findByIsDeletedFalse();
    }

    @Transactional
    public Optional<HMS_TM_Expense> getExpenseById(String id) {
        return expenseRepository.findByExpenseIdAndIsDeletedFalse(id);
    }

    public HMS_TM_Expense updateExpense(String id, String expenseDataJson, MultipartFile attachmentFile) throws IOException, CustomException {
        HMS_TM_Expense existingExpense = expenseRepository.findById(id)
                .orElseThrow(() -> new CustomException("Expense not found"));

        ObjectMapper objectMapper = new ObjectMapper();
        HMS_TM_Expense updatedExpense = objectMapper.readValue(expenseDataJson, HMS_TM_Expense.class);

        existingExpense.setExpenseHead(updatedExpense.getExpenseHead());
        existingExpense.setName(updatedExpense.getName());
        existingExpense.setInvoiceNumber(updatedExpense.getInvoiceNumber());
        existingExpense.setDate(updatedExpense.getDate());
        existingExpense.setAmount(updatedExpense.getAmount());
        existingExpense.setDescription(updatedExpense.getDescription());
        existingExpense.setDeleted(updatedExpense.isDeleted());

        if (attachmentFile != null) {
            byte[] documentBytes = attachmentFile.getBytes();
            String attachmentUrl = Base64.getEncoder().encodeToString(documentBytes);
            existingExpense.setAttachment(attachmentUrl);
        }

        return expenseRepository.save(existingExpense);
    }

    public void softDeleteExpense(String id) throws CustomException {
        HMS_TM_Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new CustomException("Expense not found"));
        expense.setDeleted(true);
        expenseRepository.save(expense);
    }

    public IncomeChanges getExpenseAmount() {
        Double todayExpense = expenseRepository.getTotalExpenseAmount();
        LocalDate yesterday = LocalDate.now().minusDays(1);
        Double yesterdayExpense = expenseRepository.getYesterdayExpenseAmount(yesterday);
        todayExpense = (todayExpense != null) ? todayExpense : 0.0;
        yesterdayExpense = (yesterdayExpense != null) ? yesterdayExpense : 0.0;
        String percentageChange;
        if (yesterdayExpense == 0.0) {
            percentageChange = (todayExpense > 0) ? "100% increase" : "No change";
        } else {
            double percentage = ((todayExpense - yesterdayExpense) / yesterdayExpense) * 100;
            percentageChange = String.format("%+.2f%%", percentage);
        }
        return new IncomeChanges(todayExpense, percentageChange);
    }

    public Double getMonthlyExpenseAmount() {
        Double monthlyExpense = expenseRepository.getMonthlyTotalExpenseAmount();
        return (monthlyExpense != null) ? monthlyExpense : 0.0;
    }
public Map<Integer, Double> getMonthlyExpensePerYear() {
    List<Object[]> monthlyIncomes = expenseRepository.getMonthlyExpenseForYear();
    Map<Integer, Double> incomeByMonth = new HashMap<>();
    for (Object[] row : monthlyIncomes) {
        Integer month = ((Number) row[0]).intValue();
        Double total = ((Number) row[1]).doubleValue();
        incomeByMonth.put(month, total);
    }
    for (int i = 1; i <= 12; i++) {
        incomeByMonth.putIfAbsent(i, 0.0);
    }
    return incomeByMonth;
}

    public IncomeChanges getIncreaseYearlyExpense() {
        int currentYear = LocalDate.now().getYear();
        int previousYear = currentYear - 1;
        Double currentYearExpense = expenseRepository.getYearlyExpenseAmount(currentYear);
        Double previousYearExpense = expenseRepository.getYearlyExpenseAmount(previousYear);
        currentYearExpense = (currentYearExpense != null) ? currentYearExpense : 0.0;
        previousYearExpense = (previousYearExpense != null) ? previousYearExpense : 0.0;
        String percentageChange;
        if (previousYearExpense == 0.0) {
            percentageChange = (currentYearExpense > 0) ? "100% increase" : "No change";
        } else {
            double percentage = ((currentYearExpense - previousYearExpense) / previousYearExpense) * 100;
            percentageChange = String.format("%+.2f%%", percentage);
        }
        return new IncomeChanges(currentYearExpense, percentageChange);

    }


    public IncomeChanges getIncreaseMonthlyExpense() {
        int currentMonth = LocalDate.now().getMonthValue();
        int currentYear = LocalDate.now().getYear();
        LocalDate previousMonthDate = LocalDate.now().minusMonths(1);
        int previousMonth = previousMonthDate.getMonthValue();
        int previousYear = previousMonthDate.getYear();
        Double currentMonthExpense = expenseRepository.getMonthlyExpenseAmount(currentMonth, currentYear);
        Double previousMonthExpense = expenseRepository.getMonthlyExpenseAmount(previousMonth, previousYear);
        currentMonthExpense = (currentMonthExpense != null) ? currentMonthExpense : 0.0;
        previousMonthExpense = (previousMonthExpense != null) ? previousMonthExpense : 0.0;
        String percentageChange;
        if (previousMonthExpense == 0.0) {
            percentageChange = (currentMonthExpense > 0) ? "100% increase" : "No change";
        } else {
            double percentage = ((currentMonthExpense - previousMonthExpense) / previousMonthExpense) * 100;
            percentageChange = String.format("%+.2f%%", percentage);
        }
        return new IncomeChanges(currentMonthExpense, percentageChange);
    }


    public IncomeChanges getIncreaseWeeklyExpense() {
        int currentWeek = LocalDate.now().get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
        int currentYear = LocalDate.now().getYear();
        LocalDate previousWeekDate = LocalDate.now().minusWeeks(1);
        int previousWeek = previousWeekDate.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
        int previousYear = previousWeekDate.getYear();
        Double currentWeekExpense = expenseRepository.getWeeklyExpenseAmount(currentWeek, currentYear);
        Double previousWeekExpense = expenseRepository.getWeeklyExpenseAmount(previousWeek, previousYear);
        currentWeekExpense = (currentWeekExpense != null) ? currentWeekExpense : 0.0;
        previousWeekExpense = (previousWeekExpense != null) ? previousWeekExpense : 0.0;
        String percentageChange;
        if (previousWeekExpense == 0.0) {
            percentageChange = (currentWeekExpense > 0) ? "100% increase" : "No change";
        } else {
            double percentage = ((currentWeekExpense - previousWeekExpense) / previousWeekExpense) * 100;
            percentageChange = String.format("%+.2f%%", percentage);
        }
        return new IncomeChanges(currentWeekExpense, percentageChange);
    }

@Transactional
    public List<HMS_TM_Expense> fetchAllExpensesForToday() {
        return expenseRepository.getAllExpensesForToday();
    }
@Transactional
    public List<HMS_TM_Expense> fetchAllExpensesForCurrentMonth() {
        int currentMonth = LocalDate.now().getMonthValue();
        int currentYear = LocalDate.now().getYear();
        return expenseRepository.getAllExpensesForCurrentMonth(currentMonth, currentYear);
    }
@Transactional
    public List<HMS_TM_Expense> fetchAllExpensesForCurrentYear() {
        int currentYear = LocalDate.now().getYear();
        return expenseRepository.getAllExpensesForCurrentYear(currentYear);
    }
@Transactional
    public List<HMS_TM_Expense> fetchAllExpensesForCurrentWeek() {
        int currentWeek = LocalDate.now().get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
        int currentYear = LocalDate.now().getYear();
        return expenseRepository.getAllExpensesForCurrentWeek(currentWeek, currentYear);
    }

    @Transactional
    public Map<String, Object> searchAdditionalExpense(
            String timeDuration, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        LocalDateTime[] dateRange = profitAndLossServices.calculateDateRange(timeDuration, startDate, endDate);
        LocalDateTime startDateTime = dateRange[0];
        LocalDateTime endDateTime = dateRange[1];

        // Fetch data from repository
        Page<HMS_TM_Expense> expensePage = expenseRepository.findExpenseByDateRange(startDateTime, endDateTime, pageable);
        long totalRecords = expenseRepository.countByDateRange(startDateTime, endDateTime);

        List<AdditionalExpenseDTO> formattedList = expensePage.getContent().stream()
                .map(expense -> new AdditionalExpenseDTO(
                        expense.getExpenseId(),
                        expense.getExpenseHead(),
                        expense.getName(),
                        expense.getInvoiceNumber(),
                        incomeRecordService.convertToLocalDateTime(expense.getDate()), // convert java.util.Date to LocalDateTime
                        expense.getAmount(),
                        expense.getAttachment(),
                        expense.getDescription()
                ))
                .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("totalRecords", totalRecords);
        response.put("data", formattedList);
        response.put("currentPage", expensePage.getNumber());
        response.put("totalPages", expensePage.getTotalPages());

        return response;
    }

    public void generateExcelReport(String timeDuration, LocalDate startDate, LocalDate endDate, HttpServletResponse response) throws IOException {
        LocalDateTime[] dateRange = profitAndLossServices.calculateDateRange(timeDuration, startDate, endDate);
        LocalDateTime startDateTime = dateRange[0];
        LocalDateTime endDateTime = dateRange[1];
        // Fetch data using native query
        List<Object[]> expenses = expenseRepository.findExpenseAsRawData(startDateTime.toLocalDate(),endDateTime.toLocalDate());

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Additional Expense");

        // Header
        Row headerRow = sheet.createRow(0);
        String[] columns = {"Expense Id", "Name", "Invoice Number", "Date", "Description", "Expense Head", "Amount"};
        for (int i = 0; i < columns.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(columns[i]);
            cell.setCellStyle(profitAndLossServices.getHeaderCellStyle(workbook));
        }

        // Data rows
        int rowNum = 1;
        for (Object[] row : expenses) {
            Row excelRow = sheet.createRow(rowNum++);
            excelRow.createCell(0).setCellValue(row[0].toString());
            excelRow.createCell(1).setCellValue(row[1].toString());
            excelRow.createCell(2).setCellValue(row[2].toString());
            excelRow.createCell(3).setCellValue(row[3].toString());
            excelRow.createCell(4).setCellValue(row[4].toString());
            excelRow.createCell(5).setCellValue(row[5].toString());
            excelRow.createCell(6).setCellValue(row[6].toString());
        }

        // Auto-size columns
        for (int i = 0; i < columns.length; i++) {
            sheet.autoSizeColumn(i);
        }

        // Set response headers
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=additional_expense_report_" + timeDuration + ".xlsx");

        workbook.write(response.getOutputStream());
        workbook.close();
    }

}


