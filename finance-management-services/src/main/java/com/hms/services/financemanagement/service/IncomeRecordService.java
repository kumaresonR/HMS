package com.hms.services.financemanagement.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.services.financemanagement.entity.HMS_TM_DailyIncome;
import com.hms.services.financemanagement.entity.HMS_TM_Income;
import com.hms.services.financemanagement.entity.IncomeChanges;
import com.hms.services.financemanagement.exceptionhandler.CustomException;
import com.hms.services.financemanagement.model.AdditionalIncomeDTO;
import com.hms.services.financemanagement.repository.IncomeRecordRepository;
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
import java.time.ZoneId;
import java.time.temporal.IsoFields;
import java.util.*;

@Service
public class IncomeRecordService {

    @Autowired
    private IncomeRecordRepository incomeRecordRepository;

    @Autowired
    private ProfitAndLossServices profitAndLossServices;

    public HMS_TM_Income generateIncomeRecord(String incomeRecordDataJson, MultipartFile attachmentFile) throws IOException, IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        HMS_TM_Income incomeRecord = objectMapper.readValue(incomeRecordDataJson, HMS_TM_Income.class);

        if (attachmentFile != null) {
            byte[] documentBytes = attachmentFile.getBytes();
            String attachmentUrl = Base64.getEncoder().encodeToString(documentBytes);
            incomeRecord.setAttachment(attachmentUrl);
        }

