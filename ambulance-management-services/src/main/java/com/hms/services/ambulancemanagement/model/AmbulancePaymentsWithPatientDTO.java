package com.hms.services.ambulancemanagement.model;

import com.hms.services.ambulancemanagement.entity.HMS_TM_AddAmbulanceCall;
import com.hms.services.ambulancemanagement.entity.HMS_TM_AddVehicle;
import com.hms.services.ambulancemanagement.entity.HMS_TM_AmbulanceCallTransaction;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AmbulancePaymentsWithPatientDTO {

    private HMS_TM_AmbulanceCallTransaction transaction;
    private HMS_TM_AddAmbulanceCall ambulanceCall;
    private HMS_TM_AddVehicle vehicle;


}


