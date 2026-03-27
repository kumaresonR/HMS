package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_LeaveType;
import com.hms.services.adminmanagement.entity.HMS_TW_LeaveType;
import com.hms.services.adminmanagement.repository.HMS_TM_LeaveTypeRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_LeaveTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LeaveTypeService {

    @Autowired
    private HMS_TW_LeaveTypeRepository twLeaveTypeRepository;

    @Autowired
    private HMS_TM_LeaveTypeRepository tmLeaveTypeRepository;

    public HMS_TW_LeaveType createLeaveType(HMS_TW_LeaveType leaveType) {
        return twLeaveTypeRepository.save(leaveType);
    }

    public HMS_TW_LeaveType getLeaveTypeById(String id) {
        return twLeaveTypeRepository.findByLeaveTypeIdAndDeletedFalse(id)
                .orElse(null);
    }

    public List<HMS_TW_LeaveType> getAllLeaveTypesTW() {
        return twLeaveTypeRepository.findByDeletedFalse();
    }

    public HMS_TW_LeaveType updateLeaveType(String id, HMS_TW_LeaveType updatedLeaveType) {
        HMS_TW_LeaveType existingLeaveType = getLeaveTypeById(id);
        existingLeaveType.setName(updatedLeaveType.getName());
        existingLeaveType.setModNo(updatedLeaveType.getModNo());
        return twLeaveTypeRepository.save(existingLeaveType);
    }

    public HMS_TM_LeaveType approveLeaveType(String id) {

        HMS_TW_LeaveType leaveType = getLeaveTypeById(id);

        if ("UNAUTHORIZED".equals(leaveType.getAuthStat())) {
            HMS_TM_LeaveType tmLeaveType = new HMS_TM_LeaveType();
            tmLeaveType.setLeaveTypeId(leaveType.getLeaveTypeId());
            tmLeaveType.setName(leaveType.getName());
            tmLeaveType.setModNo(leaveType.getModNo());
            tmLeaveType.setAuthStat("AUTHORIZED");

            tmLeaveTypeRepository.save(tmLeaveType);

            leaveType.setAuthStat("AUTHORIZED");
            leaveType.setRecordStat("OPENED");
            twLeaveTypeRepository.save(leaveType);

            return tmLeaveType;
        } else {
            throw new RuntimeException("Leave Type is already approved or rejected");
        }
    }

    public void deleteLeaveType(String id, String authStat) {
        HMS_TM_LeaveType tmLeaveType = tmLeaveTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave type not found in TM with id: " + id));

        if ("UNAUTHORIZED".equals(authStat)) {
            tmLeaveTypeRepository.delete(tmLeaveType);

            Optional<HMS_TW_LeaveType> twLeaveTypeOptional = twLeaveTypeRepository.findById(id);

            if (twLeaveTypeOptional.isPresent()) {
                HMS_TW_LeaveType twLeaveType = twLeaveTypeOptional.get();
                twLeaveType.setAuthStat("UNAUTHORIZED");
                twLeaveType.setRecordStat("CLOSED");
                twLeaveTypeRepository.save(twLeaveType);
            }
        } else {
            throw new RuntimeException("Invalid authorization status, only UNAUTHORIZED is allowed");
        }
    }

    public HMS_TM_LeaveType getLeaveTypeByIds(String id) {
        return tmLeaveTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave Type not found with id: " + id));
    }

    public List<HMS_TM_LeaveType> getAllLeaveTypesTM() {
        return tmLeaveTypeRepository.findAll();
    }

    public HMS_TM_LeaveType updateLeaveType(String id, HMS_TM_LeaveType updatedLeaveType) {
        HMS_TM_LeaveType existingLeaveType = getLeaveTypeByIds(id);
        existingLeaveType.setName(updatedLeaveType.getName());
        return tmLeaveTypeRepository.save(existingLeaveType);
    }

    public void deleteTwLeaveType(String id) {
        HMS_TW_LeaveType leaveType = twLeaveTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave Type not found with id: " + id));
        leaveType.setDeleted(true);
        twLeaveTypeRepository.save(leaveType);
    }
}



