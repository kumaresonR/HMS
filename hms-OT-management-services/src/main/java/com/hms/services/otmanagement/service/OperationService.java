package com.hms.services.otmanagement.service;

import com.hms.services.otmanagement.configuration.IpdManagementInterface;
import com.hms.services.otmanagement.configuration.OpdManagementInterface;
import com.hms.services.otmanagement.model.IPDOperationDTO;
import com.hms.services.otmanagement.model.OPDOperationDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OperationService {


    private final IpdManagementInterface ipdManagementInterface;
    private final OpdManagementInterface opdManagementInterface;

    @Autowired
    public OperationService(IpdManagementInterface ipdManagementInterface, OpdManagementInterface opdManagementInterface) {
        this.ipdManagementInterface = ipdManagementInterface;
        this.opdManagementInterface = opdManagementInterface;
    }

    public List<IPDOperationDTO> getAllIpdOperation(String date,String status) {
        return ipdManagementInterface.searchByDate(date,status);

    }

    public List<OPDOperationDTO> getAllOpdOperation(String date,String status) {
        return opdManagementInterface.searchByDate(date,status);
    }


    public String updateSchedule(String id, IPDOperationDTO updatedOperation) {
        return ipdManagementInterface.updateOperationById(id, updatedOperation).getBody();
    }

    public String updateOperationStatusSchedule(String id, String status) {
        return ipdManagementInterface.updateOperationStatusById(id, status).getBody();
    }


    public String updateOpdSchedule(String id, IPDOperationDTO updatedOperation) {
        return opdManagementInterface.updateOperationById(id, updatedOperation).getBody();
    }

    public String updateOpdScheduleStatus(String id, String status) {
        return opdManagementInterface.updateOperationStatusById(id, status).getBody();
    }
}

