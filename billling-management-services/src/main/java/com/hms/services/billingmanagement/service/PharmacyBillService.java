package com.hms.services.billingmanagement.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.services.billingmanagement.configuration.IpdInterface;
import com.hms.services.billingmanagement.configuration.OpdInterface;
import com.hms.services.billingmanagement.configuration.PatientManagementInterface;
import com.hms.services.billingmanagement.entity.HMS_TM_AddMedicine;
import com.hms.services.billingmanagement.entity.HMS_TM_Medicine;
import com.hms.services.billingmanagement.entity.HMS_TM_PharmacyBill;
import com.hms.services.billingmanagement.entity.HMS_TM_PurchaseMedicine;
import com.hms.services.billingmanagement.exceptionhandler.CustomException;
import com.hms.services.billingmanagement.model.*;
import com.hms.services.billingmanagement.repository.AddMedicineRepository;
import com.hms.services.billingmanagement.repository.MedicineRepository;
import com.hms.services.billingmanagement.repository.PharmacyBillRepository;
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
import java.time.temporal.IsoFields;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PharmacyBillService {

    private final PharmacyBillRepository pharmacyBillRepository;

    private final MedicineRepository medicineRepository;

    private final ObjectMapper objectMapper;

    private final IpdInterface ipdInterface;

    private final OpdInterface opdInterface;

    private final PatientManagementInterface patientManagementInterface;

    private final ModelMapper modelMapper;

    private final AddMedicineRepository addMedicineRepository;

    private final PurchaseMedicineRepository purchaseMedicineRepository;

    @Autowired
    public PharmacyBillService(PharmacyBillRepository pharmacyBillRepository, MedicineRepository medicineRepository, ObjectMapper objectMapper, final IpdInterface ipdInterface, final OpdInterface opdInterface, PatientManagementInterface patientManagementInterface, ModelMapper modelMapper, AddMedicineRepository addMedicineRepository, PurchaseMedicineRepository purchaseMedicineRepository) {
        this.pharmacyBillRepository = pharmacyBillRepository;
        this.medicineRepository = medicineRepository;
        this.objectMapper = objectMapper;
        this.ipdInterface = ipdInterface;
        this.opdInterface = opdInterface;
        this.patientManagementInterface = patientManagementInterface;
        this.modelMapper = modelMapper;
        this.addMedicineRepository = addMedicineRepository;
        this.purchaseMedicineRepository = purchaseMedicineRepository;
    }

    @Transactional
    public PharmacyBillDTO generateBill(
            String medicineDataJson,
            MultipartFile photoFile) {

        try {
            PharmacyBillDTO billDTO = objectMapper.readValue(medicineDataJson, PharmacyBillDTO.class);

            HMS_TM_PharmacyBill bill = new HMS_TM_PharmacyBill();

            String maxId = pharmacyBillRepository.findMaxPharmacyBillId();

            int nextId = (maxId == null) ? 1 : Integer.parseInt(maxId.substring(7)) + 1;
            String generatedId = "PHARMA" + String.format("%03d", nextId);
            bill.setPharmacyBillId(generatedId);

            bill.setPatientId(billDTO.getPatientId());
            bill.setBillNo(billDTO.getBillNo());
            bill.setCaseId(billDTO.getCaseId());
            bill.setIpdOrOpdId(billDTO.getIpdOrOpdId());
            bill.setPrescriptionNo(billDTO.getPrescriptionNo());
            bill.setHospitalDoctor(billDTO.getHospitalDoctor());
            bill.setDoctorName(billDTO.getDoctorName());
            bill.setNote(billDTO.getNote());
            bill.setTotalAmount(billDTO.getTotalAmount());
            bill.setDiscount(billDTO.getDiscount());
            bill.setTax(billDTO.getTax());
            bill.setNetAmount(billDTO.getNetAmount());
            bill.setPaymentMode(billDTO.getPaymentMode());
            bill.setPaymentAmount(billDTO.getPaymentAmount());
            bill.setDateTime(LocalDateTime.now());
            bill.setChequeNo(billDTO.getChequeNo());
            bill.setAttachDocument(billDTO.getAttachDocument());
            bill.setChequeDate(billDTO.getChequeDate());

            double netAmount = billDTO.getNetAmount() != null ? billDTO.getNetAmount() : 0.0;
            double paymentAmount = billDTO.getPaymentAmount() != null ? billDTO.getPaymentAmount() : 0.0;
            double balanceAmount = netAmount - paymentAmount;
            bill.setBalanceAmount(balanceAmount > 0 ? balanceAmount : 0.0);

            if (photoFile != null) {
                byte[] photoBytes = photoFile.getBytes();
                String encodedPhoto = Base64.getEncoder().encodeToString(photoBytes);
                bill.setAttachDocument(encodedPhoto);
            }
            if(billDTO.getPrescriptionNo().startsWith("OPD")){
                opdInterface.addPrescriptionByPayment(billDTO.getPrescriptionNo(),true,null,null);
            } else if (billDTO.getPrescriptionNo().startsWith("IPD")) {
                ipdInterface.addPrescriptionByPayment(billDTO.getPrescriptionNo(),true,null,null);
            }
            HMS_TM_PharmacyBill savedBill = pharmacyBillRepository.save(bill);
            String billId = savedBill.getPharmacyBillId();

//            List<HMS_TM_Medicine> medicines = new ArrayList<>();
//            if (billDTO.getMedicines() != null && !billDTO.getMedicines().isEmpty()) {
//                for (MedicineDTO medicineDTO : billDTO.getMedicines()) {
//                    HMS_TM_Medicine medicine = new HMS_TM_Medicine();
//                    medicine.setMedicineId(medicineDTO.getMedicineId());
//                    medicine.setPharmacyBillId(billId);
//                    medicine.setMedicineCategory(medicineDTO.getMedicineCategory());
//                    medicine.setMedicineName(medicineDTO.getMedicineName());
//                    medicine.setBatchNo(medicineDTO.getBatchNo());
//                    medicine.setExpiryDate(medicineDTO.getExpiryDate());
//                    medicine.setQuantity(medicineDTO.getQuantity());
//                    medicine.setSalePrice(medicineDTO.getSalePrice());
//                    medicine.setTax(medicineDTO.getTax());
//                    medicine.setAmount(medicineDTO.getAmount());
//
//                    List<HMS_TM_AddMedicine> medicineList = addMedicineRepository.findByNameAndCategory(
//                            medicineDTO.getMedicineName(), medicineDTO.getMedicineCategory());
//
//                    if (medicineList.isEmpty()) {
//                        throw new RuntimeException("Medicine not found in stock: " + medicineDTO.getMedicineName() +
//                                " (Category: " + medicineDTO.getMedicineCategory() + ")");
//                    }
//
//                    HMS_TM_AddMedicine selectedMedicine = medicineList.get(0);
//
//                    int availableQuantity = selectedMedicine.getBoxPacking() != null ? selectedMedicine.getBoxPacking() : 0;
//                    int soldQuantity = medicineDTO.getQuantity();
//
//                    if (soldQuantity > availableQuantity) {
//                        throw new RuntimeException("Insufficient quantity available for medicine: " + medicineDTO.getMedicineName() +
//                                ". Available: " + availableQuantity + ", Requested: " + soldQuantity);
//                    }
//
//                    selectedMedicine.setBoxPacking(availableQuantity - soldQuantity);
//                    addMedicineRepository.save(selectedMedicine);
//
//                    List<HMS_TM_PurchaseMedicine> purchaseMedicines = purchaseMedicineRepository
//                            .findByMedicineNameAndMedicineCategory(medicineDTO.getMedicineName(), medicineDTO.getMedicineCategory());
//
//                    if (!purchaseMedicines.isEmpty()) {
//                        for (HMS_TM_PurchaseMedicine purchaseMedicine : purchaseMedicines) {
//                            purchaseMedicine.setAvailableQty(purchaseMedicine.getAvailableQty() - soldQuantity);
//                            purchaseMedicineRepository.save(purchaseMedicine);
//                        }
//                    } else {
//                        HMS_TM_PurchaseMedicine newPurchaseMedicine = new HMS_TM_PurchaseMedicine();
//                        newPurchaseMedicine.setMedicineName(medicineDTO.getMedicineName());
//                        newPurchaseMedicine.setMedicineCategory(medicineDTO.getMedicineCategory());
//                        newPurchaseMedicine.setAvailableQty(availableQuantity - soldQuantity);
//                        purchaseMedicineRepository.save(newPurchaseMedicine);
//                    }
//                    medicine.setAvailableQty(availableQuantity - soldQuantity);
//
//                    medicines.add(medicine);
//                    medicineRepository.saveAll(medicines);
//                }
//            }

            List<HMS_TM_Medicine> medicines = new ArrayList<>();
            if (billDTO.getMedicines() != null && !billDTO.getMedicines().isEmpty()) {
                for (MedicineDTO medicineDTO : billDTO.getMedicines()) {
                    HMS_TM_Medicine medicine = new HMS_TM_Medicine();
                    medicine.setMedicineId(medicineDTO.getMedicineId());
                    medicine.setPharmacyBillId(billId);
                    medicine.setMedicineCategory(medicineDTO.getMedicineCategory());
                    medicine.setMedicineName(medicineDTO.getMedicineName());
                    medicine.setBatchNo(medicineDTO.getBatchNo());
                    medicine.setExpiryDate(medicineDTO.getExpiryDate());
                    medicine.setQuantity(medicineDTO.getQuantity());
                    medicine.setSalePrice(medicineDTO.getSalePrice());
                    medicine.setTax(medicineDTO.getTax());
                    medicine.setAmount(medicineDTO.getAmount());

                    List<HMS_TM_AddMedicine> medicineList = addMedicineRepository.findByNameAndCategoryAndBatchNo(
                            medicineDTO.getMedicineName(), medicineDTO.getMedicineCategory(), medicineDTO.getBatchNo());

                    if (medicineList.isEmpty()) {
                        throw new RuntimeException("Medicine not found in stock: " + medicineDTO.getMedicineName() +
                                " (Category: " + medicineDTO.getMedicineCategory() + ", Batch No: " + medicineDTO.getBatchNo() + ")");
                    }

                    HMS_TM_AddMedicine selectedMedicine = medicineList.get(0);

                    int availableQuantity = selectedMedicine.getBoxPacking() != null ? selectedMedicine.getBoxPacking() : 0;
                    int soldQuantity = medicineDTO.getQuantity();

                    if (soldQuantity > availableQuantity) {
                        throw new RuntimeException("Insufficient quantity available for medicine: " + medicineDTO.getMedicineName() +
                                " (Batch No: " + medicineDTO.getBatchNo() + "). Available: " + availableQuantity +
                                ", Requested: " + soldQuantity);
                    }

                    selectedMedicine.setBoxPacking(availableQuantity - soldQuantity);
                    addMedicineRepository.save(selectedMedicine);

                    medicine.setAvailableQty(availableQuantity - soldQuantity);

                    medicines.add(medicine);
                }
                medicineRepository.saveAll(medicines);
            }

            PharmacyBillDTO responseDTO = new PharmacyBillDTO();
            responseDTO.setBillId(savedBill.getPharmacyBillId());
            responseDTO.setBillNo(savedBill.getBillNo());
            responseDTO.setPatientId(savedBill.getPatientId());
            responseDTO.setIpdOrOpdId(savedBill.getIpdOrOpdId());
            responseDTO.setCaseId(savedBill.getCaseId());
            responseDTO.setPrescriptionNo(savedBill.getPrescriptionNo());
            responseDTO.setHospitalDoctor(savedBill.getHospitalDoctor());
            responseDTO.setDoctorName(savedBill.getDoctorName());
            responseDTO.setNote(savedBill.getNote());
            responseDTO.setTotalAmount(savedBill.getTotalAmount());
            responseDTO.setDiscount(savedBill.getDiscount());
            responseDTO.setTax(savedBill.getTax());
            responseDTO.setNetAmount(savedBill.getNetAmount());
            responseDTO.setPaymentMode(savedBill.getPaymentMode());
            responseDTO.setPaymentAmount(savedBill.getPaymentAmount());
            responseDTO.setDateTime(savedBill.getDateTime());
            responseDTO.setBalanceAmount(savedBill.getBalanceAmount());
            responseDTO.setChequeNo(savedBill.getChequeNo());
            responseDTO.setChequeDate(savedBill.getChequeDate());
            responseDTO.setAttachDocument(savedBill.getAttachDocument());

            if (medicines != null) {
                List<MedicineDTO> responseMedicines = medicines.stream()
                        .map(medicine -> {
                            MedicineDTO responseMedicine = new MedicineDTO();
                            responseMedicine.setMedicineId(medicine.getMedicineId());
                            responseMedicine.setPharmacyBillId(medicine.getPharmacyBillId());
                            responseMedicine.setMedicineCategory(medicine.getMedicineCategory());
                            responseMedicine.setMedicineName(medicine.getMedicineName());
                            responseMedicine.setBatchNo(medicine.getBatchNo());
                            responseMedicine.setExpiryDate(medicine.getExpiryDate());
                            responseMedicine.setQuantity(medicine.getQuantity());
                            responseMedicine.setAvailableQty(medicine.getAvailableQty());
                            responseMedicine.setSalePrice(medicine.getSalePrice());
                            responseMedicine.setTax(medicine.getTax());
                            responseMedicine.setAmount(medicine.getAmount());
                            return responseMedicine;
                        })
                        .collect(Collectors.toList());
                responseDTO.setMedicines(responseMedicines);
            }

            return responseDTO;

        } catch (Exception e) {
            throw new RuntimeException("Error generating pharmacy bill: " + e.getMessage(), e);
        }
    }

    @Transactional
    public List<PharmacyBillDTO> getAllPharmacyBills(int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Order.asc("dateTime")));
        Page<HMS_TM_PharmacyBill> billsPage = pharmacyBillRepository.findByDeletedFalse(pageRequest);
        return billsPage.stream().map(bill -> {
            PharmacyBillDTO dto = new PharmacyBillDTO();
            dto.setBillNo(bill.getBillNo());

            ResponseEntity<PatientsDTO> response = patientManagementInterface.getPatientById(bill.getPatientId());
            PatientsDTO patientDetails = modelMapper.map(response.getBody(), PatientsDTO.class);
            dto.setPatientId(patientDetails.getPatientId());
            dto.setPatientDetails(patientDetails);

            dto.setPrescriptionNo(bill.getPrescriptionNo());
            dto.setCaseId(bill.getCaseId());
            dto.setIpdOrOpdId(bill.getIpdOrOpdId());
            dto.setBillId(bill.getPharmacyBillId());
            dto.setDateTime(bill.getDateTime());
            dto.setHospitalDoctor(bill.getHospitalDoctor());
            dto.setDoctorName(bill.getDoctorName());
            dto.setNote(bill.getNote());
            dto.setTotalAmount(bill.getTotalAmount());
            dto.setDiscount(bill.getDiscount());
            dto.setTax(bill.getTax());
            dto.setNetAmount(bill.getNetAmount());
            dto.setPaymentMode(bill.getPaymentMode());
            dto.setPaymentAmount(bill.getPaymentAmount());
            dto.setBalanceAmount(bill.getBalanceAmount());
            dto.setChequeDate(bill.getChequeDate());
            dto.setChequeNo(bill.getChequeNo());
            dto.setAttachDocument(bill.getAttachDocument());

            List<MedicineDTO> medicines = medicineRepository.findByPharmacyBillId(bill.getPharmacyBillId()).stream()
                    .map(medicine -> {
                        MedicineDTO medicineDTO = new MedicineDTO();
                        medicineDTO.setMedicineId(medicine.getMedicineId());
                        medicineDTO.setPharmacyBillId(medicine.getPharmacyBillId());
                        medicineDTO.setMedicineCategory(medicine.getMedicineCategory());
                        medicineDTO.setMedicineName(medicine.getMedicineName());
                        medicineDTO.setBatchNo(medicine.getBatchNo());
                        medicineDTO.setExpiryDate(medicine.getExpiryDate());
                        medicineDTO.setQuantity(medicine.getQuantity());
                        medicineDTO.setAvailableQty(medicine.getAvailableQty());
                        medicineDTO.setSalePrice(medicine.getSalePrice());
                        medicineDTO.setTax(medicine.getTax());
                        medicineDTO.setAmount(medicine.getAmount());
                        return medicineDTO;
                    }).collect(Collectors.toList());

            dto.setMedicines(medicines);
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public PharmacyBillDTO getPharmacyBillById(String billId) {
        HMS_TM_PharmacyBill bill = pharmacyBillRepository.findByPharmacyBillIdAndDeletedFalse(billId)
                .orElseThrow(() -> new CustomException("Pharmacy Bill not found with id " + billId));

        PharmacyBillDTO dto = new PharmacyBillDTO();
        dto.setBillId(bill.getPharmacyBillId());
        dto.setBillNo(bill.getBillNo());

        ResponseEntity<PatientsDTO> response = patientManagementInterface.getPatientById(bill.getPatientId());
        PatientsDTO patientDetails = modelMapper.map(response.getBody(), PatientsDTO.class);
        dto.setPatientId(patientDetails.getPatientId());
        dto.setPatientDetails(patientDetails);

        dto.setPrescriptionNo(bill.getPrescriptionNo());
        dto.setCaseId(bill.getCaseId());
        dto.setIpdOrOpdId(bill.getIpdOrOpdId());
        dto.setDateTime(bill.getDateTime());
        dto.setHospitalDoctor(bill.getHospitalDoctor());
        dto.setDoctorName(bill.getDoctorName());
        dto.setNote(bill.getNote());
        dto.setTotalAmount(bill.getTotalAmount());
        dto.setDiscount(bill.getDiscount());
        dto.setTax(bill.getTax());
        dto.setNetAmount(bill.getNetAmount());
        dto.setPaymentMode(bill.getPaymentMode());
        dto.setPaymentAmount(bill.getPaymentAmount());
        dto.setBalanceAmount(bill.getBalanceAmount());
        dto.setChequeDate(bill.getChequeDate());
        dto.setChequeNo(bill.getChequeNo());
        dto.setAttachDocument(bill.getAttachDocument());

        List<MedicineDTO> medicines = medicineRepository.findByPharmacyBillId(bill.getPharmacyBillId()).stream()
                .map(medicine -> {
                    MedicineDTO medicineDTO = new MedicineDTO();
                    medicineDTO.setMedicineId(medicine.getMedicineId());
                    medicineDTO.setPharmacyBillId(medicine.getPharmacyBillId());
                    medicineDTO.setMedicineCategory(medicine.getMedicineCategory());
                    medicineDTO.setMedicineName(medicine.getMedicineName());
                    medicineDTO.setBatchNo(medicine.getBatchNo());
                    medicineDTO.setExpiryDate(medicine.getExpiryDate());
                    medicineDTO.setQuantity(medicine.getQuantity());
                    medicineDTO.setAvailableQty(medicine.getAvailableQty());
                    medicineDTO.setSalePrice(medicine.getSalePrice());
                    medicineDTO.setTax(medicine.getTax());
                    medicineDTO.setAmount(medicine.getAmount());
                    return medicineDTO;
                }).collect(Collectors.toList());

        dto.setMedicines(medicines);
        return dto;
    }

    @Transactional
    public PharmacyBillDTO updatePharmacyBill(String billId, String medicineDataJson, MultipartFile photoFile) {
        try {
            PharmacyBillDTO billDTO = objectMapper.readValue(medicineDataJson, PharmacyBillDTO.class);

            HMS_TM_PharmacyBill pharmacyBill = pharmacyBillRepository.findById(billId)
                    .orElseThrow(() -> new RuntimeException("Pharmacy bill not found with ID: " + billId));

            pharmacyBill.setHospitalDoctor(billDTO.getHospitalDoctor());
            pharmacyBill.setBillNo(billDTO.getBillNo());
            pharmacyBill.setCaseId(billDTO.getCaseId());
            pharmacyBill.setIpdOrOpdId(billDTO.getIpdOrOpdId());
            pharmacyBill.setPatientId(billDTO.getPatientId());
            pharmacyBill.setPrescriptionNo(billDTO.getPrescriptionNo());
            pharmacyBill.setDoctorName(billDTO.getDoctorName());
            pharmacyBill.setDateTime(LocalDateTime.now());
            pharmacyBill.setNote(billDTO.getNote());
            pharmacyBill.setTotalAmount(billDTO.getTotalAmount());
            pharmacyBill.setDiscount(billDTO.getDiscount());
            pharmacyBill.setTax(billDTO.getTax());
            pharmacyBill.setNetAmount(billDTO.getNetAmount());
            pharmacyBill.setPaymentMode(billDTO.getPaymentMode());
            pharmacyBill.setChequeNo(billDTO.getChequeNo());
            pharmacyBill.setAttachDocument(billDTO.getAttachDocument());
            pharmacyBill.setChequeDate(billDTO.getChequeDate());

            Double previousPaymentAmount = pharmacyBill.getPaymentAmount() != null ? pharmacyBill.getPaymentAmount() : 0.0;
            Double balanceAmount = pharmacyBill.getNetAmount() - previousPaymentAmount;
            Double newPayment = billDTO.getPaymentAmount();
            if (newPayment != null && newPayment > 0) {
                pharmacyBill.setPaymentAmount(previousPaymentAmount + newPayment);
                balanceAmount -= newPayment;
            }
            pharmacyBill.setBalanceAmount(balanceAmount > 0 ? balanceAmount : 0.0);

            if (photoFile != null) {
                byte[] photoBytes = photoFile.getBytes();
                String encodedPhoto = Base64.getEncoder().encodeToString(photoBytes);
                pharmacyBill.setAttachDocument(encodedPhoto);
            }

            List<MedicineDTO> medicinesDTO = new ArrayList<>();
            if (billDTO.getMedicines() != null) {
                for (MedicineDTO medicineDTO : billDTO.getMedicines()) {
                    HMS_TM_Medicine medicine;

                    if (medicineDTO.getMedicineId() != null) {
                        medicine = medicineRepository.findById(medicineDTO.getMedicineId())
                                .orElseThrow(() -> new RuntimeException("Medicine not found with ID: " + medicineDTO.getMedicineId()));
                    } else {
                        medicine = new HMS_TM_Medicine();
                    }

                    medicine.setMedicineCategory(medicineDTO.getMedicineCategory());
                    medicine.setMedicineName(medicineDTO.getMedicineName());
                    medicine.setBatchNo(medicineDTO.getBatchNo());
                    medicine.setExpiryDate(medicineDTO.getExpiryDate());
                    medicine.setQuantity(medicineDTO.getQuantity());
                    medicine.setAvailableQty(medicineDTO.getAvailableQty());
                    medicine.setSalePrice(medicineDTO.getSalePrice());
                    medicine.setTax(medicineDTO.getTax());
                    medicine.setAmount(medicineDTO.getAmount());

                    medicine.setPharmacyBillId(pharmacyBill.getPharmacyBillId());

                    medicine = medicineRepository.save(medicine);

                    MedicineDTO savedMedicineDTO = new MedicineDTO();
                    savedMedicineDTO.setMedicineId(medicine.getMedicineId());
                    savedMedicineDTO.setPharmacyBillId(medicine.getPharmacyBillId());
                    savedMedicineDTO.setMedicineCategory(medicine.getMedicineCategory());
                    savedMedicineDTO.setMedicineName(medicine.getMedicineName());
                    savedMedicineDTO.setBatchNo(medicine.getBatchNo());
                    savedMedicineDTO.setExpiryDate(medicine.getExpiryDate());
                    savedMedicineDTO.setQuantity(medicine.getQuantity());
                    savedMedicineDTO.setAvailableQty(medicine.getAvailableQty());
                    savedMedicineDTO.setSalePrice(medicine.getSalePrice());
                    savedMedicineDTO.setTax(medicine.getTax());
                    savedMedicineDTO.setAmount(medicine.getAmount());

                    medicinesDTO.add(savedMedicineDTO);
                }
            }

            pharmacyBillRepository.save(pharmacyBill);

            PharmacyBillDTO responseDTO = new PharmacyBillDTO();
            responseDTO.setBillId(pharmacyBill.getPharmacyBillId());
            responseDTO.setBillNo(pharmacyBill.getBillNo());
            responseDTO.setPatientId(pharmacyBill.getPatientId());
            responseDTO.setIpdOrOpdId(pharmacyBill.getIpdOrOpdId());
            responseDTO.setCaseId(pharmacyBill.getCaseId());
            responseDTO.setPrescriptionNo(pharmacyBill.getPrescriptionNo());
            responseDTO.setDateTime(pharmacyBill.getDateTime());
            responseDTO.setHospitalDoctor(pharmacyBill.getHospitalDoctor());
            responseDTO.setDoctorName(pharmacyBill.getDoctorName());
            responseDTO.setNote(pharmacyBill.getNote());
            responseDTO.setTotalAmount(pharmacyBill.getTotalAmount());
            responseDTO.setDiscount(pharmacyBill.getDiscount());
            responseDTO.setTax(pharmacyBill.getTax());
            responseDTO.setNetAmount(pharmacyBill.getNetAmount());
            responseDTO.setPaymentMode(pharmacyBill.getPaymentMode());
            responseDTO.setPaymentAmount(pharmacyBill.getPaymentAmount());
            responseDTO.setBalanceAmount(pharmacyBill.getBalanceAmount());
            responseDTO.setChequeDate(pharmacyBill.getChequeDate());
            responseDTO.setChequeNo(pharmacyBill.getChequeNo());
            responseDTO.setAttachDocument(pharmacyBill.getAttachDocument());

            responseDTO.setMedicines(medicinesDTO);

            return responseDTO;

        } catch (Exception e) {
            throw new RuntimeException("Error updating pharmacy bill: " + e.getMessage(), e);
        }
    }

    public void deletePharmacyBill(String id) {
        Optional<HMS_TM_PharmacyBill> pharmacyBillOptional = pharmacyBillRepository.findById(id);
        if (pharmacyBillOptional.isPresent()) {
            HMS_TM_PharmacyBill pharmacyBill = pharmacyBillOptional.get();
            pharmacyBill.setDeleted(true);
            pharmacyBillRepository.save(pharmacyBill);
        } else {
            throw new RuntimeException("Pharmacy Bill not found with ID: " + id);
        }
    }

//    public Double getPharmacyIncome() {
//        Double income = pharmacyBillRepository.getTotalPharmacyIncome();
//        return income != null ? income : 0.0;
//    }

    public IncomeChanges getPharmacyIncome() {
        Double todayIncome = pharmacyBillRepository.getTotalPharmacyIncome();
        LocalDate yesterday = LocalDate.now().minusDays(1);
        Double yesterdayIncome = pharmacyBillRepository.getYesterdayPharmacyIncome(yesterday);
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

    public Double getPharmacyMonthlyIncome() {
        Double monthlyIncome = pharmacyBillRepository.getMonthlyTotalPharmacyIncome();
        return (monthlyIncome != null) ? monthlyIncome : 0.0;
    }

    public Map<Integer, Double> getPharmacyMonthlySalePerYear() {
        List<Object[]> monthlyIncomes = pharmacyBillRepository.getMonthlyExpenseForYear();
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

    public List<Object> getCommonlyUsedMedicines() {
        List<Object> result = medicineRepository.getCommonMedicinesWithSoldPercentage();
        if (result == null || result.isEmpty()) {
            return null;
        }
        return result.stream().limit(10).collect(Collectors.toList());
    }


    public BillSummary getPharmacyOpdAndIpdPayment(String ipdOrOpdId) {
        return pharmacyBillRepository.findSummaryByIpdOrOpdId(ipdOrOpdId)
                .orElse(new BillSummary(ipdOrOpdId, 0.0, 0.0));

    }

    public Integer getMedicalHistoryPharmacy(String patientId) {
        Integer pharmacy=pharmacyBillRepository.countByPatientId(patientId);
        return (pharmacy != null) ? pharmacy : 0;
    }

    public IncomeChanges getPharmacyIncreaseMonthlyIncome() {
        Double currentMonthIncome = pharmacyBillRepository.getTotalPharmacyIncomeForMonth(LocalDate.now().getMonthValue(), LocalDate.now().getYear());
        LocalDate previousMonth = LocalDate.now().minusMonths(1);
        Double previousMonthIncome = pharmacyBillRepository.getTotalPharmacyIncomeForMonth(previousMonth.getMonthValue(), previousMonth.getYear());
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

    public IncomeChanges getPharmacyIncreaseYearlyIncome() {
        int currentYear = LocalDate.now().getYear();
        int previousYear = currentYear - 1;
        Double currentYearIncome = pharmacyBillRepository.getTotalPharmacyIncomeForYear(currentYear);
        Double previousYearIncome = pharmacyBillRepository.getTotalPharmacyIncomeForYear(previousYear);
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

    public IncomeChanges getPharmacyIncreaseWeeklyIncome() {
        int currentWeek = LocalDate.now().get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
        int currentYear = LocalDate.now().getYear();
        LocalDate previousWeekDate = LocalDate.now().minusWeeks(1);
        int previousWeek = previousWeekDate.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
        int previousYear = previousWeekDate.getYear();
        Double currentWeekIncome = pharmacyBillRepository.getTotalPharmacyIncomeForWeek(currentWeek, currentYear);
        Double previousWeekIncome = pharmacyBillRepository.getTotalPharmacyIncomeForWeek(previousWeek, previousYear);
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
    public List<HMS_TM_PharmacyBill> getPharmacyBillByIpdOrOpdId(String ipdOrOpdId) {
        return pharmacyBillRepository.findByIpdOrOpdIdAndDeletedFalse(ipdOrOpdId);
    }

    @Transactional
    public List<PharmacyBillResponse> searchPharmacyBills(
            String timeDuration,
            String doctorName,
            String paymentMode,
            LocalDate startDate,
            LocalDate endDate) {

        LocalDateTime[] dateRange = calculateDateRange(timeDuration, startDate, endDate);
        LocalDateTime startDateTime = dateRange[0];
        LocalDateTime endDateTime = dateRange[1];

        List<HMS_TM_PharmacyBill> bills = pharmacyBillRepository.findBillsWithFilters(
                doctorName,
                paymentMode,
                startDateTime,
                endDateTime
        );

        return convertToResponseList(bills);
    }

    private List<PharmacyBillResponse> convertToResponseList(List<HMS_TM_PharmacyBill> bills) {
        List<PharmacyBillResponse> responses = new ArrayList<>();
        for (HMS_TM_PharmacyBill bill : bills) {
            PatientsDTO patient = patientManagementInterface.getPatientById(bill.getPatientId()).getBody();
            PharmacyBillResponse response = new PharmacyBillResponse();
            response.setBillNo(bill.getBillNo());
            response.setDate(bill.getDateTime());
            if (patient != null) {
                response.setPatientName(patient.getFirstName() + " " + patient.getLastName());
                response.setAge(patient.getAge());
                response.setGender(patient.getGender());
            } else {
                response.setPatientName("Unknown");
            }
            response.setPrescriptionNo(bill.getPrescriptionNo());
            response.setDoctorName(bill.getDoctorName());
            response.setNetAmount(bill.getNetAmount());
            response.setPaidAmount(bill.getPaymentAmount());
            response.setBalanceAmount(bill.getBalanceAmount());
            responses.add(response);
        }
        return responses;
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

    public List<HMS_TM_PharmacyBill> fetchAllPharmacyIncomeForToday() {
        return pharmacyBillRepository.getAllPharmacyIncomeForToday();
    }

    public List<HMS_TM_PharmacyBill> fetchAllPharmacyIncomeForMonth() {
        int currentMonth = LocalDate.now().getMonthValue();
        int currentYear = LocalDate.now().getYear();
        return pharmacyBillRepository.getAllPharmacyIncomeForMonth(currentMonth, currentYear);
    }

    public List<HMS_TM_PharmacyBill> fetchAllPharmacyIncomeForYear() {
        int currentYear = LocalDate.now().getYear();
        return pharmacyBillRepository.getAllPharmacyIncomeForYear(currentYear);
    }

    public List<HMS_TM_PharmacyBill> fetchAllPharmacyIncomeForWeek() {
        int currentWeek = LocalDate.now().get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
        int currentYear = LocalDate.now().getYear();
        return pharmacyBillRepository.getAllPharmacyIncomeForWeek(currentWeek, currentYear);
    }
}

