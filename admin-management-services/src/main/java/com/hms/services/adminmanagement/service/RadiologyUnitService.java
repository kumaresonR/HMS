package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_RadiologyUnit;
import com.hms.services.adminmanagement.entity.HMS_TW_RadiologyUnit;
import com.hms.services.adminmanagement.repository.HMS_TM_RadiologyUnitListRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_RadiologyUnitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RadiologyUnitService {

    @Autowired
    private HMS_TM_RadiologyUnitListRepository tmUnitListRepository;

    @Autowired
    private HMS_TW_RadiologyUnitRepository twUnitRepository;

    public HMS_TW_RadiologyUnit createRadiologyUnit(HMS_TW_RadiologyUnit unit) {
        return twUnitRepository.save(unit);
    }

    public HMS_TW_RadiologyUnit getRadiologyUnitById(String id) {
        return twUnitRepository.findByIdAndDeletedFalse(id)
                .orElse(null);    }

    public List<HMS_TW_RadiologyUnit> getAllRadiologyUnitsTW() {
        return twUnitRepository.findByDeletedFalse();
    }

    public HMS_TW_RadiologyUnit updateRadiologyUnit(String id, HMS_TW_RadiologyUnit updatedUnit) {
        HMS_TW_RadiologyUnit existingUnit = getRadiologyUnitById(id);
        existingUnit.setUnitName(updatedUnit.getUnitName());
        existingUnit.setModNo(updatedUnit.getModNo());
        return twUnitRepository.save(existingUnit);
    }

    public HMS_TM_RadiologyUnit approveRadiologyUnit(String id) {

        HMS_TW_RadiologyUnit unit = getRadiologyUnitById(id);

        if ("UNAUTHORIZED".equalsIgnoreCase(unit.getAuthStat())) {
            HMS_TM_RadiologyUnit tmUnit = new HMS_TM_RadiologyUnit();
            tmUnit.setUnitName(unit.getUnitName());
            tmUnit.setId(unit.getId());
            tmUnit.setModNo(unit.getModNo());

            tmUnit.setAuthStat("AUTHORIZED");
            tmUnitListRepository.save(tmUnit);

            unit.setAuthStat("AUTHORIZED");
            unit.setRecordStat("OPENED");
            twUnitRepository.save(unit);
            return tmUnit;
        } else {
            throw new RuntimeException("Unit is already approved or rejected");
        }
    }

    public void deleteRadiologyUnit(String id, String authStat) {
        HMS_TM_RadiologyUnit tmUnit = tmUnitListRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Radiology unit not found in TM with id: " + id));

        if ("UNAUTHORIZED".equalsIgnoreCase(authStat)) {
            tmUnitListRepository.delete(tmUnit);

            Optional<HMS_TW_RadiologyUnit> twUnitOptional = twUnitRepository.findById(id);

            if (twUnitOptional.isPresent()) {
                HMS_TW_RadiologyUnit twUnit = twUnitOptional.get();
                twUnit.setAuthStat("UNAUTHORIZED");
                twUnit.setRecordStat("CLOSED");
                twUnitRepository.save(twUnit);
            }
        } else {
            throw new RuntimeException("Invalid authorization status. Only UNAUTHORIZED status is allowed for deletion.");
        }
    }

    public HMS_TM_RadiologyUnit getRadiologyUnitByIds(String id) {
        return tmUnitListRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Radiology unit not found with ID: " + id));
    }

    public List<HMS_TM_RadiologyUnit> getAllRadiologyUnitsTM() {
        return tmUnitListRepository.findAll();
    }

    public HMS_TM_RadiologyUnit updateRadiologyUnit(String id, HMS_TM_RadiologyUnit updatedUnit) {
        HMS_TM_RadiologyUnit existingUnit = getRadiologyUnitByIds(id);
        existingUnit.setUnitName(updatedUnit.getUnitName());
        return tmUnitListRepository.save(existingUnit);
    }

    public void deleteTwUnit(String id) {
        HMS_TW_RadiologyUnit unit = twUnitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Radiology unit not found with ID: " + id));
        unit.setDeleted(true);
        twUnitRepository.save(unit);
    }
}



