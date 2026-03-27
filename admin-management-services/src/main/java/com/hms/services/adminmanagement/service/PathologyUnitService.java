package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_PathologyUnit;
import com.hms.services.adminmanagement.entity.HMS_TW_PathologyUnit;
import com.hms.services.adminmanagement.repository.HMS_TM_PathologyUnitListRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_PathologyUnitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class PathologyUnitService {

    @Autowired
    private HMS_TM_PathologyUnitListRepository tmUnitListRepository;

    @Autowired
    private HMS_TW_PathologyUnitRepository twUnitRepository;

    public HMS_TW_PathologyUnit createPathologyUnit(HMS_TW_PathologyUnit unit) {
        return twUnitRepository.save(unit);
    }

    public HMS_TW_PathologyUnit getPathologyUnitById(String id) {
        return twUnitRepository.findByIdAndDeletedFalse(id)
                .orElse(null);
    }

    public List<HMS_TW_PathologyUnit> getAllPathologyUnitsTW() {
        return twUnitRepository.findByDeletedFalse();
    }

    public HMS_TW_PathologyUnit updatePathologyUnit(String id, HMS_TW_PathologyUnit updatedUnit) {
        HMS_TW_PathologyUnit existingUnit = getPathologyUnitById(id);
        existingUnit.setUnitName(updatedUnit.getUnitName());
        existingUnit.setModNo(updatedUnit.getModNo());
        return twUnitRepository.save(existingUnit);
    }

    public HMS_TM_PathologyUnit approvePathologyUnit(String id) {;

        HMS_TW_PathologyUnit unit = getPathologyUnitById(id);

        if ("UNAUTHORIZED".equalsIgnoreCase(unit.getAuthStat())) {
            HMS_TM_PathologyUnit tmUnit = new HMS_TM_PathologyUnit();
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

    public void deletePathologyUnit(String id, String authStat) {
        HMS_TM_PathologyUnit tmUnit = tmUnitListRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pathology Unit not found in TM with id: " + id));

        if ("UNAUTHORIZED".equalsIgnoreCase(authStat)) {
            tmUnitListRepository.delete(tmUnit);

            Optional<HMS_TW_PathologyUnit> twUnitOptional = twUnitRepository.findById(id);

            if (twUnitOptional.isPresent()) {
                HMS_TW_PathologyUnit twUnit = twUnitOptional.get();
                twUnit.setAuthStat("UNAUTHORIZED");
                twUnit.setRecordStat("CLOSED");
                twUnitRepository.save(twUnit);
            }
        } else {
            throw new RuntimeException("Invalid authorization status. Only UNAUTHORIZED is allowed for deletion.");
        }
    }

    public HMS_TM_PathologyUnit getPathologyUnitByIds(String id) {
        return tmUnitListRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pathology unit not found with ID: " + id));
    }

    public List<HMS_TM_PathologyUnit> getAllPathologyUnitsTM() {
        return tmUnitListRepository.findAll();
    }

    public HMS_TM_PathologyUnit updatePathologyUnit(String id, HMS_TM_PathologyUnit updatedUnit) {
        HMS_TM_PathologyUnit existingUnit = getPathologyUnitByIds(id);
        existingUnit.setUnitName(updatedUnit.getUnitName());
        return tmUnitListRepository.save(existingUnit);
    }

    public void deleteTwUnit(String id) {
        HMS_TW_PathologyUnit unit = twUnitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pathology unit not found with ID: " + id));
        unit.setDeleted(true);
        twUnitRepository.save(unit);
    }
}




