package com.hms.services.dashboardmanagement.controller;


import com.hms.services.dashboardmanagement.configuration.*;
import com.hms.services.dashboardmanagement.response.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private final OpdPaymentInterface opdPaymentInterface;
    private final IpdPaymentInterface ipdPaymentInterface;
    private final BillingPaymentInterface billingPaymentInterface;
    private final BloodBankPaymentInterface bloodBankPaymentInterface;
    private final AmbulancePaymentInterface ambulancePaymentInterface;
    private final FinancePaymentInterface financePaymentInterface;

    @Autowired
    public DashboardController(final OpdPaymentInterface opdPaymentInterface, final IpdPaymentInterface ipdPaymentInterface, final BillingPaymentInterface billingPaymentInterface,
                               final BloodBankPaymentInterface bloodBankPaymentInterface, final AmbulancePaymentInterface ambulancePaymentInterface, final FinancePaymentInterface financePaymentInterface) {
        this.opdPaymentInterface = opdPaymentInterface;
        this.ipdPaymentInterface = ipdPaymentInterface;
        this.billingPaymentInterface = billingPaymentInterface;
        this.bloodBankPaymentInterface = bloodBankPaymentInterface;
        this.ambulancePaymentInterface = ambulancePaymentInterface;
        this.financePaymentInterface = financePaymentInterface;
    }

