package com.hms.services.bloodbankmanagement.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.services.bloodbankmanagement.entity.HMS_TM_BagStock;
import com.hms.services.bloodbankmanagement.entity.HMS_TM_DonorDetails;
import com.hms.services.bloodbankmanagement.model.BagStockDTO;
import com.hms.services.bloodbankmanagement.model.DonorWithBagStockDTO;
import com.hms.services.bloodbankmanagement.repository.BagStockRepository;
import com.hms.services.bloodbankmanagement.repository.DonorDetailsRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Service
public class BagStockService {

    @Autowired
    private BagStockRepository bagStockRepository;
    @Autowired
    private DonorDetailsRepository donorDetailsRepository;

    public HMS_TM_BagStock createBagStock(String bagStockDataJson, MultipartFile attachmentFile) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        HMS_TM_BagStock bagStock = objectMapper.readValue(bagStockDataJson, HMS_TM_BagStock.class);

        if (attachmentFile != null) {
            byte[] fileBytes = attachmentFile.getBytes();
            String encodedFile = Base64.getEncoder().encodeToString(fileBytes);
            bagStock.setAttachDocument(encodedFile);
        }

        return bagStockRepository.save(bagStock);
    }

    @Transactional
    public BagStockDTO getBagStockById(String id) {
        HMS_TM_BagStock bagStock = bagStockRepository.findByBagStockIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Bag Stock not found."));

        HMS_TM_DonorDetails donorDetails = donorDetailsRepository.findByDonorIdAndDeletedFalse(bagStock.getDonorId())
                .orElseThrow(() -> new RuntimeException("Donor not found."));
        return new BagStockDTO(bagStock, donorDetails);
    }

    @Transactional
    public List<BagStockDTO> getAllBagStocks() {
        List<HMS_TM_BagStock> bagStocks = bagStockRepository.findByDeletedFalse();
        List<BagStockDTO> result = new ArrayList<>();

        for (HMS_TM_BagStock bagStock : bagStocks) {
            HMS_TM_DonorDetails donorDetails = donorDetailsRepository.findByDonorIdAndDeletedFalse(bagStock.getDonorId())
                    .orElseThrow(() -> new RuntimeException("Donor not found."));
            result.add(new BagStockDTO(bagStock, donorDetails));
        }

        return result;
    }

    public HMS_TM_BagStock updateBagStock(String id, String bagStockDataJson, MultipartFile attachmentFile) throws IOException {
        if (!bagStockRepository.existsById(id)) {
            throw new RuntimeException("Bag Stock with ID " + id + " not found.");
        }

        HMS_TM_BagStock existingBagStock = bagStockRepository.findById(id).orElseThrow(() -> new RuntimeException("Bag Stock not found."));

        ObjectMapper objectMapper = new ObjectMapper();
        HMS_TM_BagStock updatedBagStock = objectMapper.readValue(bagStockDataJson, HMS_TM_BagStock.class);
        updatedBagStock.setBagStockId(id);

        Double previousPaymentAmount = existingBagStock.getPaymentAmount() != null ? existingBagStock.getPaymentAmount() : 0.0;
        Double balanceAmount = existingBagStock.getTotal() != null ? existingBagStock.getTotal() - previousPaymentAmount : 0.0;

        Double newPaymentAmount = updatedBagStock.getPaymentAmount();
        if (newPaymentAmount != null && newPaymentAmount > 0) {
            updatedBagStock.setPaymentAmount(previousPaymentAmount + newPaymentAmount);
            balanceAmount -= newPaymentAmount;
        } else {
            updatedBagStock.setPaymentAmount(previousPaymentAmount);
        }

        updatedBagStock.setBalanceAmount(balanceAmount > 0 ? balanceAmount : 0.0);

        if (attachmentFile != null) {
            byte[] fileBytes = attachmentFile.getBytes();
            String encodedFile = Base64.getEncoder().encodeToString(fileBytes);
            updatedBagStock.setAttachDocument(encodedFile);
        } else {
            updatedBagStock.setAttachDocument(existingBagStock.getAttachDocument());
        }

        return bagStockRepository.save(updatedBagStock);
    }

    public HMS_TM_BagStock softDeleteBagStock(String id) {
        HMS_TM_BagStock bagStock = bagStockRepository.findById(id).orElseThrow(() -> new RuntimeException("Bag Stock not found."));
        bagStock.setDeleted(true);
        return bagStockRepository.save(bagStock);
    }

    public DonorWithBagStockDTO getDonorWithBagStocks(String donorId) {
        HMS_TM_DonorDetails donorDetails = donorDetailsRepository.findById(donorId)
                .orElseThrow(() -> new RuntimeException("Donor not found"));

        List<HMS_TM_BagStock> bagStocks = bagStockRepository.findByDonorId(donorId);

        DonorWithBagStockDTO dto = new DonorWithBagStockDTO();
        dto.setDonorDetails(donorDetails);
        dto.setBagStocks(bagStocks);

        return dto;
    }
}


