package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_PathologyParameter;
import com.hms.services.adminmanagement.entity.HMS_TW_PathologyParameter;
import com.hms.services.adminmanagement.repository.HMS_TM_PathologyParameterRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_PathologyParameterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PathologyParameterService {

    @Autowired
    private HMS_TW_PathologyParameterRepository twParameterRepository;

    @Autowired
    private HMS_TM_PathologyParameterRepository tmParameterRepository;

    public HMS_TW_PathologyParameter createPathologyParameter(HMS_TW_PathologyParameter parameter) {
        return twParameterRepository.save(parameter);
    }

    public HMS_TW_PathologyParameter getPathologyParameterById(String id) {
        return twParameterRepository.findByParameterIdAndDeletedFalse(id)
                .orElse(null);
    }

    public List<HMS_TW_PathologyParameter> getAllPathologyParametersTW() {
        return twParameterRepository.findByDeletedFalse();
    }

    public HMS_TW_PathologyParameter updatePathologyParameter(String id, HMS_TW_PathologyParameter updatedParameter) {
        HMS_TW_PathologyParameter existingParameter = getPathologyParameterById(id);
        existingParameter.setParameterName(updatedParameter.getParameterName());
        existingParameter.setReferenceRangeFrom(updatedParameter.getReferenceRangeFrom());
        existingParameter.setReferenceRangeTo(updatedParameter.getReferenceRangeTo());
        existingParameter.setUnit(updatedParameter.getUnit());
        existingParameter.setModNo(updatedParameter.getModNo());
        existingParameter.setDescription(updatedParameter.getDescription());
        return twParameterRepository.save(existingParameter);
    }

    public HMS_TM_PathologyParameter approvePathologyParameter(String id) {

        HMS_TW_PathologyParameter parameter = getPathologyParameterById(id);

        if ("UNAUTHORIZED".equals(parameter.getAuthStat())) {
            HMS_TM_PathologyParameter tmParameter = new HMS_TM_PathologyParameter();
            tmParameter.setParameterId(parameter.getParameterId());
            tmParameter.setModNo(parameter.getModNo());
            tmParameter.setParameterName(parameter.getParameterName());
            tmParameter.setReferenceRangeFrom(parameter.getReferenceRangeFrom());
            tmParameter.setReferenceRangeTo(parameter.getReferenceRangeTo());
            tmParameter.setUnit(parameter.getUnit());
            tmParameter.setDescription(parameter.getDescription());

            tmParameter.setAuthStat("AUTHORIZED");
            tmParameterRepository.save(tmParameter);

            parameter.setAuthStat("AUTHORIZED");
            parameter.setRecordStat("OPENED");
            twParameterRepository.save(parameter);

            return tmParameter;
        } else {
            throw new RuntimeException("Parameter is already approved or rejected");
        }
    }

    public void deletePathologyParameter(String id, String authStat) {
        HMS_TM_PathologyParameter tmParameter = tmParameterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pathology Parameter not found in TM with id: " + id));

        if ("UNAUTHORIZED".equalsIgnoreCase(authStat)) {
            tmParameterRepository.delete(tmParameter);
            Optional<HMS_TW_PathologyParameter> twParameterOptional = twParameterRepository.findById(id);

            if (twParameterOptional.isPresent()) {
                HMS_TW_PathologyParameter twParameter = twParameterOptional.get();
                twParameter.setAuthStat("UNAUTHORIZED");
                twParameter.setRecordStat("CLOSED");
                twParameterRepository.save(twParameter);
            }
        } else {
            throw new RuntimeException("Invalid authorization status. Only UNAUTHORIZED status is allowed for deletion.");
        }
    }

    public HMS_TM_PathologyParameter getPathologyParameterByIdTM(String id) {
        return tmParameterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pathology Parameter not found with id: " + id));
    }

    public List<HMS_TM_PathologyParameter> getAllPathologyParametersTM() {
        return tmParameterRepository.findAll();
    }

    public HMS_TM_PathologyParameter updatePathologyParameterTM(String id, HMS_TM_PathologyParameter updatedParameter) {
        HMS_TM_PathologyParameter existingParameter = getPathologyParameterByIdTM(id);
        existingParameter.setParameterName(updatedParameter.getParameterName());
        existingParameter.setReferenceRangeFrom(updatedParameter.getReferenceRangeFrom());
        existingParameter.setReferenceRangeTo(updatedParameter.getReferenceRangeTo());
        existingParameter.setUnit(updatedParameter.getUnit());
        existingParameter.setDescription(updatedParameter.getDescription());
        return tmParameterRepository.save(existingParameter);
    }

    public void deleteTwParameter(String parameterId) {
        Optional<HMS_TW_PathologyParameter> parameterOptional = twParameterRepository.findById(parameterId);
        if (parameterOptional.isPresent()) {
            HMS_TW_PathologyParameter parameter = parameterOptional.get();
            parameter.setDeleted(true);
            twParameterRepository.save(parameter);
        } else {
            throw new RuntimeException("Pathology Parameter not found with ID: " + parameterId);
        }
    }
}