        return incomeRecordRepository.save(incomeRecord);
    }

    @Transactional
    public List<HMS_TM_Income> getAllIncomeRecords() {
        return incomeRecordRepository.findByIsDeletedFalse();
    }

    @Transactional
    public Optional<HMS_TM_Income> getIncomeRecordById(String id) {
        return incomeRecordRepository.findByIncomeIdAndIsDeletedFalse(id);
    }

    public HMS_TM_Income updateIncomeRecord(String id, String incomeRecordDataJson, MultipartFile attachmentFile) throws IOException, CustomException {
        HMS_TM_Income existingRecord = incomeRecordRepository.findById(id)
                .orElseThrow(() -> new CustomException("Income Record not found"));

        ObjectMapper objectMapper = new ObjectMapper();
        HMS_TM_Income updatedIncomeRecord = objectMapper.readValue(incomeRecordDataJson, HMS_TM_Income.class);

        existingRecord.setIncomeHead(updatedIncomeRecord.getIncomeHead());
        existingRecord.setName(updatedIncomeRecord.getName());
        existingRecord.setInvoiceNumber(updatedIncomeRecord.getInvoiceNumber());
        existingRecord.setDate(updatedIncomeRecord.getDate());
        existingRecord.setAmount(updatedIncomeRecord.getAmount());
        existingRecord.setDescription(updatedIncomeRecord.getDescription());
        existingRecord.setDeleted(updatedIncomeRecord.isDeleted());

        if (attachmentFile != null) {
            byte[] documentBytes = attachmentFile.getBytes();
            String attachmentUrl = Base64.getEncoder().encodeToString(documentBytes);
            existingRecord.setAttachment(attachmentUrl);
        }

        return incomeRecordRepository.save(existingRecord);
    }

    public void softDeleteIncomeRecord(String id) throws CustomException {
        HMS_TM_Income record = incomeRecordRepository.findById(id)
                .orElseThrow(() -> new CustomException("Income Record not found"));
        record.setDeleted(true);
        incomeRecordRepository.save(record);
    }

    public IncomeChanges getGeneralIncomeAmount() {
        Double todayIncome = incomeRecordRepository.getTotalGeneralIncome();
        LocalDate yesterday = LocalDate.now().minusDays(1);
        Double yesterdayIncome = incomeRecordRepository.getYesterdayGeneralIncome(yesterday);
        todayIncome = (todayIncome != null) ? todayIncome : 0.0;
        yesterdayIncome = (yesterdayIncome != null) ? yesterdayIncome : 0.0;
        String percentageChange;
        if (yesterdayIncome == 0.0) {
            percentageChange = (todayIncome > 0) ? "100% increase" : "No change";
        } else {
            double percentage = ((todayIncome - yesterdayIncome) / yesterdayIncome) * 100;
            percentageChange = String.format("%+.2f%%", percentage);
        }
        return new IncomeChanges(todayIncome, percentageChange);
    }

    public Double getMonthlyGeneralIncomeAmount() {
        Double monthlyIncome = incomeRecordRepository.getMonthlyTotalGeneralIncome();
        return (monthlyIncome != null) ? monthlyIncome : 0.0;
    }

    public  Map<Integer, Double> getMonthlyGeneralIncomePerYear() {
        List<Object[]> monthlyIncomes = incomeRecordRepository.getMonthlyExpenseForYear();
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

    public IncomeChanges getIncreaseMonthlyIncome() {
        int currentMonth = LocalDate.now().getMonthValue();
        int currentYear = LocalDate.now().getYear();
        LocalDate previousMonthDate = LocalDate.now().minusMonths(1);
        int previousMonth = previousMonthDate.getMonthValue();
        int previousYear = previousMonthDate.getYear();
        Double currentMonthIncome = incomeRecordRepository.getTotalGeneralIncomeForMonth(currentMonth, currentYear);
        Double previousMonthIncome = incomeRecordRepository.getTotalGeneralIncomeForMonth(previousMonth, previousYear);
        currentMonthIncome = (currentMonthIncome != null) ? currentMonthIncome : 0.0;
        previousMonthIncome = (previousMonthIncome != null) ? previousMonthIncome : 0.0;
        String percentageChange;
        if (previousMonthIncome == 0.0) {
            percentageChange = (currentMonthIncome > 0) ? "100% increase" : "No change";
        } else {
            double percentage = ((currentMonthIncome - previousMonthIncome) / previousMonthIncome) * 100;
            percentageChange = String.format("%+.2f%%", percentage);
        }
        return new IncomeChanges(currentMonthIncome, percentageChange);
    }


    public IncomeChanges getIncreaseYearlyIncome() {
        int currentYear = LocalDate.now().getYear();
        int previousYear = currentYear - 1;
        Double currentYearIncome = incomeRecordRepository.getTotalGeneralIncomeForYear(currentYear);
        Double previousYearIncome = incomeRecordRepository.getTotalGeneralIncomeForYear(previousYear);
        currentYearIncome = (currentYearIncome != null) ? currentYearIncome : 0.0;
        previousYearIncome = (previousYearIncome != null) ? previousYearIncome : 0.0;
        String percentageChange;
        if (previousYearIncome == 0.0) {
            percentageChange = (currentYearIncome > 0) ? "100% increase" : "No change";
        } else {
            double percentage = ((currentYearIncome - previousYearIncome) / previousYearIncome) * 100;
            percentageChange = String.format("%+.2f%%", percentage);
        }
        return new IncomeChanges(currentYearIncome, percentageChange);

    }

    public IncomeChanges getIncreaseWeeklyIncome() {
        int currentWeek = LocalDate.now().get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
        int currentYear = LocalDate.now().get(IsoFields.WEEK_BASED_YEAR);
        LocalDate previousWeekDate = LocalDate.now().minusWeeks(1);
        int previousWeek = previousWeekDate.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
        int previousYear = previousWeekDate.get(IsoFields.WEEK_BASED_YEAR);
        Double currentWeekIncome = incomeRecordRepository.getWeeklyIncomeAmount(currentWeek, currentYear);
        Double previousWeekIncome = incomeRecordRepository.getWeeklyIncomeAmount(previousWeek, previousYear);
        currentWeekIncome = (currentWeekIncome != null) ? currentWeekIncome : 0.0;
        previousWeekIncome = (previousWeekIncome != null) ? previousWeekIncome : 0.0;
        String percentageChange;
        if (previousWeekIncome == 0.0) {
            percentageChange = (currentWeekIncome > 0) ? "100% increase" : "No change";
        } else {
            double percentage = ((currentWeekIncome - previousWeekIncome) / previousWeekIncome) * 100;
            percentageChange = String.format("%+.2f%%", percentage);
        }
        return new IncomeChanges(currentWeekIncome, percentageChange);

    }

    @Transactional
    public Map<String, Object> searchAdditionalIncome(
            String timeDuration, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        LocalDateTime[] dateRange = profitAndLossServices.calculateDateRange(timeDuration, startDate, endDate);
        LocalDateTime startDateTime = dateRange[0];
        LocalDateTime endDateTime = dateRange[1];

        Page<HMS_TM_Income> incomePage = incomeRecordRepository.findIncomeByDateRange(startDateTime, endDateTime, pageable);
        long totalRecords = incomeRecordRepository.countByDateRange(startDateTime, endDateTime);

        List<AdditionalIncomeDTO> formattedList = incomePage.getContent().stream()
                .map(income -> new AdditionalIncomeDTO(
                        income.getIncomeId(),
                        income.getIncomeHead(),
                        income.getName(),
                        income.getInvoiceNumber(),
                        convertToLocalDateTime(income.getDate()), // convert java.util.Date to LocalDateTime
                        income.getAmount(),
                        income.getAttachment(),
                        income.getDescription()
                ))
                .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("totalRecords", totalRecords);
        response.put("data", formattedList);
        response.put("currentPage", incomePage.getNumber());
        response.put("totalPages", incomePage.getTotalPages());

        return response;
    }

    public LocalDateTime convertToLocalDateTime(Date date) {
        return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
    }

    public void generateExcelReport(String timeDuration, LocalDate startDate, LocalDate endDate, HttpServletResponse response) throws IOException {
        LocalDateTime[] dateRange = profitAndLossServices.calculateDateRange(timeDuration, startDate, endDate);
        LocalDateTime startDateTime = dateRange[0];
        LocalDateTime endDateTime = dateRange[1];
        // Fetch data using native query
        List<Object[]> incomes = incomeRecordRepository.findIncomeAsRawData(startDateTime.toLocalDate(),endDateTime.toLocalDate());

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Additional Income");

        // Header
        Row headerRow = sheet.createRow(0);
        String[] columns = {"Income Id", "Name", "Invoice Number", "Date", "Description", "Income Head", "Amount"};
        for (int i = 0; i < columns.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(columns[i]);
            cell.setCellStyle(profitAndLossServices.getHeaderCellStyle(workbook));
        }

        // Data rows
        int rowNum = 1;
        for (Object[] row : incomes) {
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
        response.setHeader("Content-Disposition", "attachment; filename=additional_income_report_" + timeDuration + ".xlsx");

        workbook.write(response.getOutputStream());
        workbook.close();
    }
}



