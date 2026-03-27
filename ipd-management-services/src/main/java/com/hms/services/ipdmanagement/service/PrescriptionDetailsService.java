package com.hms.services.ipdmanagement.service;

import com.hms.services.ipdmanagement.entity.HMS_TM_PrescriptionDetails;
import com.hms.services.ipdmanagement.exception.CustomException;
import com.hms.services.ipdmanagement.model.PrescriptionDetailsDTO;
import com.hms.services.ipdmanagement.repository.PrescriptionDetailsRepository;
import org.json.simple.JSONObject;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PrescriptionDetailsService {

        private final PrescriptionDetailsRepository prescriptionDetailsRepository;
        private final ModelMapper modelMapper;

        @Autowired
        public PrescriptionDetailsService(PrescriptionDetailsRepository prescriptionDetailsRepository, ModelMapper modelMapper) {
            this.prescriptionDetailsRepository = prescriptionDetailsRepository;
            this.modelMapper = modelMapper;
        }

        // Create Prescription Detail
        public PrescriptionDetailsDTO createPrescriptionDetail(PrescriptionDetailsDTO prescriptionDetailsDTO) {
            try {
                HMS_TM_PrescriptionDetails prescriptionDetail = modelMapper.map(prescriptionDetailsDTO, HMS_TM_PrescriptionDetails.class);
                prescriptionDetail.setActive(true);
                HMS_TM_PrescriptionDetails savedDetail = prescriptionDetailsRepository.save(prescriptionDetail);
                return modelMapper.map(savedDetail, PrescriptionDetailsDTO.class);
            }catch(Exception ex) {
                throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
            }
        }

        // Read Prescription Detail by ID
        public PrescriptionDetailsDTO getPrescriptionDetailById(String id) {
            try {
                HMS_TM_PrescriptionDetails prescriptionDetail = prescriptionDetailsRepository.findById(id)
                        .orElseThrow(() -> new CustomException("Prescription detail not found", HttpStatus.NOT_FOUND));
                return modelMapper.map(prescriptionDetail, PrescriptionDetailsDTO.class);
            }catch(Exception ex) {
                throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
            }
        }

        // Read All Prescription Details by Prescription ID
        public List<PrescriptionDetailsDTO> getPrescriptionDetailsByPrescriptionId(String prescriptionId) {
            try {
            List<HMS_TM_PrescriptionDetails> details = prescriptionDetailsRepository.findByPrescriptionIdAndIsActiveTrue(prescriptionId);
            return details.stream()
                    .map(detail -> modelMapper.map(detail, PrescriptionDetailsDTO.class))
                    .collect(Collectors.toList());
            }catch(Exception ex) {
                throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
            }
        }

        // Update Prescription Detail
        public JSONObject updatePrescriptionDetail(String id, PrescriptionDetailsDTO prescriptionDetailsDTO) {
            try{
            HMS_TM_PrescriptionDetails prescriptionDetail = prescriptionDetailsRepository.findById(id)
                    .orElseThrow(() -> new CustomException("Prescription detail not found", HttpStatus.NOT_FOUND));
            modelMapper.map(prescriptionDetailsDTO, prescriptionDetail);
            prescriptionDetailsRepository.save(prescriptionDetail);
                JSONObject response = new JSONObject();
                response.put("Message", "PrescriptionDetails updated successfully");
                response.put("PrescriptionDetailsID", id);
                return response;
        }catch(Exception ex) {
        throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }}

        // Delete (Soft Delete) Prescription Detail
        public JSONObject deletePrescriptionDetail(String id) {
            try {
                HMS_TM_PrescriptionDetails prescriptionDetail = prescriptionDetailsRepository.findById(id)
                        .orElseThrow(() -> new CustomException("Prescription detail not found", HttpStatus.NOT_FOUND));
                prescriptionDetail.setActive(false);
                prescriptionDetailsRepository.save(prescriptionDetail);
                JSONObject response = new JSONObject();
                response.put("Message", "PrescriptionDetails deleted successfully");
                return response;
            }catch (Exception ex) {
                throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
            }
        }

    public List<PrescriptionDetailsDTO> getPrescriptionDetailByIpdId(String id) {
        try {
            List<HMS_TM_PrescriptionDetails> prescriptionDetails = prescriptionDetailsRepository.findByIpdIdAndIsActiveTrue(id);
            return prescriptionDetails.stream()
                    .map(detail -> modelMapper.map(detail, PrescriptionDetailsDTO.class))
                    .collect(Collectors.toList());
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }



}

