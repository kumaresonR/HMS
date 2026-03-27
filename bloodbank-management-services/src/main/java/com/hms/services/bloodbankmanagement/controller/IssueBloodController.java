package com.hms.services.bloodbankmanagement.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.hms.services.bloodbankmanagement.entity.HMS_TM_IssueBlood;
import com.hms.services.bloodbankmanagement.exceptionhandler.CustomException;
import com.hms.services.bloodbankmanagement.model.IssueBloodDTO;
import com.hms.services.bloodbankmanagement.model.BillSummary;
import com.hms.services.bloodbankmanagement.model.IncomeChanges;
import com.hms.services.bloodbankmanagement.repository.IssueComponentRepository;
import com.hms.services.bloodbankmanagement.service.IssueBloodService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/issue-blood")
public class IssueBloodController {

    @Autowired
    private IssueBloodService issueBloodService;

    @PostMapping("/generate")
    public ResponseEntity<HMS_TM_IssueBlood> generateIssueBlood(
            @RequestPart("bloodData") String bloodDataJson,
            @RequestPart(value = "attachment", required = false) MultipartFile attachmentFile) {

        try {
            HMS_TM_IssueBlood generatedIssueBlood = issueBloodService.generateIssueBlood(bloodDataJson, attachmentFile);
            return ResponseEntity.status(HttpStatus.CREATED).body(generatedIssueBlood);
        } catch (CustomException | JsonProcessingException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<IssueBloodDTO>> getAllIssueBloodDetails() {
        List<IssueBloodDTO> issueBloodDTOList = issueBloodService.getAllIssueBloodDetails();
        return ResponseEntity.ok(issueBloodDTOList);
    }

    @GetMapping("/search")
    public ResponseEntity<List<IssueBloodDTO>> getFilteredIssueBloodDetails(
            @RequestParam(required = false) String patientId,
            @RequestParam(required = false) String ipdOrOpdId) {

        List<IssueBloodDTO> issueBloodDTOList = issueBloodService.getFilteredIssueBloodDetails(patientId, ipdOrOpdId);
        return ResponseEntity.ok(issueBloodDTOList);
    }

    @GetMapping("/{issueBloodId}")
    public ResponseEntity<IssueBloodDTO> getIssueBloodDetails(@PathVariable String issueBloodId) {
        IssueBloodDTO issueBloodDTO = issueBloodService.getIssueBloodDetails(issueBloodId);
        return ResponseEntity.ok(issueBloodDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HMS_TM_IssueBlood> updateIssueBlood(
            @PathVariable String id,
            @RequestPart("bloodData") String bloodDataJson,
            @RequestPart(value = "attachment", required = false) MultipartFile attachmentFile) {

        try {
            HMS_TM_IssueBlood updatedIssueBlood = issueBloodService.updateIssueBlood(id, bloodDataJson, attachmentFile);
            return updatedIssueBlood != null
                    ? ResponseEntity.ok(updatedIssueBlood)
                    : ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteIssueBlood(@PathVariable String id) {
        try {
            HMS_TM_IssueBlood deletedIssueBlood = issueBloodService.softDeleteIssueBlood(id);
            return deletedIssueBlood != null
                    ? ResponseEntity.ok("Issue Blood marked as deleted successfully.")
                    : ResponseEntity.status(HttpStatus.NOT_FOUND).body("Issue Blood not found.");
        } catch (Exception e) {
            return new ResponseEntity<>("Error processing request. Please try again.", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/blood-bank-income")
    public IncomeChanges getIssueBloodIncome() {
        return issueBloodService.getIssueBloodIncome();
    }

    @GetMapping("/ipdOrOpdId/{ipdOrOpdId}")
    public ResponseEntity<List<HMS_TM_IssueBlood>> getIssueBloodByIpdOrOpdId(@PathVariable String ipdOrOpdId) {
        List<HMS_TM_IssueBlood> issueBloodRecords = issueBloodService.getIssueBloodByIpdOrOpdId(ipdOrOpdId);
        if (!issueBloodRecords.isEmpty()) {
            return ResponseEntity.ok(issueBloodRecords);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/blood-bank-monthly-income")
    public Double getIssueBloodMonthlyIncome() {
        return issueBloodService.getIssueBloodMonthlyIncome();
    }

    @GetMapping("/OpdOrIpd/blood_issue-payment/{id}")
    public BillSummary getBloodIssueOpdAndIpdPayment(@PathVariable String id) {
        return issueBloodService.getIssueBloodOpdAndIpdPayment(id);
    }

    @GetMapping("/medical-history/{patientId}")
    public Integer getMedicalHistoryBloodBank(@PathVariable String patientId){
        return issueBloodService.getMedicalHistoryBloodBank(patientId);
    }

    @GetMapping("/increase-monthly-income")
    public IncomeChanges getBloodBankIncreaseMonthlyIncome() {
        return issueBloodService.getBloodBankIncreaseMonthlyIncome();
    }

    @GetMapping("/increase-yearly-income")
    public IncomeChanges getBloodBankIncreaseYearlyIncome() {
        return issueBloodService.getBloodBankIncreaseYearlyIncome();
    }
    @GetMapping("/increase-weekly-income")
    public IncomeChanges getBloodBankIncreaseWeeklyIncome() {
        return issueBloodService.getBloodBankIncreaseWeeklyIncome();
    }

    @GetMapping("/income-list/today")
    public ResponseEntity<List<HMS_TM_IssueBlood>> getAllIssueBloodIncomeForToday() {
        List<HMS_TM_IssueBlood> incomeList = issueBloodService.fetchAllIssueBloodIncomeForToday();
        return ResponseEntity.ok(incomeList);
    }

    @GetMapping("/income-list/month")
    public ResponseEntity<List<HMS_TM_IssueBlood>> getAllIssueBloodIncomeForMonth() {
        List<HMS_TM_IssueBlood> incomeList = issueBloodService.fetchAllIssueBloodIncomeForMonth();
        return ResponseEntity.ok(incomeList);
    }

    @GetMapping("/income-list/year")
    public ResponseEntity<List<HMS_TM_IssueBlood>> getAllIssueBloodIncomeForYear() {
        List<HMS_TM_IssueBlood> incomeList = issueBloodService.fetchAllIssueBloodIncomeForYear();
        return ResponseEntity.ok(incomeList);
    }

    @GetMapping("/income-list/week")
    public ResponseEntity<List<HMS_TM_IssueBlood>> getAllIssueBloodIncomeForWeek() {
        List<HMS_TM_IssueBlood> incomeList = issueBloodService.fetchAllIssueBloodIncomeForWeek();
        return ResponseEntity.ok(incomeList);
    }


}


