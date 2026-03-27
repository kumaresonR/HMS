package com.hms.services.financemanagement.service;

import com.hms.services.financemanagement.entity.HMS_TM_DailyExpense;
import com.hms.services.financemanagement.entity.HMS_TM_DailyIncome;
import com.hms.services.financemanagement.entity.HMS_TM_DailyProfitAndLoss;
import com.hms.services.financemanagement.repository.DailyExpenseRepository;
import com.hms.services.financemanagement.repository.DailyIncomeRepository;
import com.hms.services.financemanagement.repository.ProfitOrLossRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.time.temporal.TemporalAdjusters;

@Service
public class ProfitAndLossServices {

    @Autowired
    private DailyIncomeRepository dailyIncomeRepository;


    @Autowired
    private DailyExpenseRepository dailyExpenseRepository;

    @Autowired
    private ProfitOrLossRepository profitOrLossRepository;


    public Map<String, Object> SearchDailyIncomeBills(
            String timeDuration, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        LocalDateTime[] dateRange = calculateDateRange(timeDuration, startDate, endDate);
        LocalDateTime startDateTime = dateRange[0];
        LocalDateTime endDateTime = dateRange[1];

        // Fetch data from repository
        Page<HMS_TM_DailyIncome> incomePage = dailyIncomeRepository.findIncomeByDateRange(startDateTime, endDateTime, pageable);
//        BigDecimal totalIncome = dailyIncomeRepository.findTotalIncomeByDateRange(startDate, endDate);
        long totalRecords = dailyIncomeRepository.countByDateRange(startDateTime, endDateTime);

        // Prepare response
        Map<String, Object> response = new HashMap<>();
//        response.put("totalAmount", totalIncome != null ? totalIncome : BigDecimal.ZERO);
        response.put("totalRecords", totalRecords);
        response.put("data", incomePage.getContent());
        response.put("currentPage", incomePage.getNumber());
        response.put("totalPages", incomePage.getTotalPages());

        return response;
    }

    public LocalDateTime[] calculateDateRange(String timeDuration, LocalDate startDate, LocalDate endDate) {
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
    public Map<String, Object> SearchDailyExpenseBills(String timeDuration, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        LocalDateTime[] dateRange = calculateDateRange(timeDuration, startDate, endDate);
        LocalDateTime startDateTime = dateRange[0];
        LocalDateTime endDateTime = dateRange[1];
        Page<HMS_TM_DailyExpense> incomePage = dailyExpenseRepository.findExpenseByDateRange(startDateTime, endDateTime, pageable);
//        BigDecimal totalIncome = dailyExpenseRepository.findTotalExpenseByDateRange(startDate, endDate);
        long totalRecords = dailyExpenseRepository.countByDateRange(startDateTime, endDateTime);
        Map<String, Object> response = new HashMap<>();
//        response.put("totalAmount", totalIncome != null ? totalIncome : BigDecimal.ZERO);
        response.put("totalRecords", totalRecords);
        response.put("data", incomePage.getContent());
        response.put("currentPage", incomePage.getNumber());
        response.put("totalPages", incomePage.getTotalPages());
        return response;
    }

    public Map<String, Object> SearchDailyProfitOrLossBills(String timeDuration, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        LocalDateTime[] dateRange = calculateDateRange(timeDuration, startDate, endDate);
        LocalDateTime startDateTime = dateRange[0];
        LocalDateTime endDateTime = dateRange[1];
        Page<HMS_TM_DailyProfitAndLoss> incomePage = profitOrLossRepository.findProfitOrLossByDateRange(startDateTime, endDateTime, pageable);
//        BigDecimal totalIncome = profitOrLossRepository.findTotalProfitOrLossByDateRange(startDate, endDate);
        long totalRecords = profitOrLossRepository.countByDateRange(startDateTime, endDateTime);
        Map<String, Object> response = new HashMap<>();
//        response.put("totalAmount", totalIncome != null ? totalIncome : BigDecimal.ZERO);
        response.put("totalRecords", totalRecords);
        response.put("data", incomePage.getContent());
        response.put("currentPage", incomePage.getNumber());
        response.put("totalPages", incomePage.getTotalPages());
        return response;

    }


    public void generateExcelReport(String timeDuration, LocalDate startDate, LocalDate endDate, HttpServletResponse response) throws IOException {
        LocalDateTime[] dateRange = calculateDateRange(timeDuration, startDate, endDate);
        LocalDateTime startDateTime = dateRange[0];
        LocalDateTime endDateTime = dateRange[1];
        // Fetch data using native query
        List<Object[]> expenses = dailyIncomeRepository.findIncomeAsRawData(startDateTime.toLocalDate(),endDateTime.toLocalDate());

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Income");

        // Header
        Row headerRow = sheet.createRow(0);
        String[] columns = {"IncomeId", "moduleName", "totalAmount", "date", "createdAt"};
        for (int i = 0; i < columns.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(columns[i]);
            cell.setCellStyle(getHeaderCellStyle(workbook));
        }

        // Data rows
        int rowNum = 1;
        for (Object[] row : expenses) {
            Row excelRow = sheet.createRow(rowNum++);
            excelRow.createCell(0).setCellValue(row[0].toString());                      // IncomeId
            excelRow.createCell(1).setCellValue(row[1].toString());                      // Module Name
            excelRow.createCell(2).setCellValue(Double.parseDouble(row[2].toString()));  // Total Amount
            excelRow.createCell(3).setCellValue(row[3].toString());                      // Date
            excelRow.createCell(4).setCellValue(row[4].toString());                      // Created At
        }

        // Auto-size columns
        for (int i = 0; i < columns.length; i++) {
            sheet.autoSizeColumn(i);
        }

        // Set response headers
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=income_report_" + timeDuration + ".xlsx");

        workbook.write(response.getOutputStream());
        workbook.close();
    }


    public CellStyle getHeaderCellStyle(Workbook workbook) {
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

//        LocalDateTime fromDateTime = fromDate.atStartOfDay();
//        LocalDateTime toDateTime = toDate.atTime(23, 59, 59);
        List<HMS_TM_DailyExpense> expenses = dailyExpenseRepository.findAllExpensesByDateRange(startDateTime, endDateTime);
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Expenses");
        // Create header row
        Row headerRow = sheet.createRow(0);
        String[] columns = {"ExpenseId", "moduleName", "totalAmount", "date","createdAt"};
        for (int i = 0; i < columns.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(columns[i]);
            cell.setCellStyle(getHeaderCellStyle(workbook));
        }

        // Populate data rows
        int rowNum = 1;
        for (HMS_TM_DailyExpense expense : expenses) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(expense.getExpenseId());
            row.createCell(1).setCellValue(expense.getDate().toString());
            row.createCell(2).setCellValue(expense.getTotalAmount().doubleValue());
            row.createCell(3).setCellValue(expense.getModuleName());
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


    public void exportProfitOrLossToExcel(String timeDuration, LocalDate startDate, LocalDate endDate, HttpServletResponse response) throws IOException {
        LocalDateTime[] dateRange = calculateDateRange(timeDuration, startDate, endDate);
        LocalDateTime startDateTime = dateRange[0];
        LocalDateTime endDateTime = dateRange[1];
        List<HMS_TM_DailyProfitAndLoss> profitOrLossRecords = profitOrLossRepository.findAllProfitOrLossByDateRange(startDateTime, endDateTime);

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

