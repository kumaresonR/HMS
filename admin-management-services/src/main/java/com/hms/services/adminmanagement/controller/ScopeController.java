package com.hms.services.adminmanagement.controller;

import com.hms.services.adminmanagement.entity.HMS_TM_Scope;
import com.hms.services.adminmanagement.exceptionhandler.CustomException;
import com.hms.services.adminmanagement.service.ScopeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/scopes")
public class ScopeController {

    @Autowired
    private ScopeService scopeService;

    @PostMapping("/create")
    public ResponseEntity<List<HMS_TM_Scope>> createScope(@RequestBody List<HMS_TM_Scope> scope) {
        List<HMS_TM_Scope> createdScope = scopeService.createScope(scope);
        return ResponseEntity.ok(createdScope);
    }

    @GetMapping("/{scopeId}")
    public ResponseEntity<HMS_TM_Scope> getScope(@PathVariable String scopeId) {
        return scopeService.getScope(scopeId)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new CustomException("Scope not found", HttpStatus.BAD_REQUEST));
    }

    @GetMapping
    public List<HMS_TM_Scope> getAllScopes() {
        return scopeService.getAllScopes();
    }

    @PutMapping("/update/{scopeId}")
    public ResponseEntity<HMS_TM_Scope> updateScope(@PathVariable String scopeId, @RequestBody HMS_TM_Scope updatedScope) {
        HMS_TM_Scope scope = scopeService.updateScope(scopeId, updatedScope);
        return ResponseEntity.ok(scope);
    }

    @DeleteMapping("/{scopeId}")
    public ResponseEntity<Void> deleteScope(@PathVariable String scopeId) {
        scopeService.deleteScope(scopeId);
        return ResponseEntity.noContent().build();
    }
}


