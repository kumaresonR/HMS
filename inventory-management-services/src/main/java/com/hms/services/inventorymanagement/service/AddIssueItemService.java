package com.hms.services.inventorymanagement.service;

import com.hms.services.inventorymanagement.entity.HMS_TM_AddIssueItem;
import com.hms.services.inventorymanagement.model.ReturnRequestDto;
import com.hms.services.inventorymanagement.repository.AddIssueItemRepository;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Optional;

@Service
public class AddIssueItemService {

    @Autowired
    private AddIssueItemRepository repository;

    public HMS_TM_AddIssueItem createIssueItem(HMS_TM_AddIssueItem issueItem) {
        issueItem.setStatus("Click to Return");
        return repository.save(issueItem);
    }

    public List<HMS_TM_AddIssueItem> getAllIssueItems() {
        return repository.findByDeletedFalse();
    }

    public Optional<HMS_TM_AddIssueItem> getIssueItemById(String id) {
        return repository.findByIdAndDeletedFalse(id);
    }

    public HMS_TM_AddIssueItem updateReturnStatus(String id, ReturnRequestDto returnRequest) {
        Optional<HMS_TM_AddIssueItem> optionalItem = repository.findById(id);
        if (optionalItem.isPresent()) {
            HMS_TM_AddIssueItem issueItem = optionalItem.get();
            issueItem.setItem(returnRequest.getItem());
            issueItem.setItemCategory(returnRequest.getItemCategory());
            issueItem.setQuantity(returnRequest.getQuantity());
            issueItem.setStatus("Returned");
            return repository.save(issueItem);
        } else {
            throw new RuntimeException("Item not found with id: " + id);
        }
    }

    public HMS_TM_AddIssueItem updateIssueItem(String id, HMS_TM_AddIssueItem updatedIssueItem) {
        return repository.findById(id)
                .map(existingItem -> {
                    updatedIssueItem.setId(existingItem.getId());
                    return repository.save(updatedIssueItem);
                })
                .orElse(null);
    }

    public void deleteAddIssueItem(String itemId) {
        Optional<HMS_TM_AddIssueItem> optionalItem = repository.findById(itemId);
        if (optionalItem.isPresent()) {
            HMS_TM_AddIssueItem issueItem = optionalItem.get();
            issueItem.setDeleted(true);
            repository.save(issueItem);
        } else {
            throw new RuntimeException("Item not found with ID: " + itemId);
        }
    }

    public Page<HMS_TM_AddIssueItem> searchAddIssueItems(String timeDuration, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        LocalDateTime[] dateRange = calculateDateRange(timeDuration, startDate, endDate);
        LocalDateTime startDateTime = dateRange[0];
        LocalDateTime endDateTime = dateRange[1];
        return repository.findByIssueDateBetweenAndDeletedFalse(startDateTime, endDateTime, pageable);
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

    public List<HMS_TM_AddIssueItem> searchIssueItems(String timeDuration, LocalDate startDate, LocalDate endDate) {
        LocalDateTime[] dateRange = calculateDateRange(timeDuration, startDate, endDate);
        LocalDateTime startDateTime = dateRange[0];
        LocalDateTime endDateTime = dateRange[1];
        return repository.findByIssueDateBetweenAndDeletedFalse(startDateTime, endDateTime);
    }


    public ByteArrayInputStream generateIssueItemExcel(List<HMS_TM_AddIssueItem> issueItems) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Issue Items");

            // Header
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("ID");
            headerRow.createCell(1).setCellValue("USER_TYPE");
            headerRow.createCell(2).setCellValue("ISSUE_TO");
            headerRow.createCell(3).setCellValue("ISSUED_BY");
            headerRow.createCell(4).setCellValue("ISSUE_DATE");
            headerRow.createCell(5).setCellValue("RETURN_DATE");
            headerRow.createCell(6).setCellValue("NOTE");
            headerRow.createCell(7).setCellValue("ITEM_CATEGORY");
            headerRow.createCell(8).setCellValue("ITEM");
            headerRow.createCell(9).setCellValue("QUANTITY");
            headerRow.createCell(10).setCellValue("STATUS");

            int rowIdx = 1;
            for (HMS_TM_AddIssueItem item : issueItems) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(item.getId());
                row.createCell(1).setCellValue(item.getUserType());
                row.createCell(2).setCellValue(item.getIssueTo());
                row.createCell(3).setCellValue(item.getIssuedBy());
                row.createCell(4).setCellValue(item.getIssueDate() != null ? item.getIssueDate().toString() : "");
                row.createCell(5).setCellValue(item.getReturnDate() != null ? item.getReturnDate().toString() : "");
                row.createCell(6).setCellValue(item.getNote());
                row.createCell(7).setCellValue(item.getItemCategory());
                row.createCell(8).setCellValue(item.getItem());
                row.createCell(9).setCellValue(item.getQuantity() != null ? item.getQuantity() : 0);
                row.createCell(10).setCellValue(item.getStatus());
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

}


