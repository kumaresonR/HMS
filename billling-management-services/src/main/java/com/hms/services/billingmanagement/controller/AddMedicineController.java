package com.hms.services.billingmanagement.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.services.billingmanagement.entity.HMS_TM_AddMedicine;
import com.hms.services.billingmanagement.model.HMS_TM_AddMedicineDTO;
import com.hms.services.billingmanagement.model.StockResponse;
import com.hms.services.billingmanagement.service.AddMedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/add-medicine")
public class AddMedicineController {

    @Autowired
    private AddMedicineService addMedicineService;

    @Autowired
    private ObjectMapper objectMapper;

//    @PostMapping("/create")
//    public ResponseEntity<?> createMedicine(
//            @RequestPart("medicineData") String medicineDataJson,
//            @RequestPart(value = "photo", required = false) MultipartFile photoFile) {
//
//        try {
//            HMS_TM_AddMedicine medicine = objectMapper.readValue(medicineDataJson, HMS_TM_AddMedicine.class);
//            HMS_TM_AddMedicine savedMedicine = addMedicineService.saveMedicineWithFile(medicine, photoFile);
//            return new ResponseEntity<>(savedMedicine, HttpStatus.CREATED);
//
//        } catch (CustomException | JsonProcessingException e) {
//            return new ResponseEntity<>("Error processing request: " + e.getMessage(), HttpStatus.BAD_REQUEST);
//        } catch (IOException e) {
//            throw new RuntimeException(e);
//        }
//    }


    @GetMapping("/all")
    public ResponseEntity<List<HMS_TM_AddMedicineDTO>> getAllMedicines() {
        List<HMS_TM_AddMedicineDTO> medicines = addMedicineService.getAllMedicines();
        return new ResponseEntity<>(medicines, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HMS_TM_AddMedicineDTO> getMedicineById(@PathVariable String id) {
        Optional<HMS_TM_AddMedicineDTO> medicine = addMedicineService.getMedicineById(id);
        return medicine.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/low-boxPacking")
    public ResponseEntity<List<HMS_TM_AddMedicineDTO>> getMedicinesWithLowBoxPacking() {
        List<HMS_TM_AddMedicineDTO> medicines = addMedicineService.getMedicinesWithBoxPackingUnderOrEqualToTen();
        return new ResponseEntity<>(medicines, HttpStatus.OK);
    }


//    @PutMapping("/{id}")
//    public ResponseEntity<HMS_TM_AddMedicine> updateMedicine(
//            @PathVariable String id,
//            @RequestPart("medicineData") String medicineDataJson,
//            @RequestPart(value = "photo", required = false) MultipartFile photoFile) {
//
//        try {
//            HMS_TM_AddMedicine medicine = objectMapper.readValue(medicineDataJson, HMS_TM_AddMedicine.class);
//            medicine.setAddMedicineId(id);
//            HMS_TM_AddMedicine updatedMedicine = addMedicineService.updateMedicine(id, medicine, photoFile);
//            return updatedMedicine != null ? ResponseEntity.ok(updatedMedicine) : ResponseEntity.notFound().build();
//
//        } catch (IOException e) {
//            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
//        }
//    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteMedicine(@PathVariable String id) {
        try {
            HMS_TM_AddMedicine deletedMedicine = addMedicineService.softDeleteMedicine(id);
            return deletedMedicine != null
                    ? ResponseEntity.ok("Medicine marked as deleted successfully.")
                    : ResponseEntity.status(HttpStatus.NOT_FOUND).body("Medicine not found.");
        } catch (Exception e) {
            return new ResponseEntity<>("Error processing request. Please try again.", HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/deleteMultiple")
    public ResponseEntity<?> deleteMultipleMedicines(@Valid @RequestBody List<String> ids) {
        try {
            List<HMS_TM_AddMedicine> deletedMedicines = addMedicineService.softDeleteMultipleMedicines(ids);

            if (deletedMedicines.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No medicines found for the provided IDs.");
            }
            return ResponseEntity.ok(deletedMedicines.size() + " medicines marked as deleted successfully.");
        } catch (Exception e) {
            return new ResponseEntity<>("Error processing request. Please try again.", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/medicine_totalStock")
    public Double totalMedicineStock() {
        return addMedicineService.getTotalMedicineStock();
    }


    @GetMapping("/stock-report")
    public ResponseEntity<List<StockResponse>> getStockReport(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(name = "name", required = false) String name) {

        List<StockResponse> response = addMedicineService.getStockReport(
                timeDuration,
                startDate,
                endDate,
                name
        );
        return ResponseEntity.ok(response);
    }
}