//    @GetMapping("/opd-income")
//    public IncomeResponse getOPDIncome() {
//        IncomeChanges incomeChanges = opdPaymentInterface.getOPDIncome();
//        return new IncomeResponse(incomeChanges);
//    }
//
//    @GetMapping("/ipd-income")
//    public IncomeResponse getIPDIncome() {
//        IncomeChanges incomeChanges = ipdPaymentInterface.getIPDIncome();
//        return new IncomeResponse(incomeChanges);
//    }
//
//    @GetMapping("/pathology-income")
//    public IncomeResponse getPathologyIncome() {
//        IncomeChanges incomeChanges = billingPaymentInterface.getPathologyIncome();
//        return new IncomeResponse(incomeChanges);
//    }
//
//    @GetMapping("/pharmacy-income")
//    public IncomeResponse getPharmacyIncome() {
//        IncomeChanges incomeChanges = billingPaymentInterface.getPharmacyIncome();
//        return new IncomeResponse(incomeChanges);
//    }
//
//    @GetMapping("/radiology-income")
//    public IncomeResponse getRadiologyIncome() {
//        IncomeChanges incomeChanges = billingPaymentInterface.getRadiologyIncome();
//        return new IncomeResponse(incomeChanges);
//    }
//
//    @GetMapping("/bloodBank-income")
//    public IncomeResponse getBloodBankIncome() {
//        IncomeChanges incomeChanges = bloodBankPaymentInterface.getIssueBloodIncome();
//        return new IncomeResponse(incomeChanges);
//    }
//
//    @GetMapping("/ambulance-income")
//    public IncomeResponse getAmbulanceIncome() {
//        IncomeChanges incomeChanges = ambulancePaymentInterface.getAmbulanceIncome();
//        return new IncomeResponse(incomeChanges);
//    }
//
//    @GetMapping("/general-income")
//    public IncomeResponse getGeneralIncome() {
//        IncomeChanges incomeChanges = financePaymentInterface.getGeneralIncomeAmount();
//        return new IncomeResponse(incomeChanges);
//    }
//    @GetMapping("/expense")
//    public IncomeResponse getGeneralExpense() {
//        IncomeChanges incomeChanges = financePaymentInterface.getExpenseAmount();
//        return new IncomeResponse(incomeChanges);
//    }

    @GetMapping("/all-incomes")
    public IncomeResponse getAllIncomes() {
        IncomeResponse response = new IncomeResponse();
        IncomeChanges ipd = ipdPaymentInterface.getIPDIncome();
        response.setIpdIncome(ipd.getTodayIncome());
        response.setIpdPercentageChangeFromYesterday(ipd.getPercentageChangeFromYesterday());
        IncomeChanges opd = opdPaymentInterface.getOPDIncome();
        response.setOpdIncome(opd.getTodayIncome());
        response.setOpdPercentageChangeFromYesterday(opd.getPercentageChangeFromYesterday());
        IncomeChanges pharmacy = billingPaymentInterface.getPharmacyIncome();
        response.setPharmacyIncome(pharmacy.getTodayIncome());
        response.setPharmacyPercentageChangeFromYesterday(pharmacy.getPercentageChangeFromYesterday());
        IncomeChanges radiology = billingPaymentInterface.getRadiologyIncome();
        response.setRadiologyIncome(radiology.getTodayIncome());
        response.setRadiologyPercentageChangeFromYesterday(radiology.getPercentageChangeFromYesterday());
        IncomeChanges pathology = billingPaymentInterface.getPathologyIncome();
        response.setPathologyIncome(pathology.getTodayIncome());
        response.setPathologyPercentageChangeFromYesterday(pathology.getPercentageChangeFromYesterday());
        IncomeChanges bloodBank = bloodBankPaymentInterface.getIssueBloodIncome();
        response.setBloodBankIncome(bloodBank.getTodayIncome());
        response.setBloodBankPercentageChangeFromYesterday(bloodBank.getPercentageChangeFromYesterday());
        IncomeChanges ambulance = ambulancePaymentInterface.getAmbulanceIncome();
        response.setAmbulanceIncome(ambulance.getTodayIncome());
        response.setAmbulancePercentageChangeFromYesterday(ambulance.getPercentageChangeFromYesterday());
        IncomeChanges general = financePaymentInterface.getGeneralIncomeAmount();
        response.setGeneralIncome(general.getTodayIncome());
        response.setGeneralPercentageChangeFromYesterday(general.getPercentageChangeFromYesterday());
        IncomeChanges expense = financePaymentInterface.getExpenseAmount();
        response.setExpense(expense.getTodayIncome());
        response.setExpensePercentageChangeFromYesterday(expense.getPercentageChangeFromYesterday());
        return response;
    }

    @GetMapping("/all-monthly-incomes-percentage")
    public IncomeChangesInPercentage getAllIncomesForPercentage() {
        Double ipd = ipdPaymentInterface.getIPDMonthlyIncome();
        Double opd = opdPaymentInterface.getOPDMonthlyIncome();
        Double pharmacy = billingPaymentInterface.getPharmacyMonthlyIncome();
        Double radiology = billingPaymentInterface.getMonthlyRadiologyIncome();
        Double pathology = billingPaymentInterface.getPathologyMonthlyIncome();
        Double bloodBank = bloodBankPaymentInterface.getIssueBloodMonthlyIncome();
        Double ambulance = ambulancePaymentInterface.getAmbulanceMonthlyIncome();
//        Double generalIncome = financePaymentInterface.getMonthlyGeneralIncomeAmount();
//        Double expense = financePaymentInterface.getMonthlyExpenseAmount();
        Double totalIncome = ipd + opd + pharmacy + radiology + pathology + bloodBank + ambulance;
        if (totalIncome == null || totalIncome == 0) {
            totalIncome = 1.0;
        }
        IncomeChangesInPercentage response = new IncomeChangesInPercentage();
        response.setIpdPercentageChange(calculatePercentage(ipd, totalIncome));
        response.setOpdPercentageChange(calculatePercentage(opd, totalIncome));
        response.setPharmacyPercentageChange(calculatePercentage(pharmacy, totalIncome));
        response.setRadiologyPercentageChange(calculatePercentage(radiology, totalIncome));
        response.setPathologyPercentageChange(calculatePercentage(pathology, totalIncome));
        response.setBloodBankPercentageChange(calculatePercentage(bloodBank, totalIncome));
        response.setAmbulancePercentageChange(calculatePercentage(ambulance, totalIncome));
//        response.setGeneralIncome(generalIncome);
//        response.setExpense(expense);
        return response;

    }

    private String calculatePercentage(Double categoryIncome, Double totalIncome) {
        if (categoryIncome == null || totalIncome == null || totalIncome == 0) {
            return "0%";
        }
        double percentage = (categoryIncome / totalIncome) * 100;
        return String.format("%.2f%%", percentage);
    }

    @GetMapping("/all-monthly-income-expense")
    public IncomeAndExpenseChanges getAllIncomesAndExpensePerYear() {
        Map<Integer, Double> generalIncome = financePaymentInterface.getMonthlyGeneralIncomePerYear();
        Map<Integer, Double> expense = financePaymentInterface.getMonthlyExpensePerYear();
        IncomeAndExpenseChanges changes =new IncomeAndExpenseChanges();
        changes.setIncome(generalIncome);
        changes.setExpense(expense);
        return changes;

    }

    @GetMapping("/all-pharmacy-income")
    public PharmacyData getAllPharmacyIncomes() {
        PharmacyData response = new PharmacyData();
        IncomeChanges pharmacy = billingPaymentInterface.getPharmacyIncome();
        response.setPharmacyIncome(pharmacy.getTodayIncome());
        response.setPharmacyPercentageChangeFromYesterday(pharmacy.getPercentageChangeFromYesterday());
        IncomeChanges purchaseAmount = billingPaymentInterface.totalAmountToPurchase();
        response.setMedicinePurchase(purchaseAmount.getTodayIncome());
        response.setPurchasePercentageChangeFromYesterday(purchaseAmount.getPercentageChangeFromYesterday());
        Double badStock = billingPaymentInterface.totalBadStock();
        response.setTotalBadStock(badStock);
        Double medicineStock = billingPaymentInterface.totalMedicineStock();
        response.setTotalMedicineStock(medicineStock);
        return response;
    }

    @GetMapping("/monthly-pharmacySale")
    public Map<Integer, Double> getPharmacyMonthlySalePerYear(){
        return billingPaymentInterface.getPharmacyMonthlySalePerYear();
    }

    @GetMapping("/Common-Medicines")
    public List<Object> getCommonlyUsedMedicines(){
        return billingPaymentInterface.getCommonlyUsedMedicines();
    }

    @GetMapping("/opdOrIpd/billing/{id}")
    public TotalBillSummary getOpdOrIpdDashboard(@PathVariable String id){
        TotalBillSummary.BillSummary pathology=billingPaymentInterface.getPathologyOpdAndIpdPayment(id);
        TotalBillSummary.BillSummary pharmacy =billingPaymentInterface.getPharmacyOpdAndIpdPayment(id);
        TotalBillSummary.BillSummary radiology=billingPaymentInterface.getRadiologyOpdAndIpdPayment(id);
        TotalBillSummary.BillSummary blood=bloodBankPaymentInterface.getBloodIssueOpdAndIpdPayment(id);
        TotalBillSummary.BillSummary ambulance=ambulancePaymentInterface.getAmbulanceOpdAndIpdPayment(id);
        TotalBillSummary summary=new TotalBillSummary();
        summary.setAmbulanceBilling(ambulance);
        summary.setPathologyBilling(pathology);
        summary.setPharmacyBilling(pharmacy);
        summary.setRadiologyBilling(radiology);
        summary.setBloodBankBilling(blood);
        return summary;
    }

    @GetMapping("/medical-history/{id}")
    public MedicalHistoryDetails getOpdMedicalHistoryDashboard(@PathVariable String id){
        MedicalHistoryDetails response = new MedicalHistoryDetails();
        response.setRadiologyHistory(billingPaymentInterface.getMedicalHistoryRadiology(id));
        response.setPathologyHistory(billingPaymentInterface.getMedicalHistoryPathology(id));
        response.setPharmacyHistory(billingPaymentInterface.getMedicalHistoryPharmacy(id));
        response.setBloodBankHistory(bloodBankPaymentInterface.getMedicalHistoryBloodBank(id));
        response.setAmbulanceHistory(ambulancePaymentInterface.getMedicalHistoryAmbulance(id));
        response.setOpdHistory(opdPaymentInterface.getMedicalHistoryOpdId(id));
        return response;

    }

    @GetMapping("/all-weekly-incomes")
    public IncomeWeeklyResponse getAllWeeklyIncomes() {
        IncomeWeeklyResponse response = new IncomeWeeklyResponse();
        IncomeChanges ipd = ipdPaymentInterface.getIPDIncreaseWeeklyIncome();
        response.setIpdIncome(ipd.getTodayIncome());
        response.setIpdPercentageChangeFromWeekly(ipd.getPercentageChangeFromYesterday());
        IncomeChanges opd = opdPaymentInterface.getOPDIncreaseWeeklyIncome();
        response.setOpdIncome(opd.getTodayIncome());
        response.setOpdPercentageChangeFromWeekly(opd.getPercentageChangeFromYesterday());
        IncomeChanges pharmacy = billingPaymentInterface.getPharmacyIncreaseWeeklyIncome();
        response.setPharmacyIncome(pharmacy.getTodayIncome());
        response.setPharmacyPercentageChangeFromWeekly(pharmacy.getPercentageChangeFromYesterday());
        IncomeChanges radiology = billingPaymentInterface.getRadiologyIncreaseWeeklyIncome();
        response.setRadiologyIncome(radiology.getTodayIncome());
        response.setRadiologyPercentageChangeFromWeekly(radiology.getPercentageChangeFromYesterday());
        IncomeChanges pathology = billingPaymentInterface.getPathologyIncreaseWeeklyIncome();
        response.setPathologyIncome(pathology.getTodayIncome());
        response.setPathologyPercentageChangeFromWeekly(pathology.getPercentageChangeFromYesterday());
        IncomeChanges bloodBank = bloodBankPaymentInterface.getBloodBankIncreaseWeeklyIncome();
        response.setBloodBankIncome(bloodBank.getTodayIncome());
        response.setBloodBankPercentageChangeFromWeekly(bloodBank.getPercentageChangeFromYesterday());
        IncomeChanges ambulance = ambulancePaymentInterface.getAmbulanceIncreaseWeeklyIncome();
        response.setAmbulanceIncome(ambulance.getTodayIncome());
        response.setAmbulancePercentageChangeFromWeekly(ambulance.getPercentageChangeFromYesterday());
        IncomeChanges general = financePaymentInterface.getIncreaseWeeklyIncome();
        response.setGeneralIncome(general.getTodayIncome());
        response.setGeneralPercentageChangeFromWeekly(general.getPercentageChangeFromYesterday());
        IncomeChanges expense = financePaymentInterface.getIncreaseWeeklyExpense();
        response.setExpense(expense.getTodayIncome());
        response.setExpensePercentageChangeFromWeekly(expense.getPercentageChangeFromYesterday());
        return response;
    }
    @GetMapping("/all-monthly-incomes")
    public IncomeMonthlyResponse getAllMonthlyIncomes() {
        IncomeMonthlyResponse response = new IncomeMonthlyResponse();
        IncomeChanges ipd = ipdPaymentInterface.getIPDIncreaseMonthlyIncome();
        response.setIpdIncome(ipd.getTodayIncome());
        response.setIpdPercentageChangeFromMonthly(ipd.getPercentageChangeFromYesterday());
        IncomeChanges opd = opdPaymentInterface.getOPDIncreaseMonthlyIncome();
        response.setOpdIncome(opd.getTodayIncome());
        response.setOpdPercentageChangeFromMonthly(opd.getPercentageChangeFromYesterday());
        IncomeChanges pharmacy = billingPaymentInterface.getPharmacyIncreaseMonthlyIncome();
        response.setPharmacyIncome(pharmacy.getTodayIncome());
        response.setPharmacyPercentageChangeFromMonthly(pharmacy.getPercentageChangeFromYesterday());
        IncomeChanges radiology = billingPaymentInterface.getRadiologyIncreaseMonthlyIncome();
        response.setRadiologyIncome(radiology.getTodayIncome());
        response.setRadiologyPercentageChangeFromMonthly(radiology.getPercentageChangeFromYesterday());
        IncomeChanges pathology = billingPaymentInterface.getPathologyIncreaseMonthlyIncome();
        response.setPathologyIncome(pathology.getTodayIncome());
        response.setPathologyPercentageChangeFromMonthly(pathology.getPercentageChangeFromYesterday());
        IncomeChanges bloodBank = bloodBankPaymentInterface.getBloodBankIncreaseMonthlyIncome();
        response.setBloodBankIncome(bloodBank.getTodayIncome());
        response.setBloodBankPercentageChangeFromMonthly(bloodBank.getPercentageChangeFromYesterday());
        IncomeChanges ambulance = ambulancePaymentInterface.getAmbulanceIncreaseMonthlyIncome();
        response.setAmbulanceIncome(ambulance.getTodayIncome());
        response.setAmbulancePercentageChangeFromMonthly(ambulance.getPercentageChangeFromYesterday());
        IncomeChanges general = financePaymentInterface.getIncreaseMonthlyIncome();
        response.setGeneralIncome(general.getTodayIncome());
        response.setGeneralPercentageChangeFromMonthly(general.getPercentageChangeFromYesterday());
        IncomeChanges expense = financePaymentInterface.getIncreaseMonthlyExpense();
        response.setExpense(expense.getTodayIncome());
        response.setExpensePercentageChangeFromMonthly(expense.getPercentageChangeFromYesterday());
        return response;
    }

    @GetMapping("/all-yearly-incomes")
    public IncomeYearlyResponse getAllYearlyIncomes() {
        IncomeYearlyResponse response = new IncomeYearlyResponse();
        IncomeChanges ipd = ipdPaymentInterface.getIPDIncreaseYearlyIncome();
        response.setIpdIncome(ipd.getTodayIncome());
        response.setIpdPercentageChangeFromYearly(ipd.getPercentageChangeFromYesterday());
        IncomeChanges opd = opdPaymentInterface.getOPDIncreaseYearlyIncome();
        response.setOpdIncome(opd.getTodayIncome());
        response.setOpdPercentageChangeFromYearly(opd.getPercentageChangeFromYesterday());
        IncomeChanges pharmacy = billingPaymentInterface.getPharmacyIncreaseYearlyIncome();
        response.setPharmacyIncome(pharmacy.getTodayIncome());
        response.setPharmacyPercentageChangeFromYearly(pharmacy.getPercentageChangeFromYesterday());
        IncomeChanges radiology = billingPaymentInterface.getRadiologyIncreaseYearlyIncome();
        response.setRadiologyIncome(radiology.getTodayIncome());
        response.setRadiologyPercentageChangeFromYearly(radiology.getPercentageChangeFromYesterday());
        IncomeChanges pathology = billingPaymentInterface.getPathologyIncreaseYearlyIncome();
        response.setPathologyIncome(pathology.getTodayIncome());
        response.setPathologyPercentageChangeFromYearly(pathology.getPercentageChangeFromYesterday());
        IncomeChanges bloodBank = bloodBankPaymentInterface.getBloodBankIncreaseYearlyIncome();
        response.setBloodBankIncome(bloodBank.getTodayIncome());
        response.setBloodBankPercentageChangeFromYearly(bloodBank.getPercentageChangeFromYesterday());
        IncomeChanges ambulance = ambulancePaymentInterface.getAmbulanceIncreaseYearlyIncome();
        response.setAmbulanceIncome(ambulance.getTodayIncome());
        response.setAmbulancePercentageChangeFromYearly(ambulance.getPercentageChangeFromYesterday());
        IncomeChanges general = financePaymentInterface.getIncreaseYearlyIncome();
        response.setGeneralIncome(general.getTodayIncome());
        response.setGeneralPercentageChangeFromYearly(general.getPercentageChangeFromYesterday());
        IncomeChanges expense = financePaymentInterface.getIncreaseYearlyExpense();
        response.setExpense(expense.getTodayIncome());
        response.setExpensePercentageChangeFromYearly(expense.getPercentageChangeFromYesterday());
        return response;
    }

}

