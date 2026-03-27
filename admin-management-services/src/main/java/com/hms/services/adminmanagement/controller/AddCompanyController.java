package com.hms.services.adminmanagement.controller;

import com.hms.services.adminmanagement.entity.HMS_TM_AddCompany;
import com.hms.services.adminmanagement.entity.HMS_TW_AddCompany;
import com.hms.services.adminmanagement.service.AddCompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/companies")
public class AddCompanyController {

    @Autowired
    private AddCompanyService addCompanyService;

    @PostMapping("/create")
    public ResponseEntity<List<HMS_TW_AddCompany>> createCompanies(@Valid @RequestBody List<HMS_TW_AddCompany> companies) {
        List<HMS_TW_AddCompany> createdCompanies = addCompanyService.createCompanies(companies);
        return ResponseEntity.ok(createdCompanies);
    }


    @GetMapping("/tw/{id}")
    public ResponseEntity<?> getCompanyById(@PathVariable String id) {
        HMS_TW_AddCompany company = addCompanyService.getCompanyById(id);
        if (company != null) {
            return ResponseEntity.ok(company);
        } else {
            return ResponseEntity.ok().build();
        }
    }

    @GetMapping("/tw/all")
    public ResponseEntity<List<HMS_TW_AddCompany>> getAllCompaniesTW() {
        List<HMS_TW_AddCompany> companies = addCompanyService.getAllCompaniesTW();
        return ResponseEntity.ok(companies);
    }

    @PutMapping("/tw/{id}")
    public ResponseEntity<HMS_TW_AddCompany> updateCompany(
            @PathVariable String id,
            @Valid @RequestBody HMS_TW_AddCompany company) {
        return ResponseEntity.ok(addCompanyService.updateCompany(id, company));
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<HMS_TW_AddCompany> approveCompany(
            @PathVariable String id) {
        return ResponseEntity.ok(addCompanyService.approveCompany(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCompany(
            @PathVariable String id,
            @RequestParam String authStat) {
        try {
            addCompanyService.deleteCompany(id, authStat);
            return ResponseEntity.ok("Company deleted from TM and status updated to UNAUTHORIZED in TW.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Company not found or cannot be deleted.");
        }
    }

    @GetMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_AddCompany> getCompanyByIds(@PathVariable String id) {
        return ResponseEntity.ok(addCompanyService.getCompanyByIds(id));
    }

    @PutMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_AddCompany> updateCompany(
            @PathVariable String id,
            @Valid @RequestBody HMS_TM_AddCompany company) {
        return ResponseEntity.ok(addCompanyService.updateCompany(id, company));
    }

    @GetMapping("/tm/all")
    public ResponseEntity<List<HMS_TM_AddCompany>> getAllCompaniesTM() {
        List<HMS_TM_AddCompany> companies = addCompanyService.getAllCompaniesTM();
        return ResponseEntity.ok(companies);
    }

    @DeleteMapping("/tw/remove/{id}")
    public ResponseEntity<String> deleteTwCompany(@PathVariable String id) {
        try {
            addCompanyService.deleteTwCompany(id);
            return ResponseEntity.ok("Company marked as deleted.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Company not found or cannot be deleted.");
        }
    }
}



