package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_Scope;
import com.hms.services.adminmanagement.exceptionhandler.CustomException;
import com.hms.services.adminmanagement.repository.ScopeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ScopeService {

    @Autowired
    private ScopeRepository scopeRepository;

    public List<HMS_TM_Scope> createScope(List<HMS_TM_Scope> scopeList) {
        return scopeRepository.saveAll(scopeList);
    }

    public Optional<HMS_TM_Scope> getScope(String scopeId) {
        return scopeRepository.findById(scopeId);
    }

    public List<HMS_TM_Scope> getAllScopes() {
        return scopeRepository.findAll();
    }

    public HMS_TM_Scope updateScope(String scopeId, HMS_TM_Scope updatedScope) {
        return scopeRepository.findById(scopeId)
                .map(scope -> {
                    scope.setScopeName(updatedScope.getScopeName());
                    scope.setDescription(updatedScope.getDescription());
                    return scopeRepository.save(scope);
                })
                .orElseThrow(() -> new CustomException("Scope not found", HttpStatus.BAD_REQUEST));
    }

    public void deleteScope(String scopeId) {
        scopeRepository.deleteById(scopeId);
    }
}


