import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "../pages/Authentication/Login";
import MainLayout from "../pages/Main-layout/Main-Layout";
import Dashboard from "../pages/Dashboard/Dashboard";
import CreatePatient from "../pages/Patient/CreatePatient";
import PatientDataTable from "../pages/Patient/PatientDatatable";
import EditPatient from "../pages/Patient/EditPatient";
import CreateAppointment from "../pages/Appointment/CreateAppointment";
import EditAppointment from "../pages/Appointment/EditAppointment";
import ViewScheduledAppointment from "../pages/Doctor/DoctorScheduledAppointment/ViewScheduledAppointment";
import BedGroupDataTable from "../pages/IPD/BedGroup/BedGroupDataTable";
import InPatientDataTable from "../pages/IPD/InPatient/InPatientDatatable";
import IPDDischargedPatientList from "../pages/IPD/InPatient/IPDDischargedPatientList";
import AddPatient from "../pages/IPD/InPatient/AddPatient";
import IpdContainer from "../pages/IPD/InPatient/IpdContainer";
import PathologyDataTable from "../pages/Pathology/PathologyDatatable";
import OutPatient from "../pages/OPD/OutPatient";
import OpdContainer from "../pages/OPD/OutPatient/OpdContainer";
import AddOpdPatient from "../pages/OPD/OutPatient/AddOpdPatient";
import OpdPatientViewContainer from "../pages/OPD/OutPatient/OpdPatientViewContainer";
import OpdBill from "../pages/OPD/OutPatient/OpdContainer/Visits/OpdBill";
import Billing from "../pages/Billing";
import AppointmentBilling from "../pages/Billing/AppointmentBilling";
import OpdBilling from "../pages/Billing/OpdBilling";
import Appointment from "../pages/Appointment";
import PatientProfile from "../pages/Billing/OpdBilling/PatientProfile";
import BillingThroughCaseId from "../pages/Billing/BillingThroughCaseId";
import MedicinesStock from "../pages/Pharmacy/MedicinesStock";
import ImportMedicine from "../pages/Pharmacy/ImportMedicine";
import MedicinePurchaseList from "../pages/Pharmacy/MedicinePurchaseList";
import PathologyTest from "../pages/Pathology/PathologyTest";
import RadiologyDataTable from "../pages/Radiology/RadiologyDatatable";
import RadiologyTest from "../pages/Radiology/RadiologyTest";
import BloodBankStatus from "../pages/BloodBank/BloodBankStatus";
import DonorDetails from "../pages/BloodBank/DonorDetails";
import BloodIssueDetails from "../pages/BloodBank/BloodIssueDetails";
import ComponentList from "../pages/BloodBank/ComponentList";
import Pharmacy from "../pages/Pharmacy";
import BillSummary from "../pages/Billing/BillSummary";
import ManualPrescription from "../pages/IPD/InPatient/IpdContainer/Prescription/ManualPrescription";
import Ambulance from "../pages/Ambulance/Ambulance";
import AmbulanceList from "../pages/Ambulance/AmbulanceList";
import AddAmbulanceCall from "../pages/Ambulance/AddAmbulanceCall";
import AntenatalFindingsMain from '../pages/AntenatalFindings/AntenalFindingsMain'
import StaffList from "../pages/HumanResource/StaffList";
import AddEmployee from "../pages/HumanResource/AddEmployee";
import StaffAtttendance from "../pages/HumanResource/StaffAttendance";
import LeaveApproval from "../pages/HumanResource/LeaveApproval";
import PatientCredentials from "../pages/HumanResource/PatientCredentials";
import ReferralPersonList from "../pages/Referral/RefferalPersonList";
import ReferralPaymentList from "../pages/Referral/ReferralPaymentList";
import AddLeaveApproval from "../pages/HumanResource/AddLeaveApproval";
import Income from "../pages/Finance/Income";
import AddAmbulance from "../pages/Ambulance/AddAmbulance";
import AddCalendar from "../pages/AnnualCalender/AddCalender";
import AnnualCalender from "../pages/AnnualCalender/AnnualCalender";
import AddBirthRecord from "../pages/Birth&Death/AddBirthRecord";
import AddDeathRecord from "../pages/Birth&Death/AddDeathRecord";
import BirthRecord from "../pages/Birth&Death/BirthRecord";
import DeathRecord from "../pages/Birth&Death/DeathRecord";
import PatientIDCard from "../pages/Certificate/PatientIDCard";
import StaffIDCard from "../pages/Certificate/StaffIDCard";
import ContentShareList from "../pages/DownloadCenter/ContentShareList";
import ContentType from "../pages/DownloadCenter/ContentType";
import AddExpense from "../pages/Finance/AddExpense";
import AddIncome from "../pages/Finance/AddIncome";
import Expense from "../pages/Finance/Expense";
import AddCallLog from "../pages/FrontOffice/AddCallLogs";
import AddComplain from "../pages/FrontOffice/AddComplain";
import AddVisitor from "../pages/FrontOffice/AddVisitor";
import ComplainList from "../pages/FrontOffice/ComplaintList";
import PhoneCallLogList from "../pages/FrontOffice/PhoneCallLogList";
import VisitorList from "../pages/FrontOffice/VisitorList";
import AddMedicineDetails from "../pages/HumanResource/AddMedicineDetails";
import AddAttendance from "../pages/HumanResource/AddAttendance";
import PayRollList from "../pages/HumanResource/PayRollList";
import AddIssueItem from "../pages/Inventory/AddIssueItem";
import AddItems from "../pages/Inventory/AddItems";
import AddItemStock from "../pages/Inventory/AddItemStock";
import Inventory from "../pages/Inventory/Inventory";
import IssueItemList from "../pages/Inventory/IssueItemList";
import ItemList from "../pages/Inventory/ItemList";
import AddConsultation from "../pages/LiveConsultation/AddConsultation";
import AddLiveMeeting from "../pages/LiveConsultation/AddLiveMeeting";
import LiveConsultation from "../pages/LiveConsultation/LiveConsultation";
import LiveMeetings from "../pages/LiveConsultation/LiveMeetings";
import AddReferralPayment from "../pages/Referral/AddAReferralPayment";
import AddReferralPerson from "../pages/Referral/AddReferralPerson";
import AmbulanceMain from "../pages/Reports/Ambulance/AmbulanceMain";
import AppointmentMain from "../pages/Reports/Appointment/AppointmentMain";
import BirthDeathReportMain from "../pages/Reports/BirthDeath/BirthDeathReportMain";
import BloodBankMain from "../pages/Reports/BloodBank/BloodBankMain";
import FinanceMain from "../pages/Reports/Finance/FinanceMain";
import HumanResource from "../pages/Reports/HumanResource/HumanResourceMain";
import InventoryMain from "../pages/Reports/Inventory/InventoryMain";
import IPDMain from "../pages/Reports/IPD/IPDMain";
import LiveConsultationMain from "../pages/Reports/LiveConsultation/LiveConsultationMain";
import LogMain from "../pages/Reports/Log/LogMain";
import OpdMain from "../pages/Reports/OPD/OpdMain";
import OTMain from "../pages/Reports/OT/OTMain";
import PathologyMain from "../pages/Reports/Pathology/PathologyMain";
import PatientReportMain from "../pages/Reports/Patient/PatientReportMain";
import PharmacyMain from "../pages/Reports/Pharmacy/PharmacyMain";
import RadiologyMain from "../pages/Reports/Radiology/RadiologyMain";
import TPAMain from "../pages/Reports/TPA/TPAMain";
import AddBed from "../pages/Setup/Bed/AddBed";
import AddBedType from "../pages/Setup/Bed/AddBedType";
import AddFloor from "../pages/Setup/Bed/AddFloor";
import BedMain from "../pages/Setup/Bed/BedMain";
import AddComplainType from "../pages/Setup/FrontOffice/AddComplainType";
import AddPurpose from "../pages/Setup/FrontOffice/AddPurpose";
import AddSource from "../pages/Setup/FrontOffice/AddSource";
import FrontOfficeMain from "../pages/Setup/FrontOffice/FrontOfficeMain";
import AddChargeCategory from "../pages/Setup/HospitalCharges/AddChargeCategory";
import AddChargeType from "../pages/Setup/HospitalCharges/AddChargeType";
import AddHospitalCharges from "../pages/Setup/HospitalCharges/AddHospitalCharges";
import AddTaxCategory from "../pages/Setup/HospitalCharges/AddTaxCategory";
import AddUnitType from "../pages/Setup/HospitalCharges/AddUnitType";
import ChargeCategoryList from "../pages/Setup/HospitalCharges/ChargeCategoryList";
import HospitalMain from "../pages/Setup/HospitalCharges/HospitalMain";
import TaxCategoryList from "../pages/Setup/HospitalCharges/TaxCategoryList";
import AddCategory from "../pages/Setup/Operations/AddCategory";
import AddOperation from "../pages/Setup/Operations/AddOperation";
import OperationCategoryList from "../pages/Setup/Operations/OperationCategoryList";
import OperationList from "../pages/Setup/Operations/OperationList";
import OperationMain from "../pages/Setup/Operations/OperationMain";
import PatientList from "../pages/Setup/Patient/PatientList";
import SettingsMain from "../pages/Setup/Settings/SettingMain";
import AddTPA from "../pages/TPAManagement/AddTPA";
import TpaManagement from "../pages/TPAManagement/TpaManagement";
import AddPatientSetUp from '../pages/Setup/Patient/AddPatient';
import Certificate from "../pages/Certificate/Certificate";
import ComponentIssueDetails from "../pages/BloodBank/ComponentIssueDetails";
import PathologyBilling from "../pages/Billing/PathologyBilling/PathologyBilling";
import BloodIssueComponentBilling from "../pages/Billing/BloodIssueComponentBilling/BloodIssueComponentBilling";
import BloodIssueBilling from "../pages/Billing/BloodIssueBilling/BloodIssueBilling";
import RadiologyBilling from "../pages/Billing/RadiologyBilling/RadiologyBilling";
// import Calender from "../pages/MyProfiles/Calendar/Calendar";
import MyProfiles from "../pages/MyProfiles";
import PharmacyMainSetup from "../pages/Setup/Pharmacy/PharmacyMain"
import PathologyMainSetup from "../pages/Setup/Pathology/PathologyMain"
import RadiologyMainSetup from "../pages/Setup/Radiology/RadiologyMain"
import BloadBankMainSetup from "../pages/Setup/BloodBank/BloadBankMain"
import SymptomsMain from "../pages/Setup/Symptoms/SymptomsMain"
import FindingsMainSetup from "../pages/Setup/Finding/FindingsMain"
import VitalMainSetup from "../pages/Setup/Vital/VitalList"
import ZoomSettingsSetup from "../pages/Setup/ZoomSettings/ZoomSettings"
import Financemain from "../pages/Setup/Finance/FinanceMain"
import HumanResourceMainSetup from "../pages/Setup/HumanResource/HumanResourcemain"
import ReferralMainSetup from "../pages/Setup/Referral/ReferralMain"
import AppointmentMainSetup from "../pages/Setup/Appointment/AppointmentMain"
import InventoryMainSetup from "../pages/Setup/Inventory/InventoryMain"
import AddPathologyCategory from "../pages/Setup/Pathology/AddPathologyCategory"
import AddPathologyParameter from "../pages/Setup/Pathology/AddPathologyParameter"
import AddUnitsPathology from "../pages/Setup/Pathology/AddUnits"
import AddRadiologyCategory from "../pages/Setup/Radiology/AddRadiologyCategory"
import AddRadiologyUnits from "../pages/Setup/Radiology/AddRadiologyUnits"
import AddRadiologyParameter from "../pages/Setup/Radiology/AddRadiologyParameter"
import AddMedicineCategory from "../pages/Setup/Pharmacy/AddCategory"
import AddPharmacySupplier from "../pages/Setup/Pharmacy/AddSupplier"
import AddDosageInterval from "../pages/Setup/Pharmacy/AddDosageInterval"
import AddMedicineDosage from "../pages/Setup/Pharmacy/AddMedicineDosage"
import AddDosageDuration from "../pages/Setup/Pharmacy/AddDosageDuration"
import AddMedicineGroup from "../pages/Setup/Pharmacy/AddMedicineGroup"
import AddBloodProducts from "../pages/Setup/BloodBank/AddBloodProducts"
import AddSymptomsHead from "../pages/Setup/Symptoms/AddSymptomsHead"
import AddSymptomsType from "../pages/Setup/Symptoms/AddSymptomsType"
import AddVitalForm from "../pages/Setup/Vital/AddVitalForm"
import AddCategoryFinding from "../pages/Setup/Finding/AddCategoryFindings"
import Chat from "../pages/Chat"
import PharmacyDashboard from "../pages/Pharmacy/Dashboard/PharmacyDashboard";
import AvailableTimeSlot from "../pages/AvailableTimeSheet/AvailableTimeSlot";
import AvailableTimeSheet from "../pages/AvailableTimeSheet/AvailableTimeSheet";
import EditBirthRecord from "../pages/Birth&Death/EditBirthRecord";
import EditDeathRecord from "../pages/Birth&Death/EditDeathRecord";
import EditIncome from "../pages/Finance/EditIncome";
import EditExpense from "../pages/Finance/EditExpense";
import EditTpa from "../pages/TPAManagement/EditTpa";
import EditAnualCalender from "../pages/AnnualCalender/EditAnnualCalender";
import EditReferralPerson from "../pages/Referral/EditReferralPerson";
import EditItem from "../pages/Inventory/EditItems";
import MyLeave from "../pages/HumanResource/MyLeave";
import AddLeave from "../pages/HumanResource/AddLeave";
import GeneratePayroll from "../pages/HumanResource/GeneratePayroll";
import EditEmployee from "../pages/HumanResource/EditEmployee";
import EditFloor from "../pages/Setup/Bed/EditFloor";
import AddBedGroup from "../pages/Setup/Bed/AddBedGroup";
import EditBedGroup from "../pages/Setup/Bed/EditBedGroup";
import EditBedType from "../pages/Setup/Bed/EditBedType";
import EditBed from "../pages/Setup/Bed/EditBed";
import ApproveStaffDetails from "../pages/Setup/HumanResource/ApproveStaffDetails";
import EditItemStock from "../pages/Inventory/EditItemStock";
import EditRadiologyCategory from "../pages/Setup/Radiology/EditRadiologyCategory";
import EditRadiologyParameter from "../pages/Setup/Radiology/EditRadiologyParameter";
import EditBloodProducts from "../pages/Setup/BloodBank/EditBloodProduct";
import AddLeaveType from "../pages/Setup/HumanResource/AddLeaveType";
import AddDepartment from "../pages/Setup/HumanResource/AddDepartment";
import AddDesignation from "../pages/Setup/HumanResource/AddDesignation";
import AddSpecialist from "../pages/Setup/HumanResource/AddSpecialist";
import AddScope from "../pages/Setup/HumanResource/AddScope";
import EditScope from "../pages/Setup/HumanResource/EditScope";
import AddRole from "../pages/Setup/HumanResource/AddRole";
import EditRole from "../pages/Setup/HumanResource/EditRole";
import EditMedicineCategory from "../pages/Setup/Pharmacy/EditMedicineCategory";
import AddIncomeHead from "../pages/Setup/Finance/AddIncomeHead";
import AddExpenceHead from "../pages/Setup/Finance/AddExpenceHead";
import EditChargeCategory from "../pages/Setup/HospitalCharges/EditChargeCategory";
import EditChargeType from "../pages/Setup/HospitalCharges/EditChargeType";
import EditHospitalCharges from "../pages/Setup/HospitalCharges/EditHospitalCharges";
import EditTaxCategory from "../pages/Setup/HospitalCharges/EditTaxCategory";
import EditUnitType from "../pages/Setup/HospitalCharges/EditUnitType";
import AddReferralCommission from "../pages/Setup/Referral/AddReferralCommission";
import AddReferralCategory from "../pages/Setup/Referral/AddReferralCategory";
import AddSupplier from "../pages/Setup/Inventory/AddSupplier";
import AddStore from "../pages/Setup/Inventory/AddStore";
import AddItemCategory from "../pages/Setup/Inventory/AddItemCategory";
import EditReferralCategory from "../pages/Setup/Referral/EditReferralCategory";
import EditReferralCommission from "../pages/Setup/Referral/EditCommission";
import EditItemCategory from "../pages/Setup/Inventory/EditItemCategory";
import EditStore from "../pages/Setup/Inventory/EditStore";
import EditSupplier from "../pages/Setup/Inventory/EditSupplier";
import EditExpenceHead from "../pages/Setup/Finance/EditExpenceHead";
import EditIncomeHead from "../pages/Setup/Finance/EditIncomeHead";
import EditPathologyCategory from "../pages/Setup/Pathology/EditPathologyCategory";
import EditPathologyParameter from "../pages/Setup/Pathology/EditPathologyParameter";
import EditPathologyUnit from "../pages/Setup/Pathology/EditPathologyUnits";
import EditRadiologyUnits from "../pages/Setup/Radiology/EditRadiologyUnit";
import EditSpecialist from "../pages/Setup/HumanResource/EditSpecialist";
import EditDesignation from "../pages/Setup/HumanResource/EditDesignation";
import EditDepartment from "../pages/Setup/HumanResource/EditDepartment";
import EditLeaveType from "../pages/Setup/HumanResource/EditLeaveType";
import AddPharmacyUnits from "../pages/Setup/Pharmacy/AddUnits";
import EditPharmacyUnit from "../pages/Setup/Pharmacy/EditPharmacyUnit";
import EditPharmacySupplier from "../pages/Setup/Pharmacy/EditSupplier";
import EditMedicineDosage from "../pages/Setup/Pharmacy/EditMedicineDosage";
import EditDosageInterval from "../pages/Setup/Pharmacy/EditDosageInterval";
import EditDosageDuration from "../pages/Setup/Pharmacy/EditDosageDuration";
import AddCompany from "../pages/Setup/Pharmacy/AddCompany";
import EditCompany from "../pages/Setup/Pharmacy/EditCompany";
import EditMedicineGroup from "../pages/Setup/Pharmacy/EditMedicineGroup";
import EditSource from "../pages/Setup/FrontOffice/EditSource";
import EditPurpose from "../pages/Setup/FrontOffice/EditPurpose";
import EditComplainType from "../pages/Setup/FrontOffice/EditComplainType";
import ViewRadiologyReport from "../pages/Radiology/ViewRadiologyReport";
import ViewAllNotification from "../Layouts/ViewAllNotification";
import LowStockMedicineList from "../pages/Pharmacy/LowStockMedicineList";
import ViewOpdIncome from "../pages/Dashboard/ViewAllIncome/ViewOpdIncome";
import ViewIpdIncome from "../pages/Dashboard/ViewAllIncome/ViewIpdIncome";
import ViewPharmacyIncome from "../pages/Dashboard/ViewAllIncome/ViewPharmacyIncome";
import ViewPathologyIncome from "../pages/Dashboard/ViewAllIncome/ViewPathologyIncome";
import ViewRadiologyIncome from "../pages/Dashboard/ViewAllIncome/ViewRadiologyIncome";
import ViewAmbulanceIncome from "../pages/Dashboard/ViewAllIncome/ViewAmbulanceIncome";
import ViewTotalIncome from "../pages/Dashboard/ViewAllIncome/ViewTotalIncome";
import ViewBloodBankIncome from "../pages/Dashboard/ViewAllIncome/ViewBloodBankIncome";
import ViewAllBloodIssueIncome from "../pages/Dashboard/ViewAllIncome/ViewAllBloodIssueIncome";
import BadStockDataTable from "../pages/Pharmacy/BadStockDataTable";
import EditComplainForm from "../pages/FrontOffice/EditComplain";
import EditVisitor from "../pages/FrontOffice/EditVisitor";
import EditCallLog from "../pages/FrontOffice/EditCallLogs";
import ViewInternalJobs from "../pages/InternalJob/ViewInternalJobs";
import AddInternalJobs from "../pages/InternalJob/AddInternalJobs";
import ViewScheduledOperations from "../pages/OTmanagement/ViewScheduledOperations";
import CreateCertificateTemplate from "../pages/Certificate/CreateCertificateTemplate";
import CertificateTemplateDataTable from "../pages/Certificate/CertificateTemplateDataTable";
import FlipCard from "../pages/Patient/PatientIdCard";
import EditCertificateTemplate from "../pages/Certificate/EditCertificateTemplate";
import CreatePatientIdCard from "../pages/Certificate/CreatePatientIdCard";
import CreateStaffIdTemplateCard from "../pages/Certificate/CreateStaffIdTemplate";
import GenerateCertificate from "../pages/Certificate/GenerateCertificate";
import GenerateIdCardTemplate from "../pages/Certificate/GenerateIdCardTemplate";
import GenerateStaffID from "../pages/Certificate/GenerateStaffID";
import IpdCommissionDataTabe from "../pages/Commission/IPD-Commission/IpdCommissionDataTabe";
import PharmacyCommission from "../pages/Commission/Pharmacy-Commission/PharmacyCommission";
import PathologyCommission from "../pages/Commission/Pathology-Commission/PathologyCommission";
import RadiologyCommission from "../pages/Commission/Radiology-Commission/RadiologyCommission";
import MedicineMovingStatus from "../pages/Pharmacy/MedicineMovingDetails";
import MedicineMovingDetails from "../pages/Pharmacy/MedicineMovingDetails";
import MedicineMovingCompanyDetails from "../pages/Pharmacy/MedicineMovingCompanyDetails";
import MonthlyReportMain from "../pages/Reports/Finance/MonthlyReportMain";
import SalarySlipDataTable from "../pages/HumanResource/SalarySlipDataTable";
import MedicineUpload from "../pages/Pharmacy/MedicineUpload";
import AdditionalFinanceMain from "../pages/Reports/AdditionalFinance/AdditionalFinanceMain";
import LeaveSummaryDataTable from "../pages/HumanResource/LeaveSummaryDataTable";
import DownloadCertificateTemplate from "../pages/Certificate/DownloadCertificate";

