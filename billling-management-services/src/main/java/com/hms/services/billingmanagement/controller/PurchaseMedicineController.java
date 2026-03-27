package com.hms.services.billingmanagement.controller;

import com.hms.services.billingmanagement.model.*;
import com.hms.services.billingmanagement.service.PurchaseMedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/purchase-medicine")
public class PurchaseMedicineController {

    @Autowired
    private PurchaseMedicineService purchaseMedicineService;

    @PostMapping("/create")
    public ResponseEntity<PurchaseBillDTO> createPurchaseBill(
//            @RequestHeader("Authorization") String authorizationHeader,
            @RequestPart("purchaseBillData") String purchaseBillDataJson,
            @RequestPart(value = "attachment", required = false) MultipartFile attachment,
            @RequestPart(value = "chequeAttachment", required = false) MultipartFile chequeAttachment) {

        try {
            PurchaseBillDTO savedBill = purchaseMedicineService.generateBill(purchaseBillDataJson, attachment, chequeAttachment);
            return ResponseEntity.ok(savedBill);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping
    public ResponseEntity<List<PurchaseBillDTO>> getAllPurchaseBills(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        List<PurchaseBillDTO> billDTOs = purchaseMedicineService.getAllPurchaseBills(page, size);
        return ResponseEntity.ok(billDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PurchaseBillDTO> getPurchaseBillById(@PathVariable("id") String purchaseBillId) {
        PurchaseBillDTO billDTO = purchaseMedicineService.getPurchaseBillById(purchaseBillId);
        if (billDTO != null) {
            return ResponseEntity.ok(billDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{purchaseBillId}/status")
    public ResponseEntity<String> updatePurchaseBillStatus(
//            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable String purchaseBillId,
            @RequestParam String status) {
        try {
            purchaseMedicineService.updatePurchaseBillStatus(purchaseBillId, status);
            return ResponseEntity.ok("Purchase Bill status updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating purchase bill status. Please try again.");
        }
    }

    @PutMapping("/update/{billId}")
    public ResponseEntity<PurchaseBillDTO> updatePurchaseBill(
//            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable("billId") String billId,
            @RequestPart("purchaseBillData") String purchaseBillDataJson,
            @RequestPart(value = "attachment", required = false) MultipartFile attachment,
            @RequestPart(value = "chequeAttachment", required = false) MultipartFile chequeAttachment) {

        try {
            PurchaseBillDTO updatedBill = purchaseMedicineService.updatePurchaseBill(billId, purchaseBillDataJson, attachment, chequeAttachment);
            return ResponseEntity.ok(updatedBill);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/remove/{id}")
    public ResponseEntity<String> deletePurchaseBill(@PathVariable String id) {
        try {
            purchaseMedicineService.deletePurchaseBill(id);
            return new ResponseEntity<>("Purchase Bill marked as deleted.", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("Purchase Bill not found or cannot be deleted.", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/medicine_purchaseAmount")
    public IncomeChanges totalAmountToPurchase() {
        return purchaseMedicineService.getTotalPurchaseAmount();
    }

    @GetMapping("/expiry-medicines")
    public ResponseEntity<List<ExpiryMedicineReportResponse>> searchExpiryMedicines(
            @RequestParam(required = false) String medicineCategory,
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {

        ExpiryMedicineReportRequest request = new ExpiryMedicineReportRequest();
        request.setMedicineCategory(medicineCategory);
        request.setTimeDuration(timeDuration);
        request.setStartDate(startDate);
        request.setEndDate(endDate);

        List<ExpiryMedicineReportResponse> response = purchaseMedicineService.searchExpiryMedicines(
                medicineCategory, timeDuration, startDate, endDate
        );

        return ResponseEntity.ok(response);
    }

}



