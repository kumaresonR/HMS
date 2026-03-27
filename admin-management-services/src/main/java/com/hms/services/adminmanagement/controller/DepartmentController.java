package com.hms.services.adminmanagement.controller;

import com.hms.services.adminmanagement.configuration.LoginManagementInterface;
import com.hms.services.adminmanagement.entity.HMS_TM_Department;
import com.hms.services.adminmanagement.entity.HMS_TW_Department;
import com.hms.services.adminmanagement.model.DepartmentHeadDTO;
import com.hms.services.adminmanagement.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/department")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;


    @PostMapping("/create")
    public ResponseEntity<HMS_TW_Department> createDepartment(@Valid @RequestBody HMS_TW_Department department) {
        HMS_TW_Department createdDepartment = departmentService.createDepartment(department);
        return new ResponseEntity<>(createdDepartment, HttpStatus.CREATED);
    }

    @GetMapping("/tw/{id}")
    public ResponseEntity<HMS_TW_Department> getDepartmentById(@PathVariable String id) {
        try {
            HMS_TW_Department department = departmentService.getDepartmentById(id);
            return ResponseEntity.ok(department);
        } catch (RuntimeException e) {
            return ResponseEntity.ok().build();        }
    }

    @GetMapping("/tw/all")
    public ResponseEntity<List<DepartmentHeadDTO>> getAllDepartments() {
        List<DepartmentHeadDTO> departments = departmentService.getAllDepartments();
        return ResponseEntity.ok(departments);
    }

    @PutMapping("/tw/update/{id}")
    public ResponseEntity<HMS_TW_Department> updateDepartment(
            @PathVariable String id, @Valid @RequestBody HMS_TW_Department updatedDepartment) {
        HMS_TW_Department updated = departmentService.updateDepartment(id, updatedDepartment);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<HMS_TM_Department> approveDepartment(
            @PathVariable String id) {
        HMS_TM_Department approvedDepartment = departmentService.approveDepartment(id);
        return new ResponseEntity<>(approvedDepartment, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDepartment(
            @PathVariable String id,
            @RequestParam String authStat) {
        try {
            departmentService.deleteDepartment(id, authStat);
            return ResponseEntity.ok("Department deleted from TM and status updated to UNAUTHORIZED in TW.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Department not found or cannot be deleted.");
        }
    }

    @GetMapping("/tm/all")
    public ResponseEntity<List<DepartmentHeadDTO>> getAllDepartmentsTm() {
        List<DepartmentHeadDTO> departments = departmentService.getAllDepartmentsTm();
        return new ResponseEntity<>(departments, HttpStatus.OK);
    }

    @GetMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_Department> getDepartmentByIds(@PathVariable String id) {
        HMS_TM_Department department = departmentService.getDepartmentByIds(id);
        return new ResponseEntity<>(department, HttpStatus.OK);
    }

    @PutMapping("/tm/update/{id}")
    public ResponseEntity<HMS_TM_Department> updateDepartment(
            @PathVariable String id, @Valid @RequestBody HMS_TM_Department updatedDepartment) {
        HMS_TM_Department updated = departmentService.updateDepartment(id, updatedDepartment);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/tw/delete/{id}")
    public ResponseEntity<Void> deleteTwDepartment(@PathVariable String id) {
        departmentService.deleteTwDepartment(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}



