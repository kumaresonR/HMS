package com.hms.services.billingmanagement.configuration;


import com.hms.services.billingmanagement.model.HMS_TM_AddCompany;
import com.hms.services.billingmanagement.model.HMS_TM_MedicineCategory;
import com.hms.services.billingmanagement.model.HMS_TM_Supplier;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient("admin-management-services")
public interface AdminManagementInterface {

    @GetMapping("/suppliers/tm/{id}")
    public ResponseEntity<HMS_TM_Supplier> getSupplierById(@PathVariable String id);

    @GetMapping("/medicine-categories/tm/{id}")
    public ResponseEntity<HMS_TM_MedicineCategory> getMedicineCategoryById(@PathVariable String id);

    @GetMapping("/companies/tm/{id}")
    public ResponseEntity<HMS_TM_AddCompany> getCompanyByIds(@PathVariable String id);
}

