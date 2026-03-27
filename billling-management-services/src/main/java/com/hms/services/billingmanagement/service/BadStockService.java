package com.hms.services.billingmanagement.service;

import com.hms.services.billingmanagement.entity.HMS_TM_AddMedicine;
import com.hms.services.billingmanagement.entity.HMS_TM_BadStock;
import com.hms.services.billingmanagement.model.BadStockDTO;
import com.hms.services.billingmanagement.model.IncomeChanges;
import com.hms.services.billingmanagement.repository.AddMedicineRepository;
import com.hms.services.billingmanagement.repository.BadStockRepository;
import jakarta.persistence.Table;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BadStockService {

    @Autowired
    private BadStockRepository badStockRepository;

    @Autowired
    private AddMedicineRepository addMedicineRepository;

    @Transactional
    public List<BadStockDTO> getAllBadStock() {
        List<HMS_TM_BadStock> badStockList = badStockRepository.findByDeletedFalse();

        List<BadStockDTO> badStockDTOs = new ArrayList<>();
        for (HMS_TM_BadStock badStock : badStockList) {
            HMS_TM_AddMedicine medicine = addMedicineRepository.findById(badStock.getAddMedicineId()).orElse(null);

            if (medicine != null) {
                BadStockDTO badStockDTO = new BadStockDTO(
                        badStock.getId(),
                        badStock.getAddMedicineId(),
                        medicine.getName(),
                        medicine.getCategory(),
                        badStock.getBatchNo(),
                        badStock.getExpiryDate(),
                        badStock.getOutwardDate(),
                        badStock.getQty(),
                        badStock.getNote(),
                        badStock.getDeleted()
                );
                badStockDTOs.add(badStockDTO);
            }
        }

        return badStockDTOs;
    }

    @Transactional
    public Optional<BadStockDTO> getBadStockById(String id) {
        Optional<HMS_TM_BadStock> badStockOptional = badStockRepository.findByIdAndDeletedFalse(id);

        if (badStockOptional.isPresent()) {
            HMS_TM_BadStock badStock = badStockOptional.get();
            HMS_TM_AddMedicine medicine = addMedicineRepository.findById(badStock.getAddMedicineId()).orElse(null);

            if (medicine != null) {
                BadStockDTO badStockDTO = new BadStockDTO(
                        badStock.getId(),
                        badStock.getAddMedicineId(),
                        medicine.getName(),
                        medicine.getCategory(),
                        badStock.getBatchNo(),
                        badStock.getExpiryDate(),
                        badStock.getOutwardDate(),
                        badStock.getQty(),
                        badStock.getNote(),
                        badStock.getDeleted()
                );

                return Optional.of(badStockDTO);
            }
        }

        return Optional.empty();
    }

    public List<HMS_TM_BadStock> getBadStockByMedicineId(String addMedicineId) {
        return badStockRepository.findByAddMedicineId(addMedicineId);
    }

    public void deleteBadStock(String billId) {
        Optional<HMS_TM_BadStock> hmsTmBadStock = badStockRepository.findById(billId);
        if (hmsTmBadStock.isPresent()) {
            HMS_TM_BadStock bill = hmsTmBadStock.get();
            bill.setDeleted(true);
            badStockRepository.save(bill);
        } else {
            throw new RuntimeException("Bill not found with ID: " + billId);
        }
    }

    public Double getTotalBadStock() {
        Double totalStock = badStockRepository.getBadStockTotalQuantity();
        return (totalStock != null) ? totalStock : 0.0;
    }

}


