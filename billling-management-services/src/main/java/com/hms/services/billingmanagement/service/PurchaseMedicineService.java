package com.hms.services.billingmanagement.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.services.billingmanagement.configuration.AdminManagementInterface;
import com.hms.services.billingmanagement.entity.HMS_TM_AddMedicine;
import com.hms.services.billingmanagement.entity.HMS_TM_PurchaseBill;
import com.hms.services.billingmanagement.entity.HMS_TM_PurchaseMedicine;
import com.hms.services.billingmanagement.model.HMS_TM_Supplier;
import com.hms.services.billingmanagement.model.*;
import com.hms.services.billingmanagement.repository.AddMedicineRepository;
import com.hms.services.billingmanagement.repository.PurchaseBillRepository;
import com.hms.services.billingmanagement.repository.PurchaseMedicineRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PurchaseMedicineService {

    private final PurchaseBillRepository purchaseBillRepository;
    private final PurchaseMedicineRepository purchaseMedicineRepository;
    private final ObjectMapper objectMapper;
    private final AdminManagementInterface adminManagementInterface;
    private final AddMedicineRepository addMedicineRepository;
    private final ModelMapper modelMapper;


    @Autowired
    public PurchaseMedicineService(PurchaseBillRepository purchaseBillRepository, PurchaseMedicineRepository purchaseMedicineRepository, ObjectMapper objectMapper, AdminManagementInterface adminManagementInterface, AddMedicineRepository addMedicineRepository, ModelMapper modelMapper) {
        this.purchaseBillRepository = purchaseBillRepository;
        this.purchaseMedicineRepository = purchaseMedicineRepository;
        this.objectMapper = objectMapper;
        this.adminManagementInterface = adminManagementInterface;
        this.addMedicineRepository = addMedicineRepository;
        this.modelMapper = modelMapper;
    }

    @Transactional
    public PurchaseBillDTO generateBill(String purchaseBillDataJson, MultipartFile attachment, MultipartFile chequeAttachment) {
        try {
            PurchaseBillDTO billDTO = objectMapper.readValue(purchaseBillDataJson, PurchaseBillDTO.class);

            HMS_TM_PurchaseBill purchaseBill = new HMS_TM_PurchaseBill();

            String maxId = purchaseBillRepository.findMaxBillId();

            int nextId = (maxId == null) ? 1 : Integer.parseInt(maxId.substring(5)) + 1;
            String generatedId = "PCHN" + String.format("%03d", nextId);
            purchaseBill.setPurchaseBillId(generatedId);

            purchaseBill.setSupplierId(billDTO.getSupplierId());
            purchaseBill.setBillNo(billDTO.getBillNo());
            purchaseBill.setPurchaseDate(LocalDateTime.now());
            purchaseBill.setNote(billDTO.getNote());
            purchaseBill.setTotalAmount(billDTO.getTotalAmount());
            purchaseBill.setDiscount(billDTO.getDiscount());
            purchaseBill.setTax(billDTO.getTax());
            purchaseBill.setNetAmount(billDTO.getNetAmount());
            purchaseBill.setPaymentMode(billDTO.getPaymentMode());
            purchaseBill.setPaymentAmount(billDTO.getPaymentAmount());
            purchaseBill.setPaymentNote(billDTO.getPaymentNote());
            purchaseBill.setAttachment(billDTO.getAttachment());
            purchaseBill.setChequeAttachDocument(billDTO.getChequeAttachDocument());
            purchaseBill.setChequeNo(billDTO.getChequeNo());
            purchaseBill.setChequeDate(billDTO.getChequeDate());

            if (attachment != null && !attachment.isEmpty()) {
                byte[] attachmentData = attachment.getBytes();
                String encodedAttachmentData = Base64.getEncoder().encodeToString(attachmentData);
                purchaseBill.setAttachment((encodedAttachmentData));
            }

            if (chequeAttachment != null && !chequeAttachment.isEmpty()) {
                byte[] chequeAttachmentData = chequeAttachment.getBytes();
                String encodedChequeAttachment = Base64.getEncoder().encodeToString(chequeAttachmentData);
                purchaseBill.setChequeAttachDocument(encodedChequeAttachment);
            }

            HMS_TM_PurchaseBill savedPurchaseBill = purchaseBillRepository.save(purchaseBill);
            String purchaseBillId = savedPurchaseBill.getPurchaseBillId();

            List<HMS_TM_PurchaseMedicine> purchaseMedicines = new ArrayList<>();
            if (billDTO.getMedicines() != null && !billDTO.getMedicines().isEmpty()) {
                for (PurchaseMedicineDTO medicineDTO : billDTO.getMedicines()) {
                    HMS_TM_PurchaseMedicine medicine = new HMS_TM_PurchaseMedicine();
                    medicine.setPurchaseBillId(purchaseBillId);
                    medicine.setMedicineCategory(medicineDTO.getMedicineCategory());
                    medicine.setMedicineName(medicineDTO.getMedicineName());
                    medicine.setBatchNo(medicineDTO.getBatchNo());
                    medicine.setExpiryDate(medicineDTO.getExpiryDate());
                    medicine.setCompanyId(medicineDTO.getCompanyId());
                    medicine.setMrp(medicineDTO.getMrp());
                    medicine.setBatchAmount(medicineDTO.getBatchAmount());
                    medicine.setSalePrice(medicineDTO.getSalePrice());
                    medicine.setPackingQty(medicineDTO.getPackingQty());
                    medicine.setQuantity(medicineDTO.getQuantity());
                    medicine.setPurchasePrice(medicineDTO.getPurchasePrice());
//                    medicine.setAvailableQty(medicineDTO.getQuantity());
                    medicine.setTax(medicineDTO.getTax());
                    medicine.setAmount(medicineDTO.getAmount());
                    purchaseMedicines.add(medicine);
                }
                purchaseMedicineRepository.saveAll(purchaseMedicines);
            }

            PurchaseBillDTO responseDTO = new PurchaseBillDTO();
            responseDTO.setPurchaseBillId(savedPurchaseBill.getPurchaseBillId());
            responseDTO.setSupplierId(savedPurchaseBill.getSupplierId());
            responseDTO.setBillNo(savedPurchaseBill.getBillNo());
            responseDTO.setPurchaseDate(savedPurchaseBill.getPurchaseDate());
            responseDTO.setNote(savedPurchaseBill.getNote());
            responseDTO.setTotalAmount(savedPurchaseBill.getTotalAmount());
            responseDTO.setDiscount(savedPurchaseBill.getDiscount());
            responseDTO.setTax(savedPurchaseBill.getTax());
            responseDTO.setNetAmount(savedPurchaseBill.getNetAmount());
            responseDTO.setPaymentMode(savedPurchaseBill.getPaymentMode());
            responseDTO.setPaymentAmount(savedPurchaseBill.getPaymentAmount());
            responseDTO.setPaymentNote(savedPurchaseBill.getPaymentNote());
            responseDTO.setAttachment(savedPurchaseBill.getAttachment());
            responseDTO.setChequeNo(savedPurchaseBill.getChequeNo());
            responseDTO.setChequeDate(savedPurchaseBill.getChequeDate());
            responseDTO.setChequeAttachDocument(savedPurchaseBill.getChequeAttachDocument());

            if (!purchaseMedicines.isEmpty()) {
                List<PurchaseMedicineDTO> responseMedicines = purchaseMedicines.stream()
                        .map(medicine -> {
                            PurchaseMedicineDTO medicineDTO = new PurchaseMedicineDTO();
                            medicineDTO.setMedicineId(medicine.getMedicineId());
                            medicineDTO.setPurchaseBillId(medicine.getPurchaseBillId());
                            medicineDTO.setMedicineCategory(medicine.getMedicineCategory());
                            medicineDTO.setMedicineName(medicine.getMedicineName());
                            medicineDTO.setCompanyId(medicine.getCompanyId());
                            medicineDTO.setBatchNo(medicine.getBatchNo());
                            medicineDTO.setExpiryDate(medicine.getExpiryDate());
                            medicineDTO.setMrp(medicine.getMrp());
                            medicineDTO.setBatchAmount(medicine.getBatchAmount());
                            medicineDTO.setSalePrice(medicine.getSalePrice());
                            medicineDTO.setPackingQty(medicine.getPackingQty());
                            medicineDTO.setQuantity(medicine.getQuantity());
                            medicineDTO.setPurchasePrice(medicine.getPurchasePrice());
                            medicineDTO.setTax(medicine.getTax());
                            medicineDTO.setAmount(medicine.getAmount());
                            return medicineDTO;
                        })
                        .collect(Collectors.toList());
                responseDTO.setMedicines(responseMedicines);
            }

            return responseDTO;

        } catch (Exception e) {
            throw new RuntimeException("Error creating purchase bill: " + e.getMessage(), e);
        }
    }

    @Transactional
    public List<PurchaseBillDTO> getAllPurchaseBills(int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Order.desc("purchaseDate")));
        Page<HMS_TM_PurchaseBill> bills = purchaseBillRepository.findAllByDeletedFalse(pageRequest);

        return bills.stream().map(bill -> {
            PurchaseBillDTO dto = new PurchaseBillDTO();
            dto.setPurchaseBillId(bill.getPurchaseBillId());

            ResponseEntity<HMS_TM_Supplier> supplierResponse = adminManagementInterface.getSupplierById(bill.getSupplierId());
            if (supplierResponse != null && supplierResponse.getStatusCode().is2xxSuccessful()) {
                dto.setSupplierId(String.valueOf(supplierResponse.getBody()));
            }

            dto.setBillNo(bill.getBillNo());
            dto.setPurchaseDate(bill.getPurchaseDate());
            dto.setNote(bill.getNote());
            dto.setTotalAmount(bill.getTotalAmount());
            dto.setDiscount(bill.getDiscount());
            dto.setTax(bill.getTax());
            dto.setNetAmount(bill.getNetAmount());
            dto.setPaymentMode(bill.getPaymentMode());
            dto.setPaymentAmount(bill.getPaymentAmount());
            dto.setPaymentNote(bill.getPaymentNote());
            dto.setAttachment(bill.getAttachment());
            dto.setChequeDate(bill.getChequeDate());
            dto.setChequeNo(bill.getChequeNo());
            dto.setChequeAttachDocument(bill.getChequeAttachDocument());
            dto.setStatus(bill.getStatus());

            List<PurchaseMedicineDTO> medicines = purchaseMedicineRepository.findByPurchaseBillId(bill.getPurchaseBillId()).stream()
                    .map(medicine -> {
                        PurchaseMedicineDTO medicineDTO = new PurchaseMedicineDTO();
                        medicineDTO.setMedicineId(medicine.getMedicineId());
                        medicineDTO.setPurchaseBillId(medicine.getPurchaseBillId());
                        medicineDTO.setMedicineCategory(medicine.getMedicineCategory());
                        medicineDTO.setMedicineName(medicine.getMedicineName());
                        medicineDTO.setBatchNo(medicine.getBatchNo());
                        medicineDTO.setExpiryDate(medicine.getExpiryDate());
                        medicineDTO.setMrp(medicine.getMrp());
                        medicineDTO.setBatchAmount(medicine.getBatchAmount());
                        medicineDTO.setCompanyId(medicine.getCompanyId());
                        medicineDTO.setSalePrice(medicine.getSalePrice());
                        medicineDTO.setPackingQty(medicine.getPackingQty());
                        medicineDTO.setQuantity(medicine.getQuantity());
                        medicineDTO.setPurchasePrice(medicine.getPurchasePrice());
                        medicineDTO.setTax(medicine.getTax());
                        medicineDTO.setAmount(medicine.getAmount());

                        ResponseEntity<HMS_TM_AddCompany> companyResponse = adminManagementInterface.getCompanyByIds(medicine.getCompanyId());
                        if (companyResponse != null && companyResponse.getStatusCode().is2xxSuccessful()) {
                            medicineDTO.setCompanyDetails(companyResponse.getBody());
                        }

                        return medicineDTO;
                    }).collect(Collectors.toList());

            dto.setMedicines(medicines);
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public PurchaseBillDTO getPurchaseBillById(String purchaseBillId) {
        Optional<HMS_TM_PurchaseBill> billOptional = purchaseBillRepository.findByPurchaseBillIdAndDeletedFalse(purchaseBillId);

        if (billOptional.isPresent()) {
            HMS_TM_PurchaseBill bill = billOptional.get();

            PurchaseBillDTO dto = new PurchaseBillDTO();
            dto.setPurchaseBillId(bill.getPurchaseBillId());

            ResponseEntity<HMS_TM_Supplier> supplierResponse = adminManagementInterface.getSupplierById(bill.getSupplierId());
            if (supplierResponse != null && supplierResponse.getStatusCode().is2xxSuccessful()) {
                dto.setSupplierId(String.valueOf(supplierResponse.getBody()));
            }

            dto.setBillNo(bill.getBillNo());
            dto.setPurchaseDate(bill.getPurchaseDate());
            dto.setNote(bill.getNote());
            dto.setTotalAmount(bill.getTotalAmount());
            dto.setDiscount(bill.getDiscount());
            dto.setTax(bill.getTax());
            dto.setNetAmount(bill.getNetAmount());
            dto.setPaymentMode(bill.getPaymentMode());
            dto.setPaymentAmount(bill.getPaymentAmount());
            dto.setPaymentNote(bill.getPaymentNote());
            dto.setAttachment(bill.getAttachment());
            dto.setChequeDate(bill.getChequeDate());
            dto.setChequeNo(bill.getChequeNo());
            dto.setChequeAttachDocument(bill.getChequeAttachDocument());
            dto.setStatus(bill.getStatus());

            List<PurchaseMedicineDTO> medicines = purchaseMedicineRepository.findByPurchaseBillId(bill.getPurchaseBillId()).stream()
                    .map(medicine -> {
                        PurchaseMedicineDTO medicineDTO = new PurchaseMedicineDTO();
                        medicineDTO.setMedicineId(medicine.getMedicineId());
                        medicineDTO.setPurchaseBillId(medicine.getPurchaseBillId());
                        medicineDTO.setMedicineCategory(medicine.getMedicineCategory());
                        medicineDTO.setMedicineName(medicine.getMedicineName());
                        medicineDTO.setBatchNo(medicine.getBatchNo());
                        medicineDTO.setExpiryDate(medicine.getExpiryDate());
                        medicineDTO.setMrp(medicine.getMrp());
                        medicineDTO.setBatchAmount(medicine.getBatchAmount());
                        medicineDTO.setSalePrice(medicine.getSalePrice());
                        medicineDTO.setPackingQty(medicine.getPackingQty());
                        medicineDTO.setQuantity(medicine.getQuantity());
                        medicineDTO.setPurchasePrice(medicine.getPurchasePrice());
                        medicineDTO.setTax(medicine.getTax());
                        medicineDTO.setAmount(medicine.getAmount());

                        ResponseEntity<HMS_TM_AddCompany> companyResponse = adminManagementInterface.getCompanyByIds(medicine.getCompanyId());
                        if (companyResponse != null && companyResponse.getStatusCode().is2xxSuccessful()) {
                            medicineDTO.setCompanyDetails(companyResponse.getBody());
                        }

                        return medicineDTO;
                    }).collect(Collectors.toList());

            dto.setMedicines(medicines);

            return dto;
        } else {
            return null;
        }
    }

//    @Transactional
//    public void updatePurchaseBillStatus(String purchaseBillId, String status) {
//        HMS_TM_PurchaseBill purchaseBill = purchaseBillRepository.findById(purchaseBillId)
//                .orElseThrow(() -> new RuntimeException("Purchase Bill not found"));
//
//        purchaseBill.setStatus(status);
//        purchaseBillRepository.save(purchaseBill);
//
//        if ("COMPLETED".equalsIgnoreCase(status)) {
//            List<HMS_TM_PurchaseMedicine> purchaseMedicines = purchaseMedicineRepository.findByPurchaseBillId(purchaseBillId);
//
//            for (HMS_TM_PurchaseMedicine medicine : purchaseMedicines) {
//                List<HMS_TM_AddMedicine> existingMedicine = addMedicineRepository.findByNameAndCategoryAndBatchNo(
//                        medicine.getMedicineName(),
//                        medicine.getMedicineCategory(),
//                        medicine.getBatchNo()
//                );
//
//                if (!existingMedicine.isEmpty()) {
//                    HMS_TM_AddMedicine addMedicine = existingMedicine.get(0);
//
//                    if (addMedicine.getIsDeleted()) {
//                        addMedicine.setIsDeleted(false);
//                    }
//
//                    addMedicine.setBoxPacking(addMedicine.getBoxPacking() + medicine.getQuantity());
//                    addMedicineRepository.save(addMedicine);
//                } else {
//                    HMS_TM_AddMedicine addMedicine = new HMS_TM_AddMedicine();
//                    addMedicine.setCategory(medicine.getMedicineCategory());
//                    addMedicine.setName(medicine.getMedicineName());
//                    addMedicine.setBatchNo(medicine.getBatchNo());
//                    addMedicine.setAmount(medicine.getAmount());
//                    addMedicine.setSalePrice(medicine.getSalePrice());
//                    addMedicine.setTax(medicine.getTax());
//                    addMedicine.setExpiryDate(medicine.getExpiryDate());
//                    addMedicine.setBoxPacking(medicine.getQuantity());
//                    addMedicine.setCompanyId(medicine.getCompanyId());
//                    addMedicineRepository.save(addMedicine);
//                }
//            }
//        }
//    }

    @Transactional
    public void updatePurchaseBillStatus(String purchaseBillId, String status) {
        HMS_TM_PurchaseBill purchaseBill = purchaseBillRepository.findById(purchaseBillId)
                .orElseThrow(() -> new RuntimeException("Purchase Bill not found"));

        purchaseBill.setStatus(status);
        purchaseBillRepository.save(purchaseBill);

        if ("COMPLETED".equalsIgnoreCase(status)) {
            List<HMS_TM_PurchaseMedicine> purchaseMedicines = purchaseMedicineRepository.findByPurchaseBillId(purchaseBillId);

            for (HMS_TM_PurchaseMedicine medicine : purchaseMedicines) {
                List<HMS_TM_AddMedicine> existingMedicine = addMedicineRepository.findByNameAndCategoryAndBatchNo(
                        medicine.getMedicineName(),
                        medicine.getMedicineCategory(),
                        medicine.getBatchNo()
                );

                if (!existingMedicine.isEmpty()) {
                    HMS_TM_AddMedicine addMedicine = existingMedicine.get(0);

                    if (addMedicine.getIsDeleted()) {
                        addMedicine.setIsDeleted(false);
                    }

                    addMedicine.setCategory(medicine.getMedicineCategory());
                    addMedicine.setName(medicine.getMedicineName());
                    addMedicine.setBatchNo(medicine.getBatchNo());
                    addMedicine.setAmount(medicine.getAmount());
                    addMedicine.setSalePrice(medicine.getSalePrice());
                    addMedicine.setTax(medicine.getTax());
                    addMedicine.setExpiryDate(medicine.getExpiryDate());
                    addMedicine.setBoxPacking(addMedicine.getBoxPacking() + medicine.getQuantity());
                    addMedicine.setCompanyId(medicine.getCompanyId());
                    addMedicine.setPurchaseDate(purchaseBill.getPurchaseDate());
                    addMedicine.setSupplierId(purchaseBill.getSupplierId());

                    addMedicineRepository.save(addMedicine);
                } else {
                    HMS_TM_AddMedicine addMedicine = new HMS_TM_AddMedicine();
                    addMedicine.setCategory(medicine.getMedicineCategory());
                    addMedicine.setName(medicine.getMedicineName());
                    addMedicine.setBatchNo(medicine.getBatchNo());
                    addMedicine.setAmount(medicine.getAmount());
                    addMedicine.setSalePrice(medicine.getSalePrice());
                    addMedicine.setTax(medicine.getTax());
                    addMedicine.setExpiryDate(medicine.getExpiryDate());
                    addMedicine.setBoxPacking(medicine.getQuantity());
                    addMedicine.setCompanyId(medicine.getCompanyId());
                    addMedicine.setPurchaseDate(purchaseBill.getPurchaseDate());
                    addMedicine.setSupplierId(purchaseBill.getSupplierId());

                    addMedicineRepository.save(addMedicine);
                }
            }
        }
    }

    @Transactional
    public PurchaseBillDTO updatePurchaseBill(String billId, String purchaseBillDataJson,
                                              MultipartFile attachment, MultipartFile chequeAttachment) {
        try {
            PurchaseBillDTO billDTO = objectMapper.readValue(purchaseBillDataJson, PurchaseBillDTO.class);
            billDTO.setPurchaseBillId(billId);

            if (attachment != null && !attachment.isEmpty()) {
                byte[] attachmentData = attachment.getBytes();
                String encodedAttachmentData = Base64.getEncoder().encodeToString(attachmentData);
                billDTO.setAttachment(encodedAttachmentData);
            }

            if (chequeAttachment != null && !chequeAttachment.isEmpty()) {
                byte[] chequeAttachmentData = chequeAttachment.getBytes();
                String encodedAttachmentData = Base64.getEncoder().encodeToString(chequeAttachmentData);

                billDTO.setChequeAttachDocument(encodedAttachmentData);
            }

            HMS_TM_PurchaseBill purchaseBill = purchaseBillRepository.findById(billId)
                    .orElseThrow(() -> new RuntimeException("Purchase bill not found with ID: " + billId));

            purchaseBill.setSupplierId(billDTO.getSupplierId());
            purchaseBill.setBillNo(billDTO.getBillNo());
            purchaseBill.setPurchaseDate(LocalDateTime.now());
            purchaseBill.setNote(billDTO.getNote());
            purchaseBill.setTotalAmount(billDTO.getTotalAmount());
            purchaseBill.setDiscount(billDTO.getDiscount());
            purchaseBill.setTax(billDTO.getTax());
            purchaseBill.setNetAmount(billDTO.getNetAmount());
            purchaseBill.setPaymentMode(billDTO.getPaymentMode());
            purchaseBill.setPaymentAmount(billDTO.getPaymentAmount());
            purchaseBill.setPaymentNote(billDTO.getPaymentNote());
            purchaseBill.setAttachment(billDTO.getAttachment());
            purchaseBill.setChequeDate(billDTO.getChequeDate());
            purchaseBill.setChequeNo(billDTO.getChequeNo());
            purchaseBill.setChequeAttachDocument(billDTO.getChequeAttachDocument());

            if (billDTO.getMedicines() != null) {
                for (PurchaseMedicineDTO medicineDTO : billDTO.getMedicines()) {
                    HMS_TM_PurchaseMedicine medicine = purchaseMedicineRepository.findById(medicineDTO.getMedicineId())
                            .orElse(new HMS_TM_PurchaseMedicine());

                    medicine.setPurchaseBillId(purchaseBill.getPurchaseBillId());
                    medicine.setMedicineCategory(medicineDTO.getMedicineCategory());
                    medicine.setMedicineName(medicineDTO.getMedicineName());
                    medicine.setBatchNo(medicineDTO.getBatchNo());
                    medicine.setExpiryDate(medicineDTO.getExpiryDate());
                    medicine.setMrp(medicineDTO.getMrp());
                    medicine.setBatchAmount(medicineDTO.getBatchAmount());
                    medicine.setSalePrice(medicineDTO.getSalePrice());
                    medicine.setPackingQty(medicineDTO.getPackingQty());
                    medicine.setQuantity(medicineDTO.getQuantity());
                    medicine.setPurchasePrice(medicineDTO.getPurchasePrice());
                    medicine.setTax(medicineDTO.getTax());
                    medicine.setAmount(medicineDTO.getAmount());
                    medicine.setCompanyId(medicineDTO.getCompanyId());

                    purchaseMedicineRepository.save(medicine);
                }
            }

            purchaseBillRepository.save(purchaseBill);

            PurchaseBillDTO responseDTO = new PurchaseBillDTO();
            responseDTO.setPurchaseBillId(purchaseBill.getPurchaseBillId());
            responseDTO.setSupplierId(purchaseBill.getSupplierId());
            responseDTO.setBillNo(purchaseBill.getBillNo());
            responseDTO.setPurchaseDate(purchaseBill.getPurchaseDate());
            responseDTO.setNote(purchaseBill.getNote());
            responseDTO.setTotalAmount(purchaseBill.getTotalAmount());
            responseDTO.setDiscount(purchaseBill.getDiscount());
            responseDTO.setTax(purchaseBill.getTax());
            responseDTO.setNetAmount(purchaseBill.getNetAmount());
            responseDTO.setPaymentMode(purchaseBill.getPaymentMode());
            responseDTO.setPaymentAmount(purchaseBill.getPaymentAmount());
            responseDTO.setPaymentNote(purchaseBill.getPaymentNote());
            responseDTO.setAttachment(purchaseBill.getAttachment());
            responseDTO.setChequeNo(purchaseBill.getChequeNo());
            responseDTO.setChequeDate(purchaseBill.getChequeDate());
            responseDTO.setChequeAttachDocument(purchaseBill.getChequeAttachDocument());

            List<HMS_TM_PurchaseMedicine> medicines = purchaseMedicineRepository.findByPurchaseBillId(billId);
            List<PurchaseMedicineDTO> medicineDTOs = medicines.stream()
                    .map(medicine -> {
                        PurchaseMedicineDTO dto = new PurchaseMedicineDTO();
                        dto.setMedicineId(medicine.getMedicineId());
                        dto.setPurchaseBillId(medicine.getPurchaseBillId());
                        dto.setMedicineCategory(medicine.getMedicineCategory());
                        dto.setMedicineName(medicine.getMedicineName());
                        dto.setBatchNo(medicine.getBatchNo());
                        dto.setExpiryDate(medicine.getExpiryDate());
                        dto.setMrp(medicine.getMrp());
                        dto.setBatchAmount(medicine.getBatchAmount());
                        dto.setSalePrice(medicine.getSalePrice());
                        dto.setPackingQty(medicine.getPackingQty());
                        dto.setQuantity(medicine.getQuantity());
                        dto.setPurchasePrice(medicine.getPurchasePrice());
                        dto.setTax(medicine.getTax());
                        dto.setAmount(medicine.getAmount());
                        dto.setCompanyId(medicine.getCompanyId());
                        return dto;
                    })
                    .collect(Collectors.toList());

            responseDTO.setMedicines(medicineDTOs);

            return responseDTO;
        } catch (Exception e) {
            throw new RuntimeException("Error occurred while updating the purchase bill", e);
        }
    }

    public void deletePurchaseBill(String id) {
        Optional<HMS_TM_PurchaseBill> purchaseBillOptional = purchaseBillRepository.findById(id);
        if (purchaseBillOptional.isPresent()) {
            HMS_TM_PurchaseBill purchaseBill = purchaseBillOptional.get();
            purchaseBill.setDeleted(true);
            purchaseBillRepository.save(purchaseBill);
        } else {
            throw new RuntimeException("Purchase Bill not found with ID: " + id);
        }
    }

    public IncomeChanges getTotalPurchaseAmount() {
        Double todayIncome = purchaseBillRepository.getTodayTotalMedicinePurchaseAmount();
        LocalDate yesterday = LocalDate.now().minusDays(1);
        Double yesterdayIncome = purchaseBillRepository.getYesterdayTotalMedicinePurchaseAmount(yesterday);
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

    public List<ExpiryMedicineReportResponse> searchExpiryMedicines(
            String medicineCategory,
            String timeDuration,
            String startDate,
            String endDate) {

        LocalDate[] dateRange = calculateDateRange(timeDuration, startDate, endDate);
        LocalDate calculatedStartDate = dateRange[0];
        LocalDate calculatedEndDate = dateRange[1];

        String startMonthYear = calculatedStartDate != null ? calculatedStartDate.toString().substring(0, 7) : null;
        String endMonthYear = calculatedEndDate != null ? calculatedEndDate.toString().substring(0, 7) : null;

        List<ExpiryMedicineProjection> projections = purchaseMedicineRepository.findExpiryMedicines(
                medicineCategory,
                startMonthYear,
                endMonthYear
        );

        return projections.stream()
                .flatMap(projection -> convertToResponse(projection, medicineCategory).stream())
                .collect(Collectors.toList());
    }

    private List<ExpiryMedicineReportResponse> convertToResponse(ExpiryMedicineProjection projection, String medicineCategory) {
        List<ExpiryMedicineReportResponse> responses = new ArrayList<>();

        ExpiryMedicineReportResponse response = new ExpiryMedicineReportResponse();
        response.setMedicineName(projection.getMedicineName());
        response.setBatchNo(projection.getBatchNo());
        response.setMedicineCategory(projection.getMedicineCategory());
        response.setQuantity(projection.getQuantity());

        String expiryDateStr = projection.getExpiryDate();

        if (expiryDateStr != null && !expiryDateStr.isEmpty()) {
            try {
                if (expiryDateStr.length() == 10) {
                    expiryDateStr = expiryDateStr.substring(0, 7);
                }
                response.setExpireDate(expiryDateStr);
            } catch (Exception e) {
                response.setExpireDate(null);
            }
        } else {
            response.setExpireDate(null);
        }

        responses.add(response);
        return responses;
    }

    private LocalDate[] calculateDateRange(String timeDuration, String startDate, String endDate) {
        LocalDate now = LocalDate.now();
        LocalDate calculatedStartDate = null;
        LocalDate calculatedEndDate = null;

        if (timeDuration != null) {
            switch (timeDuration.toUpperCase()) {
                case "WEEKLY":
                    calculatedStartDate = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
                    calculatedEndDate = now.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));
                    break;
                case "MONTHLY":
                    calculatedStartDate = now.withDayOfMonth(1);
                    calculatedEndDate = now.with(TemporalAdjusters.lastDayOfMonth());
                    break;
                case "YEARLY":
                    calculatedStartDate = now.withDayOfYear(1);
                    calculatedEndDate = now.with(TemporalAdjusters.lastDayOfYear());
                    break;
                case "LAST_YEAR":
                    LocalDate lastYear = now.minusYears(1);
                    calculatedStartDate = lastYear.withDayOfYear(1);
                    calculatedEndDate = lastYear.with(TemporalAdjusters.lastDayOfYear());
                    break;
                case "CUSTOM":
                    try {
                        if (startDate != null && !startDate.isEmpty()) {
                            calculatedStartDate = LocalDate.parse(startDate + "-01");
                        }
                        if (endDate != null && !endDate.isEmpty()) {
                            calculatedEndDate = LocalDate.parse(endDate + "-01").with(TemporalAdjusters.lastDayOfMonth());
                        }
                    } catch (DateTimeParseException e) {
                        calculatedStartDate = now;
                        calculatedEndDate = now;
                    }
                    break;
                default:
                    if (startDate != null && !startDate.isEmpty()) {
                        calculatedStartDate = LocalDate.parse(startDate + "-01");
                    }
                    if (endDate != null && !endDate.isEmpty()) {
                        calculatedEndDate = LocalDate.parse(endDate + "-01").with(TemporalAdjusters.lastDayOfMonth());
                    }
                    break;
            }
        }
        return new LocalDate[]{calculatedStartDate, calculatedEndDate};
    }
}