const AllRouter = () => {
    return <>
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/main" element={<MainLayout />} >
                    <Route path="" element={<Dashboard />} />
                    <Route path="ViewScheduledOperations" element={<ViewScheduledOperations />} />
                    <Route path="ViewInternalJobs" element={<ViewInternalJobs />} />
                    <Route path="AddInternalJobs" element={<AddInternalJobs />} />
                    <Route path="opd-income" element={<ViewOpdIncome />} />
                    <Route path="ipd-income" element={<ViewIpdIncome />} />
                    <Route path="pharmacy-income" element={<ViewPharmacyIncome />} />
                    <Route path="pathology-income" element={<ViewPathologyIncome />} />
                    <Route path="radiology-income" element={<ViewRadiologyIncome />} />
                    <Route path="ambulance-income" element={<ViewAmbulanceIncome />} />
                    <Route path="view-total-income" element={<ViewTotalIncome />} />
                    <Route path="bloodbank-income" element={<ViewBloodBankIncome />} />
                    <Route path="issue-blood-income" element={<ViewAllBloodIssueIncome />} />
                    <Route path="view-all-notification" element={<ViewAllNotification />} />
                    <Route path="create-patient" element={<CreatePatient />} />
                    <Route path="patient-datatable" element={<PatientDataTable />} />
                    <Route path="patient-idcard" element={<FlipCard />} />
                    <Route path="leaveApproval" element={<LeaveApproval />} />
                    <Route path="generatePayroll" element={<GeneratePayroll />} />
                    <Route path="addLeave" element={<AddLeave />} />
                    <Route path="myLeave" element={<MyLeave />} />
                    <Route path="edit-patient" element={<EditPatient />} />
                    <Route path="add-leave-approval" element={<AddLeaveApproval />} />
                    <Route path="create-appointment" element={<CreateAppointment />} />
                    <Route path="appointment-datatable" element={<Appointment />} />
                    <Route path="edit-appointment" element={<EditAppointment />} />
                    <Route path="available-time-slot" element={<AvailableTimeSlot />} />
                    <Route path="available-time-sheet" element={<AvailableTimeSheet />} />
                    <Route path="bed-group-datatable" element={<BedGroupDataTable />} />
                    <Route path="add-attendance" element={<AddAttendance />} />
                    <Route path="view-scheduled-appointment" element={<ViewScheduledAppointment />} />
                    <Route path="inPatient-datatable" element={<InPatientDataTable />} />
                    <Route path="ipd-discharged-patient-list" element={<IPDDischargedPatientList />} />
                    <Route path="add-patient" element={<AddPatient />} />
                    <Route path="ipd-overview" element={<IpdContainer />} />
                    <Route path="ipd-commission" element={<IpdCommissionDataTabe />} />,
                    <Route path="radiology-commission" element={<RadiologyCommission />} />,
                    <Route path="pharmacy-commission" element={<PharmacyCommission />} />,
                    <Route path="Pathology-commission" element={<PathologyCommission />} />,

                    <Route path="pathology-datatable" element={<PathologyDataTable />} />
                    <Route path="OPD" element={<OutPatient />} />
                    <Route path="OPD-overview" element={<OpdContainer />} />
                    <Route path="add-opd-patient" element={<AddOpdPatient />} />
                    <Route path="OPD-patient-overview" element={<OpdPatientViewContainer />} />
                    <Route path="OPD-Bill" element={<OpdBill />} />
                    <Route path="billing" element={<Billing />} />
                    <Route path="appointment-billing" element={<AppointmentBilling />} />
                    <Route path="opd-billing" element={<OpdBilling />} />
                    <Route path="pathology-billing" element={<PathologyBilling />} />
                    <Route path="radiology-billing" element={<RadiologyBilling />} />
                    <Route path="blood-issue-billing" element={<BloodIssueBilling />} />
                    <Route path="blood-issue-component-billing" element={<BloodIssueComponentBilling />} />
                    <Route path="patient-profile" element={<PatientProfile />} />
                    <Route path="billing-by-caseId" element={<BillingThroughCaseId />} />
                    <Route path="pharmacy-datatable" element={<Pharmacy />} />
                    <Route path="medicine-stock" element={<MedicinesStock />} />
                    <Route path="payroll-list" element={<PayRollList />} />
                    <Route path="import-medicines" element={<ImportMedicine />} />
                    <Route path="purchase-list" element={<MedicinePurchaseList />} />
                    <Route path="pathology-test" element={<PathologyTest />} />
                    <Route path="radiology-datatable" element={<RadiologyDataTable />} />
                    <Route path="radiology-test" element={<RadiologyTest />} />
                    <Route path="blood-bank-status" element={<BloodBankStatus />} />
                    <Route path="blood-bank-donor-details" element={<DonorDetails />} />
                    <Route path="blood-issue-details" element={<BloodIssueDetails />} />
                    <Route path="component-issue-details" element={<ComponentIssueDetails />} />
                    <Route path="component-list" element={<ComponentList />} />
                    <Route path="addCalender" element={<AddCalendar />} />
                    <Route path="bill-summary" element={<BillSummary />} />
                    <Route path="manual-prescription" element={<ManualPrescription />} />
                    <Route path="ambulance" element={<Ambulance />} />
                    <Route path="ambulanceList" element={<AmbulanceList />} />
                    <Route path="addAmulanceCall" element={<AddAmbulanceCall />} />
                    <Route path="stafflist" element={<StaffList />} />
                    <Route path="addEmployee" element={<AddEmployee />} />
                    <Route path="editEmployee" element={<EditEmployee />} />
                    <Route path="staffAttendance" element={<StaffAtttendance />} />
                    <Route path="SalarySlipDataTable" element={<SalarySlipDataTable />} />
                    <Route path="addPatient" element={<AddPatient />} />
                    <Route path="patientCredentials" element={<PatientCredentials />} />
                    <Route path="ReferralPersonList" element={<ReferralPersonList />} />
                    <Route path="referralPaymentList" element={<ReferralPaymentList />} />
                    <Route path="leaveRequest" element={<AddLeaveApproval />} />
                    <Route path="income" element={<Income />} />
                    <Route path="expense" element={<Expense />} />,
                    <Route path="addIncome" element={<AddIncome />} />,
                    <Route path="addExpense" element={<AddExpense />} />,
                    <Route path="editIncome" element={<EditIncome />} />,
                    <Route path="editExpence" element={<EditExpense />} />,
                    <Route path="annualCalender" element={<AnnualCalender />} />,
                    <Route path="editAnualCalender" element={<EditAnualCalender />} />,
                    <Route path="addReferralPerson" element={<AddReferralPerson />} />,
                    <Route path="editReferralPerson" element={<EditReferralPerson />} />,
                    <Route path="addReferralPayment" element={<AddReferralPayment />} />,
                    <Route path="addReferralPayment" element={<AddReferralPayment />} />,
                    <Route path="Pharmacy-dashboard" element={<PharmacyDashboard />} />
                    <Route path="ViewRadiologyReport" element={<ViewRadiologyReport />} />,
                    {/* // Inventory management routes */}
                    <Route path="inventory" element={<Inventory />} />,
                    <Route path="addItemStock" element={<AddItemStock />} />,
                    <Route path="editItemStock" element={<EditItemStock />} />,
                    <Route path="itemList" element={<ItemList />} />,
                    <Route path="addItems" element={<AddItems />} />,
                    <Route path="editItems" element={<EditItem />} />,
                    <Route path="issueItemList" element={<IssueItemList />} />,
                    <Route path="addIssueItem" element={<AddIssueItem />} />,
                    <Route path="editCallLog" element={<EditCallLog />} />,

                    {/* // Birth and death record routes */}
                    <Route path="birthRecord" element={<BirthRecord />} />,
                    <Route path="deathRecord" element={<DeathRecord />} />,
                    <Route path="addBirthRecord" element={<AddBirthRecord />} />,
                    <Route path="editBirthRecord" element={<EditBirthRecord />} />,
                    <Route path="addDeathRecord" element={<AddDeathRecord />} />,
                    <Route path="editDeathRecord" element={<EditDeathRecord />} />,

                    {/* // Live cons/ultation routes */}
                    <Route path="liveConsultation" element={<LiveConsultation />} />,
                    <Route path="liveMeetings" element={<LiveMeetings />} />,
                    <Route path="addConsultation" element={<AddConsultation />} />,
                    <Route path="addLiveMeeting" element={<AddLiveMeeting />} />,

                    {/* // TPA management routes */}
                    <Route path="tpaManagement" element={<TpaManagement />} />,
                    <Route path="addTpa" element={<AddTPA />} />,
                    <Route path="editTpa" element={<EditTpa />} />,

                    {/* // Ambulance management routes */}
                    <Route path="ambulance" element={<Ambulance />} />,
                    <Route path="ambulanceList" element={<AmbulanceList />} />,
                    <Route path="addAmbulanceCall" element={<AddAmbulanceCall />} />,
                    <Route path="addAmbulance" element={<AddAmbulance />} />,

                    {/* // Front office and visitor management routes */}
                    <Route path="visitorList" element={<VisitorList />} />,
                    <Route path="editVisitor" element={<EditVisitor />} />,
                    <Route path="phoneCallLogs" element={<PhoneCallLogList />} />,
                    <Route path="complaintList" element={<ComplainList />} />,
                    <Route path="editComplain" element={<EditComplainForm />} />,
                    <Route path="addComplain" element={<AddComplain />} />,
                    <Route path="addVisitor" element={<AddVisitor />} />,
                    <Route path="addCallLog" element={<AddCallLog />} />,
                    <Route path="addCategoryFinding" element={<AddCategoryFinding />} />,

                    {/* // Medicine stock and purchase management routes */}
                    <Route path="medicineStock" element={<MedicinesStock />} />,
                    <Route path="mediceUpload" element={<MedicineUpload />} />,
                    <Route path="addMedicineDetails" element={<AddMedicineDetails />} />,
                    <Route path="medicinePurchaseList" element={<MedicinePurchaseList />} />,
                    <Route path="low-stock-medicine" element={<LowStockMedicineList />} />,
                    <Route path="bad-stock-medicine" element={<BadStockDataTable />} />,

                    {/* // Report-related/ routes */}
                    <Route path="opdReport" element={<OpdMain />} />,
                    <Route path="financeReport" element={<FinanceMain />} />,
                    <Route path="monthlyReport" element={<MonthlyReportMain />} />,
                    <Route path="appointmentReport" element={<AppointmentMain />} />,
                    <Route path="ipdReport" element={<IPDMain />} />,
                    <Route path="pharmacyReport" element={<PharmacyMain />} />,
                    <Route path="pathologyReport" element={<PathologyMain />} />,
                    <Route path="radiologyReport" element={<RadiologyMain />} />,
                    <Route path="ambulanceReport" element={<AmbulanceMain />} />,
                    <Route path="bloodBankReport" element={<BloodBankMain />} />,
                    <Route path="birthDeathReport" element={<BirthDeathReportMain />} />,
                    <Route path="hrReport" element={<HumanResource />} />,
                    <Route path="tpaReport" element={<TPAMain />} />,
                    <Route path="inventoryReport" element={<InventoryMain />} />,
                    <Route path="liveConsultationReport" element={<LiveConsultationMain />} />,
                    <Route path="logReport" element={<LogMain />} />,
                    <Route path="otReport" element={<OTMain />} />,
                    <Route path="patientReport" element={<PatientReportMain />} />,

                    {/* // Certificate m/anagement routes */}
                    <Route path="createCertificateTemplate" element={<CreateCertificateTemplate />} />,
                    <Route path="CertificateTemplateDataTable" element={<CertificateTemplateDataTable />} />,
                    <Route path="editCertificateTemplate" element={<EditCertificateTemplate />} />,
                    <Route path="certificate" element={<Certificate />} />,
                    <Route path="patientIDCard" element={<PatientIDCard />} />,
                    <Route path="staffIDCard" element={<StaffIDCard />} />,
                    <Route path="downloadCertificate" element={<DownloadCertificateTemplate />} />,
                    <Route path="CreatePatientIdCard" element={<CreatePatientIdCard />} />,
                    <Route path="addStaffId" element={<CreateStaffIdTemplateCard />} />,
                    <Route path="generateCertificate" element={<GenerateCertificate />} />,
                    <Route path="generateIdCardTemplate" element={<GenerateIdCardTemplate />} />,
                    <Route path="generateStaffID" element={<GenerateStaffID />} />,

                    {/* // Setup routes/ */}
                    <Route path="settingsMain" element={<SettingsMain />} />,
                    <Route path="patientSetup" element={<PatientList />} />,
                    <Route path="addPatientSetup" element={<AddPatientSetUp />} />,
                    <Route path="addHospitalCharges" element={<AddHospitalCharges />} />,
                    <Route path="editHospitalCharges" element={<EditHospitalCharges />} />,
                    <Route path="addChargeType" element={<AddChargeType />} />,
                    <Route path="editChargeType" element={<EditChargeType />} />,
                    <Route path="addChargeCategory" element={<AddChargeCategory />} />,
                    <Route path="editChargeCategory" element={<EditChargeCategory />} />,
                    <Route path="chargeCategoryList" element={<ChargeCategoryList />} />,
                    <Route path="taxCategoryList" element={<TaxCategoryList />} />,
                    <Route path="editTaxCategory" element={<EditTaxCategory />} />,
                    <Route path="addTaxCategory" element={<AddTaxCategory />} />,
                    <Route path="hospitalMain" element={<HospitalMain />} />,
                    <Route path="addUnitType" element={<AddUnitType />} />,
                    <Route path="editUnitType" element={<EditUnitType />} />,

                    {/* // Bed Setup routes */}
                    <Route path="bedMain" element={<BedMain />} />,
                    <Route path="addBed" element={<AddBed />} />,
                    <Route path="editBed" element={<EditBed />} />,
                    <Route path="addBedGroup" element={<AddBedGroup />} />,
                    <Route path="editBedGroup" element={<EditBedGroup />} />,
                    <Route path="addBedType" element={<AddBedType />} />,
                    <Route path="editBedType" element={<EditBedType />} />,
                    <Route path="addFloor" element={<AddFloor />} />,
                    <Route path="editFloor" element={<EditFloor />} />,

                    {/* // Front Office Setup routes */}
                    <Route path="frontofficeMain" element={<FrontOfficeMain />} />,
                    <Route path="addPurpose" element={<AddPurpose />} />,
                    <Route path="addComplainType" element={<AddComplainType />} />,
                    <Route path="addSource" element={<AddSource />} />,
                    <Route path="editSource" element={<EditSource />} />,
                    <Route path="editPurpose" element={<EditPurpose />} />,
                    <Route path="editComplainType" element={<EditComplainType />} />,

                    {/* // Operation Setup routes */}
                    <Route path="operationMain" element={<OperationMain />} />,
                    <Route path="addCategory" element={<AddCategory />} />,
                    <Route path="addOperation" element={<AddOperation />} />,
                    <Route path="operationCategoryList" element={<OperationCategoryList />} />,
                    <Route path="operationList" element={<OperationList />} />,

                    <Route path="pharmacyMainSetup" element={<PharmacyMainSetup />} />,
                    <Route path="medicineMovingDetails" element={<MedicineMovingDetails/>} />,
                    <Route path="medicineMovingCompanyDetails" element={<MedicineMovingCompanyDetails/>} />,
                    <Route path="PathologyMainSetup" element={<PathologyMainSetup />} />,
                    {/* <Route path="PathologyMainSetup" element={<PathologyMainSetup />} />, */}
                    <Route path="RadiologyMainSetup" element={<RadiologyMainSetup />} />,
                    <Route path="BloadBankMainSetup" element={<BloadBankMainSetup />} />,
                    <Route path="SymptomsMain" element={<SymptomsMain />} />,
                    <Route path="FindingsMainSetup" element={<FindingsMainSetup />} />
                    <Route path="vitalsMainSetup" element={<VitalMainSetup />} />
                    <Route path="zoomSettingsSetup" element={<ZoomSettingsSetup />} />
                    <Route path="financeSetup" element={<Financemain />} />
                    <Route path="addIncomeHead" element={<AddIncomeHead />} />
                    <Route path="addExpenseHead" element={<AddExpenceHead />} />
                    <Route path="editExpenseHead" element={<EditExpenceHead />} />
                    <Route path="editIncomeHead" element={<EditIncomeHead />} />

                    <Route path="humanResourceMainSetup" element={<HumanResourceMainSetup />} />
                    <Route path="addLeaveType" element={<AddLeaveType />} />
                    <Route path="editLeaveType" element={<EditLeaveType />} />
                    <Route path="addDepartment" element={<AddDepartment />} />
                    <Route path="editDepartment" element={<EditDepartment />} />
                    <Route path="addDesignation" element={<AddDesignation />} />
                    <Route path="addSpecialist" element={<AddSpecialist />} />
                    <Route path="editSpecialist" element={<EditSpecialist />} />
                    <Route path="editDesignation" element={<EditDesignation />} />
                    <Route path="referralMainSetup" element={<ReferralMainSetup />} />
                    <Route path="addReferralCommission" element={<AddReferralCommission />} />
                    <Route path="addReferralCategory" element={<AddReferralCategory />} />
                    <Route path="editItemCategorySetup" element={<EditItemCategory />} />
                    <Route path="editReferralCommission" element={<EditReferralCommission />} />
                    <Route path="editReferralCategory" element={<EditReferralCategory />} />
                    <Route path="referralMainSetup" element={<ReferralMainSetup />} />
                    <Route path="appointmentMainSetup" element={<AppointmentMainSetup />} />
                    <Route path="InventoryMainSetup" element={<InventoryMainSetup />} />
                    <Route path="addItemSupplier" element={<AddSupplier />} />
                    <Route path="editItemSupplier" element={<EditSupplier />} />
                    <Route path="addItemStoreSetup" element={<AddStore />} />
                    <Route path="editItemStoreSetup" element={<EditStore />} />
                    <Route path="addItemCategorySetup" element={<AddItemCategory />} />
                    <Route path="addScope" element={<AddScope />} />
                    <Route path="editScope" element={<EditScope />} />
                    <Route path="addRole" element={<AddRole />} />
                    <Route path="editRole" element={<EditRole />} />
                    <Route path="additionalFinanceReport" element={<AdditionalFinanceMain />} />,
                    <Route path="LeaveSummaryDataTable" element={<LeaveSummaryDataTable />} />,
                    {/* SETUP ADD */}

                    <Route path="addPathologyCategory" element={<AddPathologyCategory />} />
                    <Route path="editPathologyCategory" element={<EditPathologyCategory />} />
                    <Route path="addPathologyParameter" element={<AddPathologyParameter />} />
                    <Route path="editPathologyParameter" element={<EditPathologyParameter />} />
                    <Route path="addUnitsPathology" element={<AddUnitsPathology />} />
                    <Route path="editPathologyUnit" element={<EditPathologyUnit />} />
                    <Route path="addRadiologyCategory" element={<AddRadiologyCategory />} />
                    <Route path="editRadiologyCategory" element={<EditRadiologyCategory />} />
                    <Route path="addRadiologyUnits" element={<AddRadiologyUnits />} />
                    <Route path="editRadiologyUnits" element={<EditRadiologyUnits />} />
                    <Route path="addRadiologyParameter" element={<AddRadiologyParameter />} />
                    <Route path="editRadiologyParameter" element={<EditRadiologyParameter />} />
                    <Route path="addMedicineCategory" element={<AddMedicineCategory />} />
                    <Route path="editMedicineCategory" element={<EditMedicineCategory />} />
                    <Route path="addPharmacySupplier" element={<AddPharmacySupplier />} />
                    <Route path="editPharmacySupplier" element={<EditPharmacySupplier />} />
                    <Route path="addDosageInterval" element={<AddDosageInterval />} />
                    <Route path="editDosageInterval" element={<EditDosageInterval />} />
                    <Route path="addMedicineDosage" element={<AddMedicineDosage />} />
                    <Route path="editMedicineDosage" element={<EditMedicineDosage />} />
                    <Route path="addDosageDuration" element={<AddDosageDuration />} />
                    <Route path="editDosageDuration" element={<EditDosageDuration />} />
                    <Route path="addPharmacyUnit" element={<AddPharmacyUnits />} />
                    <Route path="editPharmacyUnit" element={<EditPharmacyUnit />} />
                    <Route path="addCompany" element={<AddCompany />} />
                    <Route path="editMedicineCompany" element={<EditCompany />} />
                    <Route path="addMedicineGroup" element={<AddMedicineGroup />} />
                    <Route path="editMedicineGroup" element={<EditMedicineGroup />} />
                    <Route path="addBloodProducts" element={<AddBloodProducts />} />
                    <Route path="editBloodProducts" element={<EditBloodProducts />} />
                    <Route path="addSymptomsHead" element={<AddSymptomsHead />} />
                    <Route path="addSymptomsType" element={<AddSymptomsType />} />
                    <Route path="addVitalForm" element={<AddVitalForm />} />
                    <Route path="approveStaff" element={<ApproveStaffDetails />} />


                    <Route path="contentType" element={<ContentType />} />,
                    <Route path="contentShareList" element={<ContentShareList />} />



                    {/* NON LINKING MODULES  */}
                    {/* // AntenatalFindingsMain */}
                    <Route path="AntenatalFindingsMain" element={<AntenatalFindingsMain />} />,
                    <Route path="MyProfiles" element={<MyProfiles />} />,
                    <Route path="Chat" element={<Chat />} />,
                    {/* <Route path="calender" element={<Calender />} />, */}


                    {/* NON LINKING MODULES  */}

                </Route>
            </Routes>
        </Router>
    </>
}

export default AllRouter;