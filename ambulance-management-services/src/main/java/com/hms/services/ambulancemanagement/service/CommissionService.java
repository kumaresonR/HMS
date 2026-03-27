package com.hms.services.ambulancemanagement.service;

import com.hms.services.ambulancemanagement.configuration.AdminManagementInterface;
import com.hms.services.ambulancemanagement.configuration.ConnectionInterface;
import com.hms.services.ambulancemanagement.entity.HMS_TM_Commission;
import com.hms.services.ambulancemanagement.model.CommissionDTO;
import com.hms.services.ambulancemanagement.model.EmployeeDetails;
import com.hms.services.ambulancemanagement.model.PatientsDTO;
import com.hms.services.ambulancemanagement.repository.CommissionRepository;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CommissionService {

    @Autowired
    private CommissionRepository repository;

    @Autowired
    private AdminManagementInterface adminManagementInterface;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    ConnectionInterface patientManagementInterface;


    // Get all active commissions
    public List<CommissionDTO> getAllCommissions(Boolean isPaid) {
        List<HMS_TM_Commission> commissions;
        if (isPaid != null) {
            commissions = repository.findByIsActiveTrueAndIsPaid(isPaid);
        } else {
            commissions = repository.findByIsActiveTrue();
        }
        return commissions.stream().map(commission -> {
            CommissionDTO commissionDTO = modelMapper.map(commission, CommissionDTO.class);
            EmployeeDetails employee = adminManagementInterface.getEmployeeById(commission.getDoctorId()).getBody();
            commissionDTO.setEmployeeDetails(employee);
            PatientsDTO patient =patientManagementInterface.getPatientById(commission.getPatientId()).getBody();
            commissionDTO.setPatients(patient);
            return commissionDTO;
        }).collect(Collectors.toList());
    }

    // Get commission by ID
    public Optional<CommissionDTO> getCommissionById(String id) {
        Optional<HMS_TM_Commission> commissionOpt = repository.findByIdAndIsActiveTrue(id);
        if (commissionOpt.isPresent()) {
            HMS_TM_Commission commission = commissionOpt.get();
            CommissionDTO commissionDTO = modelMapper.map(commission, CommissionDTO.class);
            EmployeeDetails employee = adminManagementInterface.getEmployeeById(commission.getDoctorId()).getBody();
            commissionDTO.setEmployeeDetails(employee);
            PatientsDTO patient =patientManagementInterface.getPatientById(commission.getPatientId()).getBody();
            commissionDTO.setPatients(patient);
            return Optional.of(commissionDTO);
        } else {
            return Optional.empty();
        }
    }

    // Create new commission
    public HMS_TM_Commission createCommission(HMS_TM_Commission commission) {
        return repository.save(commission);
    }

    // delete commission by ID
    public boolean softDeleteCommission(String id) {
        Optional<HMS_TM_Commission> existingCommission = repository.findById(id);
        if (existingCommission.isPresent()) {
            HMS_TM_Commission commission = existingCommission.get();
            commission.setIsActive(false);
            repository.save(commission);
            return true;
        }
        return false;
    }


    // Get commissions by category
    public List<CommissionDTO> getCommissionsByCategory(String category) {
        List<HMS_TM_Commission> commissions=repository.findByCommissionCategoryAndIsActiveTrue(category);
        return commissions.stream().map(commission -> {
            CommissionDTO commissionDTO = modelMapper.map(commission, CommissionDTO.class);
            EmployeeDetails employee = adminManagementInterface.getEmployeeById(commission.getDoctorId()).getBody();
            commissionDTO.setEmployeeDetails(employee);
            PatientsDTO patient = patientManagementInterface.getPatientById(commission.getPatientId()).getBody();
            commissionDTO.setPatients(patient);
            return commissionDTO;
        }).collect(Collectors.toList());
    }


    // Get records by doctorId
    public List<CommissionDTO> getCommissionsByDoctorId(String doctorId) {
        List<HMS_TM_Commission> commissions= repository.findByDoctorIdAndIsActiveTrue(doctorId);
        return commissions.stream().map(commission -> {
            CommissionDTO commissionDTO = modelMapper.map(commission, CommissionDTO.class);
            EmployeeDetails employee = adminManagementInterface.getEmployeeById(commission.getDoctorId()).getBody();
            commissionDTO.setEmployeeDetails(employee);
            PatientsDTO patient = patientManagementInterface.getPatientById(commission.getPatientId()).getBody();
            commissionDTO.setPatients(patient);
            return commissionDTO;
        }).collect(Collectors.toList());
    }


    public boolean updateCommissionStatus(String commissionId, boolean isPaid) {
        Optional<HMS_TM_Commission> commissionOpt = repository.findByIdAndIsActiveTrue(commissionId);
        if (commissionOpt.isPresent()) {
            HMS_TM_Commission commission = commissionOpt.get();
            commission.setIsPaid(isPaid);
            repository.save(commission);
            return true;
        }
        return false;
    }


    public HMS_TM_Commission updateCommission(String id, HMS_TM_Commission updatedCommission) {
        HMS_TM_Commission existingCommission = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Commission not found with id: " + id));
        existingCommission.setPatientId(updatedCommission.getPatientId());
        existingCommission.setIpdOrOpdId(updatedCommission.getIpdOrOpdId());
        existingCommission.setDoctorId(updatedCommission.getDoctorId());
        existingCommission.setDateTime(updatedCommission.getDateTime());
        existingCommission.setCommissionCategory(updatedCommission.getCommissionCategory());
        existingCommission.setCommissionPercentage(updatedCommission.getCommissionPercentage());
        existingCommission.setCommissionAmount(updatedCommission.getCommissionAmount());
        return repository.save(existingCommission);
    }

}



