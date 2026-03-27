package com.hms.services.ipdmanagement.service;

import com.hms.services.ipdmanagement.configuration.AdminManagementInterface;
import com.hms.services.ipdmanagement.entity.HMS_TM_ConsultantRegister;
import com.hms.services.ipdmanagement.exception.CustomException;
import com.hms.services.ipdmanagement.model.ConsultantRegisterDTO;
import com.hms.services.ipdmanagement.model.EmployeeDetails;
import com.hms.services.ipdmanagement.repository.ConsultantRegisterRepository;
import com.hms.services.ipdmanagement.response.ApiResponse;
import org.json.simple.JSONObject;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConsultantRegisterService {

    private final ConsultantRegisterRepository consultantRegisterRepository;
    private final ModelMapper modelMapper;
    private final AdminManagementInterface adminManagementInterface;

    @Autowired
    public ConsultantRegisterService(final ConsultantRegisterRepository consultantRegisterRepository,
                                     final ModelMapper modelMapper,final AdminManagementInterface adminManagementInterface) {
        this.consultantRegisterRepository = consultantRegisterRepository;
        this.modelMapper = modelMapper;
        this.adminManagementInterface = adminManagementInterface;
    }

    // Create
    public JSONObject createConsultantRegister(ConsultantRegisterDTO consultantRegisterDTO) {
        HMS_TM_ConsultantRegister consultant = modelMapper.map(consultantRegisterDTO, HMS_TM_ConsultantRegister.class);
        consultant.setActive(true);
        consultant.setCreatedAt(LocalDateTime.now());
        consultant.setCreatedBy("admin");
        HMS_TM_ConsultantRegister savedConsultant = consultantRegisterRepository.save(consultant);
        JSONObject response = new JSONObject();
        response.put("Message", "Consultant Register created successfully");
        return response;
    }

    // Read All
    public List<ConsultantRegisterDTO> getAllConsultantRegisters(int page, int size) {
        Page<HMS_TM_ConsultantRegister> consultants = consultantRegisterRepository.findAllByIsActiveTrue(PageRequest.of(page, size));
        return consultants.stream().map(consultant -> modelMapper.map(consultant, ConsultantRegisterDTO.class)).collect(Collectors.toList());
    }

    // Read by ID
    public ConsultantRegisterDTO getConsultantRegisterById(String id) {
        HMS_TM_ConsultantRegister consultant = consultantRegisterRepository.findByConsultantIdAndIsActiveTrue(id)
                .orElseThrow(() -> new CustomException("Consultant Register Not Found", HttpStatus.NOT_FOUND));
        EmployeeDetails doctorInfo =adminManagementInterface.getEmployeeById(consultant.getDoctorId()).getBody();
        ConsultantRegisterDTO registerDTO=modelMapper.map(consultant, ConsultantRegisterDTO.class);
        registerDTO.setDoctor(doctorInfo);
        return registerDTO;

    }

    // Update
    public JSONObject updateConsultantRegisterById(String id, ConsultantRegisterDTO consultantRegisterDTO) {
        HMS_TM_ConsultantRegister consultant = consultantRegisterRepository.findByConsultantIdAndIsActiveTrue(id)
                .orElseThrow(() -> new CustomException("Consultant Register Not Found", HttpStatus.NOT_FOUND));
        consultant.setAppliedDate(consultantRegisterDTO.getAppliedDate());
        consultant.setDoctorId(consultantRegisterDTO.getDoctorId());
        consultant.setInstruction(consultantRegisterDTO.getInstruction());
        consultant.setConsultantDate(consultantRegisterDTO.getConsultantDate());
        consultant.setConsultantDoctor(consultantRegisterDTO.getConsultantDoctor());
        consultant.setLastModifiedAt(LocalDateTime.now());
        consultant.setLastModifiedBy("admin");
        consultantRegisterRepository.save(consultant);
        JSONObject response = new JSONObject();
        response.put("Message", "Consultant Register updated successfully");
        return response;
    }

    // Delete
    public JSONObject deleteConsultantRegister(String id) {
        HMS_TM_ConsultantRegister consultant = consultantRegisterRepository.findByConsultantIdAndIsActiveTrue(id)
                .orElseThrow(() -> new CustomException("Consultant Register Not Found", HttpStatus.NOT_FOUND));
        consultant.setActive(false);
        consultantRegisterRepository.save(consultant);
        JSONObject response = new JSONObject();
        response.put("Message", "Consultant Register deleted successfully");
        return response;
    }

    public List<ConsultantRegisterDTO> getConsultantRegisterByIpdId(String id) {
        List<HMS_TM_ConsultantRegister> consultants = consultantRegisterRepository.findAllByIpdIdAndIsActiveTrue(id);
        if (consultants.isEmpty()) {
            throw new CustomException("Consultant Register Not Found", HttpStatus.NOT_FOUND);
        }
        return consultants.stream()
                .map(consultant -> modelMapper.map(consultant, ConsultantRegisterDTO.class))
                .collect(Collectors.toList());
    }



}

