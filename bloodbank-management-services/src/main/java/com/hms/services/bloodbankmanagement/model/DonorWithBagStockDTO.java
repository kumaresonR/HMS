package com.hms.services.bloodbankmanagement.model;

import com.hms.services.bloodbankmanagement.entity.HMS_TM_BagStock;
import com.hms.services.bloodbankmanagement.entity.HMS_TM_DonorDetails;
import lombok.Data;

import java.util.List;

@Data
public class DonorWithBagStockDTO {

    private HMS_TM_DonorDetails donorDetails;
    private List<HMS_TM_BagStock> bagStocks;
}

