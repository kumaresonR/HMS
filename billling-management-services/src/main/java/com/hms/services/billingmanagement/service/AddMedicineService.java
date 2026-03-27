package com.hms.services.billingmanagement.service;

import com.hms.services.billingmanagement.configuration.AdminManagementInterface;
import com.hms.services.billingmanagement.entity.HMS_TM_AddMedicine;
import com.hms.services.billingmanagement.entity.HMS_TM_BadStock;
import com.hms.services.billingmanagement.model.*;
import com.hms.services.billingmanagement.repository.AddMedicineRepository;
import com.hms.services.billingmanagement.repository.BadStockRepository;
import com.hms.services.billingmanagement.repository.MedicineRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AddMedicineService {

    @Autowired
    private AddMedicineRepository addMedicineRepository;
    @Autowired
    private MedicineRepository medicineRepository;
    @Autowired
    private BadStockRepository badStockRepository;
    @Autowired
    private AdminManagementInterface adminManagementInterface;


    @Transactional
    public List<HMS_TM_AddMedicineDTO> getAllMedicines() {
        List<HMS_TM_AddMedicine> medicines = addMedicineRepository.findByIsDeletedFalse();

        return medicines.stream().map(medicine -> {
            HMS_TM_AddMedicineDTO dto = new HMS_TM_AddMedicineDTO();

            dto.setAddMedicineId(medicine.getAddMedicineId());
            dto.setName(medicine.getName());
            dto.setCategory(medicine.getCategory());
            dto.setCompanyId(medicine.getCompanyId());
            dto.setBatchNo(medicine.getBatchNo());
            dto.setExpiryDate(medicine.getExpiryDate());
            dto.setSalePrice(medicine.getSalePrice());
            dto.setAmount(medicine.getAmount());
            dto.setTax(medicine.getTax());
            dto.setBoxPacking(medicine.getBoxPacking());
            dto.setIsDeleted(medicine.getIsDeleted());
            dto.setPurchaseDate(medicine.getPurchaseDate());

            if (medicine.getCompanyId() != null) {
                ResponseEntity<HMS_TM_AddCompany> companyResponse = adminManagementInterface.getCompanyByIds(medicine.getCompanyId());
                if (companyResponse != null && companyResponse.getStatusCode().is2xxSuccessful()) {
                    dto.setCompanyDetails(companyResponse.getBody());
                }
            }

            if (medicine.getSupplierId() != null) {
                ResponseEntity<HMS_TM_Supplier> supplierResponse = adminManagementInterface.getSupplierById(medicine.getSupplierId());
                if (supplierResponse != null && supplierResponse.getStatusCode().is2xxSuccessful()) {
                    dto.setSupplierDetails(supplierResponse.getBody());
                }
            }

            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public Optional<HMS_TM_AddMedicineDTO> getMedicineById(String id) {
        Optional<HMS_TM_AddMedicine> medicineOptional = addMedicineRepository.findByAddMedicineIdAndIsDeletedFalse(id);

        if (medicineOptional.isPresent()) {
            HMS_TM_AddMedicine medicine = medicineOptional.get();
            HMS_TM_AddMedicineDTO dto = new HMS_TM_AddMedicineDTO();

            dto.setAddMedicineId(medicine.getAddMedicineId());
            dto.setName(medicine.getName());
            dto.setCategory(medicine.getCategory());
            dto.setCompanyId(medicine.getCompanyId());
            dto.setBatchNo(medicine.getBatchNo());
            dto.setExpiryDate(medicine.getExpiryDate());
            dto.setSalePrice(medicine.getSalePrice());
            dto.setAmount(medicine.getAmount());
            dto.setTax(medicine.getTax());
            dto.setBoxPacking(medicine.getBoxPacking());
            dto.setIsDeleted(medicine.getIsDeleted());
            dto.setPurchaseDate(medicine.getPurchaseDate());

            if (medicine.getCompanyId() != null) {
                ResponseEntity<HMS_TM_AddCompany> companyResponse = adminManagementInterface.getCompanyByIds(medicine.getCompanyId());
                if (companyResponse != null && companyResponse.getStatusCode().is2xxSuccessful()) {
                    dto.setCompanyDetails(companyResponse.getBody());
                }
            }

            if (medicine.getSupplierId() != null) {
                ResponseEntity<HMS_TM_Supplier> supplierResponse = adminManagementInterface.getSupplierById(medicine.getSupplierId());
                if (supplierResponse != null && supplierResponse.getStatusCode().is2xxSuccessful()) {
                    dto.setSupplierDetails(supplierResponse.getBody());
                }
            }

            return Optional.of(dto);
        }

        return Optional.empty();
    }

    @Transactional
    public List<HMS_TM_AddMedicineDTO> getMedicinesWithBoxPackingUnderOrEqualToTen() {
        List<HMS_TM_AddMedicine> medicines = addMedicineRepository.findByBoxPackingLessThanEqualAndIsDeletedFalse(10);
        List<HMS_TM_AddMedicineDTO> medicineDTOs = new ArrayList<>();

        for (HMS_TM_AddMedicine medicine : medicines) {
            HMS_TM_AddMedicineDTO dto = new HMS_TM_AddMedicineDTO();
            dto.setAddMedicineId(medicine.getAddMedicineId());
            dto.setName(medicine.getName());
            dto.setCategory(medicine.getCategory());
            dto.setCompanyId(medicine.getCompanyId());
            dto.setBatchNo(medicine.getBatchNo());
            dto.setExpiryDate(medicine.getExpiryDate());
            dto.setSalePrice(medicine.getSalePrice());
            dto.setAmount(medicine.getAmount());
            dto.setTax(medicine.getTax());
            dto.setBoxPacking(medicine.getBoxPacking());
            dto.setIsDeleted(medicine.getIsDeleted());
            dto.setPurchaseDate(medicine.getPurchaseDate());

            if (medicine.getCompanyId() != null) {
                ResponseEntity<HMS_TM_AddCompany> companyResponse = adminManagementInterface.getCompanyByIds(medicine.getCompanyId());
                if (companyResponse != null && companyResponse.getStatusCode().is2xxSuccessful()) {
                    dto.setCompanyDetails(companyResponse.getBody());
                }
            }

            if (medicine.getSupplierId() != null) {
                ResponseEntity<HMS_TM_Supplier> supplierResponse = adminManagementInterface.getSupplierById(medicine.getSupplierId());
                if (supplierResponse != null && supplierResponse.getStatusCode().is2xxSuccessful()) {
                    dto.setSupplierDetails(supplierResponse.getBody());
                }
            }

            medicineDTOs.add(dto);
        }

        return medicineDTOs;
    }

    @Transactional
    public void checkAndCreateBadStock() {
        LocalDate today = LocalDate.now();

        String expiryThreshold = today.plusMonths(1).format(DateTimeFormatter.ofPattern("yyyy-MM"));

        List<HMS_TM_AddMedicine> expiringMedicines = addMedicineRepository.findAllByExpiryMonthAndIsDeletedFalse(expiryThreshold);

        for (HMS_TM_AddMedicine medicine : expiringMedicines) {
            HMS_TM_BadStock badStock = new HMS_TM_BadStock();
            badStock.setAddMedicineId(medicine.getAddMedicineId());
            badStock.setBatchNo(medicine.getBatchNo());
            badStock.setExpiryDate(medicine.getExpiryDate());
            badStock.setOutwardDate(new Date());
            badStock.setQty(medicine.getBoxPacking());
            badStock.setNote("Expired medicine moved to bad stock.");
            badStock.setDeleted(false);

            badStockRepository.save(badStock);

            medicine.setIsDeleted(true);
            addMedicineRepository.save(medicine);
        }
    }

//    public HMS_TM_AddMedicine saveMedicineWithFile(HMS_TM_AddMedicine medicine, MultipartFile photoFile) throws IOException {
//        if (photoFile != null) {
//            byte[] photoBytes = photoFile.getBytes();
//            String encodedPhoto = Base64.getEncoder().encodeToString(photoBytes);
//            medicine.setMedicinePhoto(encodedPhoto);
//        }
//
//        return addMedicineRepository.save(medicine);
//    }
//
//    public HMS_TM_AddMedicine updateMedicine(String id, HMS_TM_AddMedicine medicine, MultipartFile photoFile) {
//        Optional<HMS_TM_AddMedicine> existingMedicineOpt = addMedicineRepository.findById(id);
//        if (existingMedicineOpt.isPresent()) {
//            HMS_TM_AddMedicine existingMedicine = existingMedicineOpt.get();
//
//            existingMedicine.setName(medicine.getName());
//            existingMedicine.setCategory(medicine.getCategory());
//            existingMedicine.setCompany(medicine.getCompany());
//            existingMedicine.setComposition(medicine.getComposition());
//            existingMedicine.setGroupName(medicine.getGroupName());
//            existingMedicine.setUnit(medicine.getUnit());
//            existingMedicine.setMinLevel(medicine.getMinLevel());
//            existingMedicine.setReorderLevel(medicine.getReorderLevel());
//            existingMedicine.setRackNumber(medicine.getRackNumber());
//            existingMedicine.setTax(medicine.getTax());
//            existingMedicine.setBoxPacking(medicine.getBoxPacking());
//            existingMedicine.setVatAccount(medicine.getVatAccount());
//            existingMedicine.setNote(medicine.getNote());
//
//            if (photoFile != null) {
//                try {
//                    byte[] photoBytes = photoFile.getBytes();
//                    String encodedPhoto = Base64.getEncoder().encodeToString(photoBytes);
//                    existingMedicine.setMedicinePhoto(encodedPhoto);
//                } catch (IOException e) {
//                    return null;
//                }
//            }
//
//            return addMedicineRepository.save(existingMedicine);
//        }
//        return null;
//    }

    public HMS_TM_AddMedicine softDeleteMedicine(String id) {
        Optional<HMS_TM_AddMedicine> existingMedicineOpt = addMedicineRepository.findById(id);

        if (existingMedicineOpt.isPresent()) {
            HMS_TM_AddMedicine existingMedicine = existingMedicineOpt.get();
            existingMedicine.setIsDeleted(true);
            return addMedicineRepository.save(existingMedicine);
        }
        return null;
    }

    public List<HMS_TM_AddMedicine> softDeleteMultipleMedicines(List<String> ids) {
        List<HMS_TM_AddMedicine> updatedMedicines = new ArrayList<>();

        for (String id : ids) {
            Optional<HMS_TM_AddMedicine> existingMedicineOpt = addMedicineRepository.findById(id);

            if (existingMedicineOpt.isPresent()) {
                HMS_TM_AddMedicine existingMedicine = existingMedicineOpt.get();
                existingMedicine.setIsDeleted(true);
                updatedMedicines.add(addMedicineRepository.save(existingMedicine));
            }
        }
        return updatedMedicines;
    }

    public Double getTotalMedicineStock() {
        Double monthlyIncome = medicineRepository.getTotalMedicineStock();
        return (monthlyIncome != null) ? monthlyIncome : 0.0;
    }

    @Transactional
    public List<StockResponse> getStockReport(
            String timeDuration,
            LocalDate startDate,
            LocalDate endDate,
            String name) {

        LocalDateTime[] dateRange = calculateDateRangeForStock(timeDuration, startDate, endDate);
        LocalDateTime start = dateRange[0];
        LocalDateTime end = dateRange[1];

        List<HMS_TM_AddMedicine> medicines = addMedicineRepository.findStockByFilters(
               name, start, end);

        return convertToStockResponse(medicines);
    }

    private LocalDateTime[] calculateDateRangeForStock(String timeDuration, LocalDate startDate, LocalDate endDate) {
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

    private List<StockResponse> convertToStockResponse(List<HMS_TM_AddMedicine> medicines) {
        return medicines.stream()
                .map(medicine -> {
                    StockResponse response = new StockResponse();
                    response.setName(medicine.getName());
                    response.setCategory(medicine.getCategory());
                    response.setBatchNo(medicine.getBatchNo());
                    response.setExpiryDate(medicine.getExpiryDate());
                    response.setSalePrice(medicine.getSalePrice());
                    response.setAmount(medicine.getAmount());
                    response.setTax(medicine.getTax());
                    response.setBoxPacking(medicine.getBoxPacking());
                    response.setPurchaseDate(medicine.getPurchaseDate());

                    if (medicine.getCompanyId() != null) {
                        ResponseEntity<HMS_TM_AddCompany> companyResponse =
                                adminManagementInterface.getCompanyByIds(medicine.getCompanyId());
                        if (companyResponse != null && companyResponse.getStatusCode().is2xxSuccessful()) {
                            response.setCompanyName(companyResponse.getBody().getCompanyName());
                        }
                    }

                    if (medicine.getSupplierId() != null) {
                        ResponseEntity<HMS_TM_Supplier> supplierResponse =
                                adminManagementInterface.getSupplierById(medicine.getSupplierId());
                        if (supplierResponse != null && supplierResponse.getStatusCode().is2xxSuccessful()) {
                            response.setSupplierName(supplierResponse.getBody().getSupplierName());
                        }
                    }

                    return response;
                })
                .collect(Collectors.toList());
    }
}


