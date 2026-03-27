package com.hms.services.dashboardmanagement.configuration;


import com.hms.services.dashboardmanagement.response.IncomeChanges;
import com.hms.services.dashboardmanagement.response.TotalBillSummary;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Map;

@FeignClient(name="billing-management-services")
public interface BillingPaymentInterface {
    @GetMapping("/pathology-bills/pathology-income")
    public IncomeChanges getPathologyIncome();

    @GetMapping("/pharmacy-bill/pharmacy-income")
    public IncomeChanges getPharmacyIncome();

    @GetMapping("/radiology-bills/radiology-income")
    public IncomeChanges getRadiologyIncome();
    @GetMapping("/pathology-bills/pathology-monthly-income")
    public Double getPathologyMonthlyIncome();
    @GetMapping("/pharmacy-bill/pharmacy-monthly-income")
    public Double getPharmacyMonthlyIncome();
    @GetMapping("/radiology-bills/radiology-monthly-income")
    public Double getMonthlyRadiologyIncome();

    @GetMapping("/add-medicine/medicine_totalStock")
    public Double totalMedicineStock();
    @GetMapping("/bad-stock/totalStock")
    public Double totalBadStock();
    @GetMapping("/purchase-medicine/medicine_purchaseAmount")
    public IncomeChanges totalAmountToPurchase();
    @GetMapping("/pharmacy-bill/monthly-pharmacySale")
    public Map<Integer, Double> getPharmacyMonthlySalePerYear();
    @GetMapping("/pharmacy-bill/common-medicines")
    public List<Object> getCommonlyUsedMedicines();
    @GetMapping("/pathology-bills/OpdOrIpd/pathology-payment/{id}")
    public TotalBillSummary.BillSummary getPathologyOpdAndIpdPayment(@PathVariable String id);
    @GetMapping("/pharmacy-bill/OpdOrIpd/pharmacy-payment/{id}")
    public TotalBillSummary.BillSummary getPharmacyOpdAndIpdPayment(@PathVariable String id);
    @GetMapping("/radiology-bills/OpdOrIpd/radiology-payment/{id}")
    public TotalBillSummary.BillSummary getRadiologyOpdAndIpdPayment(@PathVariable String id);
    @GetMapping("/pathology-bills/medical-history/{patientId}")
    public Integer getMedicalHistoryPathology(@PathVariable String patientId);
    @GetMapping("/pharmacy-bill/medical-history/{patientId}")
    public Integer getMedicalHistoryPharmacy(@PathVariable String patientId);
    @GetMapping("/radiology-bills/medical-history/{patientId}")
    public Integer getMedicalHistoryRadiology(@PathVariable String patientId);

    @GetMapping("/pathology-bills/increase-weekly-income")
    public IncomeChanges getPathologyIncreaseWeeklyIncome();
    @GetMapping("/pathology-bills/increase-yearly-income")
    public IncomeChanges getPathologyIncreaseYearlyIncome();
    @GetMapping("/pathology-bills/increase-monthly-income")
    public IncomeChanges getPathologyIncreaseMonthlyIncome();

    @GetMapping("/pharmacy-bill/increase-weekly-income")
    public IncomeChanges getPharmacyIncreaseWeeklyIncome();
    @GetMapping("/pharmacy-bill/increase-yearly-income")
    public IncomeChanges getPharmacyIncreaseYearlyIncome();
    @GetMapping("/pharmacy-bill/increase-monthly-income")
    public IncomeChanges getPharmacyIncreaseMonthlyIncome();

    @GetMapping("/radiology-bills/increase-weekly-income")
    public IncomeChanges getRadiologyIncreaseWeeklyIncome();
    @GetMapping("/radiology-bills/increase-yearly-income")
    public IncomeChanges getRadiologyIncreaseYearlyIncome();
    @GetMapping("/radiology-bills/increase-monthly-income")
    public IncomeChanges getRadiologyIncreaseMonthlyIncome();
}


