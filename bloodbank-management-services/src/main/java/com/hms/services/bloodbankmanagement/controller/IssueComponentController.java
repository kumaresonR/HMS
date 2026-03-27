package com.hms.services.bloodbankmanagement.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.hms.services.bloodbankmanagement.entity.HMS_TM_IssueComponent;
import com.hms.services.bloodbankmanagement.exceptionhandler.CustomException;
import com.hms.services.bloodbankmanagement.model.IssueComponentDTO;
import com.hms.services.bloodbankmanagement.model.BillSummary;
import com.hms.services.bloodbankmanagement.service.IssueComponentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/issue-component")
public class IssueComponentController {

    @Autowired
    private IssueComponentService issueComponentService;


    @PostMapping("/generate")
    public ResponseEntity<HMS_TM_IssueComponent> generateIssueComponent(
            @RequestPart("componentData") String componentDataJson,
            @RequestPart(value = "photo", required = false) MultipartFile photoFile) {

        try {
            HMS_TM_IssueComponent generatedComponent = issueComponentService.generateIssueComponent(componentDataJson, photoFile);
            return ResponseEntity.status(HttpStatus.CREATED).body(generatedComponent);
        } catch (CustomException | JsonProcessingException e) {
            return new ResponseEntity<>( HttpStatus.BAD_REQUEST);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<IssueComponentDTO>> getAllIssueComponents() {
        List<IssueComponentDTO> issueComponentDTOList = issueComponentService.getAllIssueComponents();
        return ResponseEntity.ok(issueComponentDTOList);
    }

    @GetMapping("/search")
    public ResponseEntity<List<IssueComponentDTO>> getAllIssueComponents(
            @RequestParam(required = false) String patientId,
            @RequestParam(required = false) String ipdOrOpdId) {

        List<IssueComponentDTO> issueComponentDTOList = issueComponentService.getFilteredIssueComponents(patientId, ipdOrOpdId);
        return ResponseEntity.ok(issueComponentDTOList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<IssueComponentDTO> getIssueComponentById(@PathVariable String id) {
        IssueComponentDTO issueComponentDTO = issueComponentService.getIssueComponentById(id)
                .orElseThrow(() -> new RuntimeException("Issue component record not found with ID: " + id));
        return ResponseEntity.ok(issueComponentDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HMS_TM_IssueComponent> updateIssueComponent(
            @PathVariable String id,
            @RequestPart("componentData") String componentDataJson,
            @RequestPart(value = "photo", required = false) MultipartFile photoFile) {

        try {
            HMS_TM_IssueComponent updatedIssueComponent = issueComponentService.updateIssueComponent(id, componentDataJson, photoFile);
            return updatedIssueComponent != null
                    ? ResponseEntity.ok(updatedIssueComponent)
                    : ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteIssueComponent(@PathVariable String id) {
        try {
            HMS_TM_IssueComponent deletedIssueComponent = issueComponentService.softDeleteIssueComponent(id);
            return deletedIssueComponent != null
                    ? ResponseEntity.ok("Issue Component marked as deleted successfully.")
                    : ResponseEntity.status(HttpStatus.NOT_FOUND).body("Issue Component not found.");
        } catch (Exception e) {
            return new ResponseEntity<>("Error processing request. Please try again.", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/ipdOrOpdId/{ipdOrOpdId}")
    public ResponseEntity<List<HMS_TM_IssueComponent>> getIssueComponentByIpdOrOpdId(@PathVariable String ipdOrOpdId) {
        List<HMS_TM_IssueComponent> issueComponentRecords = issueComponentService.getIssueComponentByIpdOrOpdId(ipdOrOpdId);
        if (!issueComponentRecords.isEmpty()) {
            return ResponseEntity.ok(issueComponentRecords);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

//    @GetMapping("/OpdOrIpd/component_issue-payment/{id}")
//    public BillSummary getComponentIssueOpdAndIpdPayment(@PathVariable String id) {
//        return issueComponentService.getIssueComponentOpdAndIpdPayment(id);
//    }


    @GetMapping("/income-list/today")
    public ResponseEntity<List<HMS_TM_IssueComponent>> getAllIssueComponentIncomeForToday() {
        List<HMS_TM_IssueComponent> incomeList = issueComponentService.fetchAllIssueComponentIncomeForToday();
        return ResponseEntity.ok(incomeList);
    }


    @GetMapping("/income-list/month")
    public ResponseEntity<List<HMS_TM_IssueComponent>> getAllIssueComponentIncomeForMonth() {
        List<HMS_TM_IssueComponent> incomeList = issueComponentService.fetchAllIssueComponentIncomeForMonth();
        return ResponseEntity.ok(incomeList);
    }

    @GetMapping("/income-list/year")
    public ResponseEntity<List<HMS_TM_IssueComponent>> getAllIssueComponentIncomeForYear() {
        List<HMS_TM_IssueComponent> incomeList = issueComponentService.fetchAllIssueComponentIncomeForYear();
        return ResponseEntity.ok(incomeList);
    }

    @GetMapping("/income-list/week")
    public ResponseEntity<List<HMS_TM_IssueComponent>> getAllIssueComponentIncomeForWeek() {
        List<HMS_TM_IssueComponent> incomeList = issueComponentService.fetchAllIssueComponentIncomeForWeek();
        return ResponseEntity.ok(incomeList);
    }

}



