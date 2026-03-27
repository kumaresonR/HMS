package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_AddMedicineGroup;
import com.hms.services.adminmanagement.entity.HMS_TW_AddMedicineGroup;
import com.hms.services.adminmanagement.repository.HMS_TM_AddMedicineGroupRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_AddMedicineGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AddMedicineGroupService {

    @Autowired
    private HMS_TM_AddMedicineGroupRepository tmAddMedicineGroupRepository;

    @Autowired
    private HMS_TW_AddMedicineGroupRepository twAddMedicineGroupRepository;

    public List<HMS_TW_AddMedicineGroup> createMedicineGroups(List<HMS_TW_AddMedicineGroup> medicineGroups) {
        return twAddMedicineGroupRepository.saveAll(medicineGroups);
    }

    public HMS_TW_AddMedicineGroup getMedicineGroupById(String id) {
        return twAddMedicineGroupRepository.findByIdAndDeletedFalse(id)
                .orElse(null);
    }

    public List<HMS_TW_AddMedicineGroup> getAllMedicineGroupsTW() {
        return twAddMedicineGroupRepository.findByDeletedFalse();
    }

    public HMS_TW_AddMedicineGroup updateMedicineGroup(String id, HMS_TW_AddMedicineGroup updatedMedicineGroup) {
        HMS_TW_AddMedicineGroup existingMedicineGroup = getMedicineGroupById(id);
        existingMedicineGroup.setMedicineGroupName(updatedMedicineGroup.getMedicineGroupName());
        existingMedicineGroup.setModNo(updatedMedicineGroup.getModNo());
        return twAddMedicineGroupRepository.save(existingMedicineGroup);
    }

    public HMS_TW_AddMedicineGroup approveMedicineGroup(String id) {

        HMS_TW_AddMedicineGroup twAddMedicineGroup = getMedicineGroupById(id);

        if ("UNAUTHORIZED".equalsIgnoreCase(twAddMedicineGroup.getAuthStat())) {
            HMS_TM_AddMedicineGroup tmAddMedicineGroup = new HMS_TM_AddMedicineGroup();
            tmAddMedicineGroup.setMedicineGroupName(twAddMedicineGroup.getMedicineGroupName());
            tmAddMedicineGroup.setId(twAddMedicineGroup.getId());
            tmAddMedicineGroup.setModNo(twAddMedicineGroup.getModNo());
            tmAddMedicineGroup.setAuthStat("AUTHORIZED");
            tmAddMedicineGroupRepository.save(tmAddMedicineGroup);
            twAddMedicineGroup.setAuthStat("AUTHORIZED");
            twAddMedicineGroup.setRecordStat("OPENED");
            return twAddMedicineGroupRepository.save(twAddMedicineGroup);
        } else {
            throw new RuntimeException("Medicine group is already approved or rejected.");
        }
    }

    public void deleteMedicineGroup(String id, String authStat) {
        HMS_TM_AddMedicineGroup tmAddMedicineGroup = tmAddMedicineGroupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine Group not found in TM with id: " + id));

        if ("UNAUTHORIZED".equalsIgnoreCase(authStat)) {
            tmAddMedicineGroupRepository.delete(tmAddMedicineGroup);

            Optional<HMS_TW_AddMedicineGroup> twAddMedicineGroupOptional = twAddMedicineGroupRepository.findById(id);

            if (twAddMedicineGroupOptional.isPresent()) {
                HMS_TW_AddMedicineGroup twAddMedicineGroup = twAddMedicineGroupOptional.get();
                twAddMedicineGroup.setAuthStat("UNAUTHORIZED");
                twAddMedicineGroup.setRecordStat("CLOSED");
                twAddMedicineGroupRepository.save(twAddMedicineGroup);
            }
        } else {
            throw new RuntimeException("Invalid authorization status. Only UNAUTHORIZED is allowed.");
        }
    }

    public HMS_TM_AddMedicineGroup getMedicineGroupByIds(String id) {
        return tmAddMedicineGroupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine group not found with id: " + id));
    }

    public List<HMS_TM_AddMedicineGroup> getAllMedicineGroupsTM() {
        return tmAddMedicineGroupRepository.findAll();
    }

    public HMS_TM_AddMedicineGroup updateMedicineGroup(String id, HMS_TM_AddMedicineGroup updatedMedicineGroup) {
        HMS_TM_AddMedicineGroup existingMedicineGroup = getMedicineGroupByIds(id);
        existingMedicineGroup.setMedicineGroupName(updatedMedicineGroup.getMedicineGroupName());
        return tmAddMedicineGroupRepository.save(existingMedicineGroup);
    }

    public void deleteTwMedicineGroup(String id) {
        Optional<HMS_TW_AddMedicineGroup> medicineGroupOptional = twAddMedicineGroupRepository.findById(id);
        if (medicineGroupOptional.isPresent()) {
            HMS_TW_AddMedicineGroup medicineGroup = medicineGroupOptional.get();
            medicineGroup.setDeleted(true);
            twAddMedicineGroupRepository.save(medicineGroup);
        } else {
            throw new RuntimeException("Medicine group not found with id: " + id);
        }
    }
}



