package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_Unit;
import com.hms.services.adminmanagement.entity.HMS_TW_Unit;
import com.hms.services.adminmanagement.repository.HMS_TM_UnitRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_UnitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UnitService {

    @Autowired
    private HMS_TM_UnitRepository tmUnitRepository;

    @Autowired
    private HMS_TW_UnitRepository twUnitRepository;

    public List<HMS_TW_Unit> createUnits(List<HMS_TW_Unit> units) {
        return twUnitRepository.saveAll(units);
    }

    public HMS_TW_Unit getUnitById(String id) {
        return twUnitRepository.findByIdAndDeletedFalse(id)
                .orElse(null);
    }

    public List<HMS_TW_Unit> getAllUnitsTW() {
        return twUnitRepository.findByDeletedFalse();
    }

    public HMS_TM_Unit getUnitByIds(String id) {
        return tmUnitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Unit not found with id: " + id));
    }

    public List<HMS_TM_Unit> getAllUnitsTM() {
        return tmUnitRepository.findAll();
    }

    public HMS_TM_Unit updateUnit(String id, HMS_TM_Unit updatedUnit) {
        HMS_TM_Unit existingUnit = getUnitByIds(id);
        existingUnit.setUnitName(updatedUnit.getUnitName());
        existingUnit.setModNo(updatedUnit.getModNo());
        return tmUnitRepository.save(existingUnit);
    }

    public HMS_TW_Unit approveUnit(String id ) {
        HMS_TW_Unit twUnit = getUnitById(id);

        if ("UNAUTHORIZED".equalsIgnoreCase(twUnit.getAuthStat())) {
            HMS_TM_Unit tmUnit = new HMS_TM_Unit();
            tmUnit.setUnitName(twUnit.getUnitName());
            tmUnit.setModNo(twUnit.getModNo());
            tmUnit.setId(twUnit.getId());
            tmUnit.setAuthStat("AUTHORIZED");
            tmUnitRepository.save(tmUnit);

            twUnit.setAuthStat("AUTHORIZED");
            twUnit.setRecordStat("OPENED");
            return twUnitRepository.save(twUnit);
        } else {
            throw new RuntimeException("Unit is already approved or rejected.");
        }
    }

    public void deleteUnit(String id, String authStat) {
        HMS_TM_Unit tmUnit = tmUnitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Unit not found in TM with id: " + id));

        if ("UNAUTHORIZED".equalsIgnoreCase(authStat)) {
            tmUnitRepository.delete(tmUnit);

            Optional<HMS_TW_Unit> twUnitOptional = twUnitRepository.findById(id);

            if (twUnitOptional.isPresent()) {
                HMS_TW_Unit twUnit = twUnitOptional.get();
                twUnit.setAuthStat("UNAUTHORIZED");
                twUnit.setRecordStat("CLOSED");
                twUnitRepository.save(twUnit);
            }
        } else {
            throw new RuntimeException("Invalid authorization status. Only UNAUTHORIZED is allowed.");
        }
    }

    public HMS_TW_Unit updateUnit(String id, HMS_TW_Unit updatedUnit) {
        HMS_TW_Unit existingUnit = getUnitById(id);
        existingUnit.setUnitName(updatedUnit.getUnitName());
        existingUnit.setModNo(updatedUnit.getModNo());
        return twUnitRepository.save(existingUnit);
    }

    public void deleteTwUnit(String id) {
        Optional<HMS_TW_Unit> unitOptional = twUnitRepository.findById(id);
        if (unitOptional.isPresent()) {
            HMS_TW_Unit unit = unitOptional.get();
            unit.setDeleted(true);
            twUnitRepository.save(unit);
        } else {
            throw new RuntimeException("Unit not found with id: " + id);
        }
    }
}




