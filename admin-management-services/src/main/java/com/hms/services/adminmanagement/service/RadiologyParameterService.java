package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_RadiologyParameter;
import com.hms.services.adminmanagement.entity.HMS_TW_RadiologyParameter;
import com.hms.services.adminmanagement.repository.HMS_TM_RadiologyParameterRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_RadiologyParameterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RadiologyParameterService {

    @Autowired
    private HMS_TW_RadiologyParameterRepository twParameterRepository;

    @Autowired
    private HMS_TM_RadiologyParameterRepository tmParameterRepository;

    public HMS_TW_RadiologyParameter createRadiologyParameter(HMS_TW_RadiologyParameter parameter) {
        return twParameterRepository.save(parameter);
    }

    public HMS_TW_RadiologyParameter getRadiologyParameterById(String id) {
        return twParameterRepository.findByParameterIdAndDeletedFalse(id)
                .orElse(null);
    }

    public List<HMS_TW_RadiologyParameter> getAllRadiologyParametersTW() {
        return twParameterRepository.findByDeletedFalse();
    }

    public HMS_TW_RadiologyParameter updateRadiologyParameter(String id, HMS_TW_RadiologyParameter updatedParameter) {
        HMS_TW_RadiologyParameter existingParameter = getRadiologyParameterById(id);
        existingParameter.setParameterName(updatedParameter.getParameterName());
        existingParameter.setReferenceRangeFrom(updatedParameter.getReferenceRangeFrom());
        existingParameter.setReferenceRangeTo(updatedParameter.getReferenceRangeTo());
        existingParameter.setUnit(updatedParameter.getUnit());
        existingParameter.setDescription(updatedParameter.getDescription());
        existingParameter.setModNo(updatedParameter.getModNo());
        return twParameterRepository.save(existingParameter);
    }

    public HMS_TM_RadiologyParameter approveRadiologyParameter(String id) {

        HMS_TW_RadiologyParameter parameter = getRadiologyParameterById(id);

        if ("UNAUTHORIZED".equals(parameter.getAuthStat())) {
            HMS_TM_RadiologyParameter tmParameter = new HMS_TM_RadiologyParameter();
            tmParameter.setParameterId(parameter.getParameterId());
            tmParameter.setParameterName(parameter.getParameterName());
            tmParameter.setReferenceRangeFrom(parameter.getReferenceRangeFrom());
            tmParameter.setReferenceRangeTo(parameter.getReferenceRangeTo());
            tmParameter.setUnit(parameter.getUnit());
            tmParameter.setDescription(parameter.getDescription());
            tmParameter.setAuthStat("AUTHORIZED");
            tmParameter.setModNo(parameter.getModNo());

            tmParameterRepository.save(tmParameter);

            parameter.setAuthStat("AUTHORIZED");
            parameter.setRecordStat("OPENED");
            twParameterRepository.save(parameter);

            return tmParameter;
        } else {
            throw new RuntimeException("Parameter is already approved or rejected");
        }
    }

    public void deleteRadiologyParameter(String id, String authStat) {
        HMS_TM_RadiologyParameter tmParameter = tmParameterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Radiology parameter not found in TM with id: " + id));

        if ("UNAUTHORIZED".equalsIgnoreCase(authStat)) {
            tmParameterRepository.delete(tmParameter);

            Optional<HMS_TW_RadiologyParameter> twParameterOptional = twParameterRepository.findById(id);

            if (twParameterOptional.isPresent()) {
                HMS_TW_RadiologyParameter twParameter = twParameterOptional.get();
                twParameter.setAuthStat("UNAUTHORIZED");
                twParameter.setRecordStat("CLOSED");
                twParameterRepository.save(twParameter);
            }
        } else {
            throw new RuntimeException("Invalid authorization status. Only UNAUTHORIZED status is allowed for deletion.");
        }
    }

    public HMS_TM_RadiologyParameter getRadiologyParameterByIdTM(String id) {
        return tmParameterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Radiology Parameter not found with id: " + id));
    }

    public List<HMS_TM_RadiologyParameter> getAllRadiologyParametersTM() {
        return tmParameterRepository.findAll();
    }

    public HMS_TM_RadiologyParameter updateRadiologyParameterTM(String id, HMS_TM_RadiologyParameter updatedParameter) {
        HMS_TM_RadiologyParameter existingParameter = getRadiologyParameterByIdTM(id);
        existingParameter.setParameterName(updatedParameter.getParameterName());
        existingParameter.setReferenceRangeFrom(updatedParameter.getReferenceRangeFrom());
        existingParameter.setReferenceRangeTo(updatedParameter.getReferenceRangeTo());
        existingParameter.setUnit(updatedParameter.getUnit());
        existingParameter.setDescription(updatedParameter.getDescription());
        return tmParameterRepository.save(existingParameter);
    }

    public void deleteTwParameter(String parameterId) {
        Optional<HMS_TW_RadiologyParameter> parameterOptional = twParameterRepository.findById(parameterId);
        if (parameterOptional.isPresent()) {
            HMS_TW_RadiologyParameter parameter = parameterOptional.get();
            parameter.setDeleted(true);
            twParameterRepository.save(parameter);
        } else {
            throw new RuntimeException("Radiology Parameter not found with ID: " + parameterId);
        }
    }
}



