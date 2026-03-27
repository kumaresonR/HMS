package com.hms.services.financemanagement.service;

import com.hms.services.financemanagement.entity.*;
import com.hms.services.financemanagement.repository.*;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MonthlyProfitAndLossServices {

    @Autowired
    private MonthlyIncomeRepository monthlyIncomeRepository;


    @Autowired
    private MonthlyExpenseRepository monthlyExpenseRepository;

    @Autowired
    private MonthlyProfitOrLossRepository monthlyprofitOrLossRepository;

    public Map<String, Object> searchMonthlyIncomeBills(int month, int year, Pageable pageable) {
        Page<HMS_TM_MonthlyIncome> incomePage = monthlyIncomeRepository.findByMonthAndYear(month, year, pageable);
        long totalRecords = monthlyIncomeRepository.countByMonthAndYear(month, year);

        Map<String, Object> response = new HashMap<>();
        response.put("type", "monthly");
        response.put("month", month);
        response.put("year", year);
        response.put("totalRecords", totalRecords);
        response.put("data", incomePage.getContent());
        response.put("currentPage", incomePage.getNumber());
        response.put("totalPages", incomePage.getTotalPages());
        return response;
    }

    public Map<String, Object> searchYearlyIncomeBills(int year, Pageable pageable) {
        Page<HMS_TM_MonthlyIncome> incomePage = monthlyIncomeRepository.findByYear(year, pageable);
        long totalRecords = monthlyIncomeRepository.countByYear(year);
        Map<String, Object> response = new HashMap<>();
        response.put("type", "yearly");
        response.put("year", year);
//        response.put("totalIncome", totalIncome != null ? totalIncome : BigDecimal.ZERO);
        response.put("totalRecords", totalRecords);
        response.put("data", incomePage.getContent());
        response.put("currentPage", incomePage.getNumber());
        response.put("totalPages", incomePage.getTotalPages());
        return response;
    }

    public Map<String, Object> searchMonthlyExpenseBills(Integer month, int year, Pageable pageable) {
        Page<HMS_TM_MonthlyExpense> incomePage = monthlyExpenseRepository.findByMonthAndYear(month, year, pageable);
        long totalRecords = monthlyExpenseRepository.countByMonthAndYear(month, year);
        Map<String, Object> response = new HashMap<>();
        response.put("type", "monthly");
        response.put("month", month);
        response.put("year", year);
        response.put("totalRecords", totalRecords);
        response.put("data", incomePage.getContent());
        response.put("currentPage", incomePage.getNumber());
        response.put("totalPages", incomePage.getTotalPages());
        return response;

    }

    public Map<String, Object> searchYearlyExpenseBills(int year, Pageable pageable) {
        Page<HMS_TM_MonthlyExpense> incomePage = monthlyExpenseRepository.findByYear(year, pageable);
        long totalRecords = monthlyExpenseRepository.countByYear(year);
        Map<String, Object> response = new HashMap<>();
        response.put("type", "yearly");
        response.put("year", year);
//        response.put("totalIncome", totalIncome != null ? totalIncome : BigDecimal.ZERO);
        response.put("totalRecords", totalRecords);
        response.put("data", incomePage.getContent());
        response.put("currentPage", incomePage.getNumber());
        response.put("totalPages", incomePage.getTotalPages());
        return response;
    }

    public Map<String, Object> searchProfitAndLossBills(Integer month, int year, Pageable pageable) {
        Page<HMS_TM_DailyProfitAndLoss> incomePage = monthlyprofitOrLossRepository.findByMonthAndYear(month, year, pageable);
        long totalRecords = monthlyprofitOrLossRepository.countByMonthAndYear(month, year);
        Map<String, Object> response = new HashMap<>();
        response.put("type", "monthly");
        response.put("month", month);
        response.put("year", year);
        response.put("totalRecords", totalRecords);
        response.put("data", incomePage.getContent());
        response.put("currentPage", incomePage.getNumber());
        response.put("totalPages", incomePage.getTotalPages());
        return response;
    }

    public Map<String, Object> searchYearlyProfitAndLossBills(int year, Pageable pageable) {
        Page<HMS_TM_DailyProfitAndLoss> incomePage = monthlyprofitOrLossRepository.findByYear(year, pageable);
        long totalRecords = monthlyprofitOrLossRepository.countByYear(year);
        Map<String, Object> response = new HashMap<>();
        response.put("type", "yearly");
        response.put("year", year);
//        response.put("totalIncome", totalIncome != null ? totalIncome : BigDecimal.ZERO);
        response.put("totalRecords", totalRecords);
        response.put("data", incomePage.getContent());
        response.put("currentPage", incomePage.getNumber());
        response.put("totalPages", incomePage.getTotalPages());
        return response;
    }


    public void generateExcelReport(String timeDuration,LocalDate startDate, LocalDate endDate, HttpServletResponse response) throws IOException {

        LocalDateTime[] dateRange = calculateDateRange(timeDuration, startDate, endDate);
        LocalDateTime startDateTime = dateRange[0];
        LocalDateTime endDateTime = dateRange[1];
        // Fetch data using native query
        List<Object[]> expenses = monthlyIncomeRepository.findIncomeAsRawData(startDateTime.toLocalDate(), endDateTime.toLocalDate());

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Income");


        Row headerRow = sheet.createRow(0);
        String[] columns = {"IncomeId", "moduleName", "TotalAmount", "Month", "Year", "Date", "CreatedAt"};
        for (int i = 0; i < columns.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(columns[i]);
            cell.setCellStyle(getHeaderCellStyle(workbook));
        }

        int rowNum = 1;
        for (Object[] row : expenses) {
            Row excelRow = sheet.createRow(rowNum++);
            excelRow.createCell(0).setCellValue(row[0].toString());  // ID
            excelRow.createCell(1).setCellValue(row[1].toString());  // Date
            excelRow.createCell(2).setCellValue(Double.parseDouble(row[2].toString()));  // Amount
            excelRow.createCell(3).setCellValue(row[3].toString());
            excelRow.createCell(4).setCellValue(row[4].toString());
            excelRow.createCell(5).setCellValue(row[5].toString());
            excelRow.createCell(6).setCellValue(row[6].toString());
        }

        for (int i = 0; i < columns.length; i++) {
            sheet.autoSizeColumn(i);
        }

        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=income_report.xlsx");
        workbook.write(response.getOutputStream());
        workbook.close();
    }

    private LocalDateTime[] calculateDateRange(String timeDuration, LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = null;
        LocalDateTime endDateTime = null;
        LocalDateTime now = LocalDateTime.now();

        if (timeDuration != null) {
            switch (timeDuration.toUpperCase()) {
                case "DAILY":
                    startDateTime = now.toLocalDate().atStartOfDay();
                    endDateTime = now.toLocalDate().atTime(23, 59, 59);
                    break;
                case "WEEKLY":
                    startDateTime = now.toLocalDate().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).atStartOfDay();
                    endDateTime = now.toLocalDate().with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY)).atTime(23, 59, 59);
                    break;
                case "MONTHLY":
                    startDateTime = now.toLocalDate().withDayOfMonth(1).atStartOfDay();
                    endDateTime = now.toLocalDate().with(TemporalAdjusters.lastDayOfMonth()).atTime(23, 59, 59);
                    break;
                case "YEARLY":
                    startDateTime = now.toLocalDate().withDayOfYear(1).atStartOfDay();
                    endDateTime = now.toLocalDate().with(TemporalAdjusters.lastDayOfYear()).atTime(23, 59, 59);
                    break;
                case "LAST_YEAR":
                    LocalDate lastYear = now.toLocalDate().minusYears(1);
                    startDateTime = lastYear.withDayOfYear(1).atStartOfDay();
                    endDateTime = lastYear.with(TemporalAdjusters.lastDayOfYear()).atTime(23, 59, 59);
                    break;
                case "CUSTOM":
                    startDateTime = (startDate != null) ? startDate.atStartOfDay() : null;
                    endDateTime = (endDate != null) ? endDate.atTime(23, 59, 59) : null;
                    break;
            }
        } else if (startDate != null || endDate != null) {
            startDateTime = (startDate != null) ? startDate.atStartOfDay() : null;
            endDateTime = (endDate != null) ? endDate.atTime(23, 59, 59) : null;
        }

        return new LocalDateTime[]{startDateTime, endDateTime};
    }

    private CellStyle getHeaderCellStyle(Workbook workbook) {
        CellStyle headerStyle = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        headerStyle.setFont(font);
        return headerStyle;
    }

    public void exportExpensesToExcel(String timeDuration, LocalDate startDate, LocalDate endDate, HttpServletResponse response) throws IOException {
        LocalDateTime[] dateRange = calculateDateRange(timeDuration, startDate, endDate);
        LocalDateTime startDateTime = dateRange[0];
        LocalDateTime endDateTime = dateRange[1];
        List<HMS_TM_MonthlyExpense> expenses = monthlyExpenseRepository.findAllExpensesByDateRange(startDateTime, endDateTime);
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Expenses");
        // Create header row
        Row headerRow = sheet.createRow(0);
        String[] columns = {"ExpenseId", "ModuleName", "TotalAmount", "Month", "Year", "Date", "CreatedAt"};
        for (int i = 0; i < columns.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(columns[i]);
            cell.setCellStyle(getHeaderCellStyle(workbook));
        }

        // Populate data rows
        int rowNum = 1;
        for (HMS_TM_MonthlyExpense expense : expenses) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(expense.getExpenseId());
            row.createCell(1).setCellValue(expense.getDate().toString());
            row.createCell(2).setCellValue(expense.getTotalAmount().doubleValue());
            row.createCell(3).setCellValue(expense.getModuleName());
            row.createCell(4).setCellValue(expense.getMonth());
            row.createCell(5).setCellValue(expense.getYear());
            row.createCell(6).setCellValue(expense.getCreatedAt().toString());

        }

        // Auto-size columns
        for (int i = 0; i < columns.length; i++) {
            sheet.autoSizeColumn(i);
        }

        // Set response headers
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=expense_report.xlsx");

        // Write workbook to response output stream
        workbook.write(response.getOutputStream());
        workbook.close();
    }


    public void exportProfitOrLossToExcel(String timeDuration,LocalDate startDate, LocalDate endDate, HttpServletResponse response) throws IOException {
        LocalDateTime[] dateRange = calculateDateRange(timeDuration, startDate, endDate);
        LocalDateTime startDateTime = dateRange[0];
        LocalDateTime endDateTime = dateRange[1];
        List<HMS_TM_DailyProfitAndLoss> profitOrLossRecords = monthlyprofitOrLossRepository.findAllProfitOrLossByDateRange(startDateTime, endDateTime);

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Profit or Loss Report");

        // Create header row
        Row headerRow = sheet.createRow(0);
        String[] columns = {"ID", "TotalIncome", "TotalExpense", "ProfitOrLoss", "year", "month","ModuleName","Date"};
        for (int i = 0; i < columns.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(columns[i]);
            cell.setCellStyle(getHeaderCellStyle(workbook));
        }

        // Populate data rows
        int rowNum = 1;
        for (HMS_TM_DailyProfitAndLoss record : profitOrLossRecords) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(record.getId());
            row.createCell(1).setCellValue(record.getTotalIncome().doubleValue());
            row.createCell(2).setCellValue(record.getTotalExpense().doubleValue());
            row.createCell(3).setCellValue(record.getProfitOrLoss().doubleValue());
            row.createCell(4).setCellValue(record.getYear());
            row.createCell(5).setCellValue(record.getMonth());
            row.createCell(6).setCellValue(record.getModuleName());
            row.createCell(7).setCellValue(record.getDate().toString());
            row.createCell(8).setCellValue(record.getCreatedAt());
        }

        // Auto-size columns
        for (int i = 0; i < columns.length; i++) {
            sheet.autoSizeColumn(i);
        }

        // Set response headers
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=profit_or_loss_report.xlsx");

        // Write workbook to response output stream
        workbook.write(response.getOutputStream());
        workbook.close();
    }


}

