package com.hms.services.billingmanagement.configuration;

import com.hms.services.billingmanagement.service.AddMedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class MedicineScheduler {

    @Autowired
    private AddMedicineService medicineService;

    @Scheduled(cron = "0 0 0 * * ?")
    public void scheduleBadStockCheck() {
        medicineService.checkAndCreateBadStock();
    }

//    @Scheduled(cron = "0 0 * * * ?")
//    public void scheduleBadStockCheck() {
//        medicineService.checkAndCreateBadStock();
//    }
}


