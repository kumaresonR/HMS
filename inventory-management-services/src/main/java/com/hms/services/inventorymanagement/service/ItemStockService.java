package com.hms.services.inventorymanagement.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.services.inventorymanagement.entity.HMS_TM_ItemStock;
import com.hms.services.inventorymanagement.repository.ItemStockRepository;
import jakarta.transaction.Transactional;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class ItemStockService {

    @Autowired
    private ItemStockRepository itemStockRepository;
    @Autowired
    private ObjectMapper objectMapper;

    public HMS_TM_ItemStock addItemStock(String itemStockDataJson, MultipartFile attachmentFile) throws IOException, JsonProcessingException {
        HMS_TM_ItemStock itemStock = objectMapper.readValue(itemStockDataJson, HMS_TM_ItemStock.class);

        if (attachmentFile != null) {
            byte[] attachmentBytes = attachmentFile.getBytes();
            String encodedAttachment = Base64.getEncoder().encodeToString(attachmentBytes);
            itemStock.setAttachDocument(encodedAttachment);
        }

        return itemStockRepository.save(itemStock);
    }

    @Transactional
    public List<HMS_TM_ItemStock> getAllItemStocks() {
        return itemStockRepository.findByDeletedFalse();
    }

    @Transactional
    public Optional<HMS_TM_ItemStock> getItemStockById(String itemStockId) {
        return itemStockRepository.findByItemStockIdAndDeletedFalse(itemStockId);
    }

    public HMS_TM_ItemStock updateItemStock(String id, String itemStockDataJson, MultipartFile attachmentFile) throws IOException {
        HMS_TM_ItemStock existingItemStock = itemStockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item Stock not found"));

        HMS_TM_ItemStock updatedItemStock = objectMapper.readValue(itemStockDataJson, HMS_TM_ItemStock.class);

        existingItemStock.setItemCategory(updatedItemStock.getItemCategory());
        existingItemStock.setItem(updatedItemStock.getItem());
        existingItemStock.setSupplier(updatedItemStock.getSupplier());
        existingItemStock.setStore(updatedItemStock.getStore());
        existingItemStock.setQuantity(updatedItemStock.getQuantity());
        existingItemStock.setPurchasePrice(updatedItemStock.getPurchasePrice());
        existingItemStock.setDate(updatedItemStock.getDate());
        existingItemStock.setDescription(updatedItemStock.getDescription());

        if (attachmentFile != null) {
            byte[] attachmentBytes = attachmentFile.getBytes();
            String encodedAttachment = Base64.getEncoder().encodeToString(attachmentBytes);
            existingItemStock.setAttachDocument(encodedAttachment);
        } else {
            existingItemStock.setAttachDocument(existingItemStock.getAttachDocument());
        }

        return itemStockRepository.save(existingItemStock);
    }

    public void deleteItemStock(String id) {
        Optional<HMS_TM_ItemStock> hmsTmItemStock = itemStockRepository.findById(id);
        if (hmsTmItemStock.isPresent()) {
            HMS_TM_ItemStock bill = hmsTmItemStock.get();
            bill.setDeleted(true);
            itemStockRepository.save(bill);
        } else {
            throw new RuntimeException("Item Stock found with ID: " + id);
        }
    }

    public Page<HMS_TM_ItemStock> searchItemStock(String timeDuration, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        LocalDateTime[] dateRange = calculateDateRange(timeDuration, startDate, endDate);
        LocalDateTime startDateTime = dateRange[0];
        LocalDateTime endDateTime = dateRange[1];

        return itemStockRepository.findByDateBetweenAndDeletedFalse(startDateTime, endDateTime, pageable);
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

    public List<HMS_TM_ItemStock> searchItemStocks(String timeDuration, LocalDate startDate, LocalDate endDate) {
        LocalDateTime[] dateRange = calculateDateRange(timeDuration, startDate, endDate);
        LocalDateTime startDateTime = dateRange[0];
        LocalDateTime endDateTime = dateRange[1];

        return itemStockRepository.findByDateBetweenAndDeletedFalse(startDateTime, endDateTime);
    }

    public ByteArrayInputStream generateItemStockExcel(List<HMS_TM_ItemStock> itemStocks) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Item Stock");

            // Header
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Item Stock ID");
            headerRow.createCell(1).setCellValue("Item Category");
            headerRow.createCell(2).setCellValue("Item");
            headerRow.createCell(3).setCellValue("Supplier");
            headerRow.createCell(4).setCellValue("Store");
            headerRow.createCell(5).setCellValue("Quantity");
            headerRow.createCell(6).setCellValue("Purchase Price");
            headerRow.createCell(7).setCellValue("Date");
            headerRow.createCell(8).setCellValue("Description");

            int rowIdx = 1;
            for (HMS_TM_ItemStock stock : itemStocks) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(stock.getItemStockId());
                row.createCell(1).setCellValue(stock.getItemCategory());
                row.createCell(2).setCellValue(stock.getItem());
                row.createCell(3).setCellValue(stock.getSupplier());
                row.createCell(4).setCellValue(stock.getStore());
                row.createCell(5).setCellValue(stock.getQuantity() != null ? stock.getQuantity() : 0);
                row.createCell(6).setCellValue(stock.getPurchasePrice() != null ? stock.getPurchasePrice() : 0.0);
                row.createCell(7).setCellValue(stock.getDate() != null ? stock.getDate().toString() : "");
                row.createCell(8).setCellValue(stock.getDescription() != null ? stock.getDescription() : "");
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

}


