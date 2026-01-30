import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { symptomsData, isOldPatient, paymentModeData } from "../../../common/data/FakeData";
import FormHeader from "../../../common/FormHeader/FormHeader";
import GetPatient from "../../IPD/InPatient/GetPatient";
import AppointmentApiService from "../../../helpers/services/appointment/appointment-api-service";
import OPDApiService from "../../../helpers/services/opd/opd-api-service";
import PatientApiService from "../../../helpers/services/patient/patient-api-service";
import ErrorHandler from "../../../helpers/ErrorHandler";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { IoArrowBack } from "react-icons/io5";
import SetupApiService from "../../../helpers/services/setup/setup-api-service";
import { useDispatch } from "react-redux";
import { minimizePage } from "../../../slices/pageResizer/uiSlice";

const AddOpdPatient = () => {
    const opdApiService: OPDApiService = new OPDApiService();
    const appointmentApiServic: AppointmentApiService = new AppointmentApiService();
    const setupApiService: SetupApiService = new SetupApiService();
    const patientApiService: PatientApiService = new PatientApiService();

    let navigate: any = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const [symptomsType, setSymptomsType] = useState<any>('');
    const [symptomsTitle, setSymptomsTitle] = useState<any>('');
    const [symptomsDescription, setSymptomsDescription] = useState('');
    const [chargeTypeData, setChargeTypeData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);

    const [note, setNote] = useState('');
    const [anyKnownAllergies, setAnyKnownAllergies] = useState('');
    const [previousMedicalIssue, setPreviousMedicalIssue] = useState('');
    const today = new Date().toISOString().split('T')[0];
    const [admissionDate, setAdmissionDate] = useState('');
    const [admissionDateValidationError, setAdmissionDateValidationError] = useState(false);
    const [consultantDoctor, setConsultDoctor] = useState('');
    const [consultantDoctorValidationError, setConsultantDoctorValidationError] = useState(false);
    const [oldPatient, setOldPatient] = useState(false);
    const [cardLimit, setCardLimit] = useState(20000);
    const [cardLimitValidationError, setCardLimitValidationError] = useState(false);
    const [casualty, setCasualty] = useState(false);
    const [reference, setReference] = useState('');
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const [insuranceId, setInsuranceId] = useState('');
    const [applyTPA, setApplyTPA] = useState(false);
    const [discountPercentage, setDiscountPercentage] = useState<any>(0);
    const [tax, setTax] = useState(0);
    const [totalTax, setTotalTax] = useState(5);
    const [netAmount, setNetAmount] = useState(0);
    const [chargeType, setChargeType] = useState('');
    const [chargeCategory, setChargeCategory] = useState('');
    const [chargeName, setChargeName] = useState('');
    const [filteredCategories, setFilteredCategories] = useState<any>([]);
    const [standardCharge, setStandardCharge] = useState<any>('');
    const [tpaCharge, setTpaCharge] = useState<any>('');
    const [paymentMode, setPaymentMode] = useState('');
    const [appliedCharge, setAppliedCharge] = useState<number>();
    const [discount, setDiscount] = useState<any>();
    const [paidAmount, setPaidAmount] = useState<any>();
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<[]>([]);
    const data = { selectedPatientId, consultantDoctor, chargeType, tpaCharge, applyTPA, admissionDate, cardLimit, symptomsType, categoryData, symptomsTitle, symptomsDescription, note, reference, previousMedicalIssue, casualty, oldPatient, anyKnownAllergies, options, chargeCategory, chargeName, standardCharge, appliedCharge, discountPercentage, tax, netAmount, paymentMode, paidAmount, filteredCategories }
    const [isGSTAdded, setIsGSTAdded] = useState(true);

    const toggleSwitch = () => {
        const newIsGSTAdded = !isGSTAdded;
        setIsGSTAdded(newIsGSTAdded);
        calculateCharges();
    };

    const handleAdmissionDateChange = (value: any) => {
        setAdmissionDate(value);
        setAdmissionDateValidationError(false);
    }

    const handleCardLimitChange = (value: any) => {
        setCardLimit(value);
        setCardLimitValidationError(false);
    }

    const handleChargeTypeChange = (type: string) => {
        setChargeType(type);
        setChargeCategory('');
        setChargeName('');
        setStandardCharge('');
        setTpaCharge('');
        setTax(0);
        setDiscount(0);
        setDiscountPercentage(0);

        // Find the chargeTypeId corresponding to the selected chargeType
        const selectedChargeType: any = categoryData.find((data: any) => data.chargeType.chargeType === type);

        if (selectedChargeType) {
            // Filter charge categories that match the selected chargeTypeId
            const filtered: any = categoryData.filter((data: any) =>
                data.chargeCategory.chargeTypeId === selectedChargeType.chargeType.chargeTypeId
            ).map((data: any) => data.chargeCategory);

            setFilteredCategories(filtered);
            console.log("ficat=?", filtered)
        } else {
            setFilteredCategories([]);
        }
    };


    const handleChargeCategoryChange = (value: any) => {
        setChargeCategory(value);

        const selectedCharge: any = categoryData.find((item: any) => item?.chargeCategory?.name === value);
        console.log(selectedCharge)
        if (selectedCharge) {
            // setVehicleChargeId(selectedCharge.)
            setChargeName(selectedCharge.chargeName);
            setStandardCharge(selectedCharge.standardCharge);
            setTax(selectedCharge.taxPercentage);
            setAppliedCharge(selectedCharge.standardCharge)
            if (insuranceId) {
                const tpaCharge = selectedCharge.scheduleCharges?.find((sc: any) => sc.id === insuranceId);
                if (tpaCharge) {
                    setTpaCharge(tpaCharge.charge);
                } else {
                    setTpaCharge(0);
                }
            } else {
                console.log("No TPA ID provided.");
                // alert("No TPA ID found.");
            }
        } else {
            setChargeName('');
            setStandardCharge(0);
            setAppliedCharge(0);
            setDiscount(0);
            setDiscountPercentage(0);
            setTax(0);
        }
    };

    const handleChargeNameChange = (value: any) => {
        setChargeName(value);
    }

    const handleSelectedPatientIdChange = (id: string | null) => {
        setSelectedPatientId(id);
        console.log("Selected Patient ID in Parent:", id);
        getPatientDataById(id)
    };

    const getPatientDataById = async (id: any) => {
        try {
            let data = await patientApiService.getPatientById(id);
            setInsuranceId(data?.insuranceProviders?.insuranceId || '');
        } catch (error: any) {
            return ErrorHandler(error)
        }

    }

    const calculateCharges = () => {
        // Determine which charge to apply
        const charge = applyTPA ? parseFloat(tpaCharge) || 0 : parseFloat(standardCharge) || 0;
    
        // Set the charge before discount and tax
        setAppliedCharge(charge);
    
        // Calculate discount
        const discountAmount = (charge * discountPercentage) / 100;
        const discountedTotal = charge - discountAmount;
    
        // Conditionally calculate tax
        let taxAmount = 0;
        if (isGSTAdded) {
            taxAmount = (discountedTotal * tax) / 100;
        }
        setTotalTax(Number(taxAmount.toFixed(2)));
    
        // Calculate final net amount
        const finalAmount = discountedTotal + taxAmount;
        setNetAmount(Number(finalAmount.toFixed(2)));
        setPaidAmount(Number(finalAmount.toFixed(2)));
    };

    const onSearch = async (query: any) => {
        setIsLoading(true);
        try {
            let url = "role=DOCTOR&department=&searchTerm=" + query
            let result = await appointmentApiServic.searchAllEmployee(url);
            setOptions(result)
        } catch (error: any) {
            return ErrorHandler(error)
        } finally {
            setIsLoading(false);
        }
    }

    const onSelectedDoctorId = (selectedItem: any) => {
        const doctorId = selectedItem?.[0]?.['employeeId'];
        setConsultDoctor(doctorId);
        setConsultantDoctorValidationError(false);
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!selectedPatientId) {
            toast.warning('Please Select Patient', { containerId: 'TR' });
            isFormValid = false;
        }

        if (!admissionDate) {
            setAdmissionDateValidationError(true);
            isFormValid = false;
        }

        if (!consultantDoctor) {
            setConsultantDoctorValidationError(true);
            isFormValid = false;
        }

        if (!cardLimit) {
            setCardLimitValidationError(true);
            isFormValid = false;
        }

        return isFormValid;
    }
    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            doCreateAppointment();
        }
    };

    const doCreateAppointment = async () => {
        try {
            let payload: any = {
                patientId: selectedPatientId,
                doctorId: consultantDoctor,
                appointmentDate: admissionDate,
                // case:Case,
                cardLimit: cardLimit,
                symptomsType: symptomsType,
                symptomsTitle: symptomsTitle,
                symptomsDescription: symptomsDescription,
                note: note || 'NA',
                tpa: applyTPA,
                reference: reference || 'NA',
                previousMedicalIssue: previousMedicalIssue || 'NA',
                casualty: casualty,
                oldPatient: oldPatient,
                anyKnownAllergies: anyKnownAllergies || 'NA',
                isAntenatal: false,
                // chargeType : chargeType,
                chargeCategory: chargeCategory,
                chargeName: chargeName,
                standardCharge: standardCharge,
                // tpaCharge : tpaCharge,
                appliedCharge: appliedCharge,
                discountPercentage: discount,
                taxPercentage: tax,
                amount: netAmount,
                paymentMode: paymentMode,
                paidAmount: paidAmount,
                isGstAdded: isGSTAdded
            }
            await opdApiService.createOPD(payload);
            toast.success('Admission Created Successfully', { containerId: 'TR' });
            navigate('/main/OPD');
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllChargesType = async () => {
        try {
            let result = await setupApiService.getAllTmChargesType();
            setChargeTypeData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllCategory = async () => {
        try {
            let result = await setupApiService.getAllChargeCategory();
            setCategoryData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        calculateCharges();
    }, [standardCharge, tpaCharge, discountPercentage, tax, applyTPA,isGSTAdded]);

    useEffect(() => {
        getAllChargesType();
        getAllCategory();
    }, []);

    useEffect(() => {
        if (location?.state) {
            setOptions(location?.state?.options)
            setSelectedPatientId(location?.state?.selectedPatientId);
            setConsultDoctor(location?.state?.consultantDoctor);
            setAdmissionDate(location?.state?.admissionDate);
            setCardLimit(location?.state?.cardLimit);
            setSymptomsType(location?.state?.symptomsType);
            setSymptomsTitle(location?.state?.symptomsTitle);
            setSymptomsDescription(location?.state?.symptomsDescription);
            setNote(location?.state?.note);
            setApplyTPA(location?.state?.applyTPA)
            setReference(location?.state?.reference);
            setPreviousMedicalIssue(location?.state?.previousMedicalIssue);
            setCasualty(location?.state?.casualty);
            setOldPatient(location?.state?.oldPatient);
            setAnyKnownAllergies(location?.state?.anyKnownAllergies);
            setCategoryData(location?.state?.categoryData);
            setChargeType(location?.state?.chargeType);
            setFilteredCategories(location?.state?.filteredCategories);
            setChargeCategory(location?.state?.chargeCategory);
            setChargeName(location?.state?.chargeName);
            setStandardCharge(location?.state?.standardCharge);
            setTpaCharge(location?.state?.tpaCharge);
            setAppliedCharge(location?.state?.appliedCharge);
            setDiscountPercentage(location?.state?.discountPercentage);
            setTax(location?.state?.tax);
            setNetAmount(location?.state?.netAmount);
            setPaidAmount(location?.state?.paidAmount);
            setPaymentMode(location?.state?.paymentMode);
        }
    }, [location?.state]);

    return (
        <React.Fragment>
            <Container fluid>
                <FormHeader title="Add Admission" pageTitle="OPD"
                    onMinimize={() => dispatch(minimizePage({
                        route: location.pathname,
                        pageName: "Add OPD Admission",
                        data
                    }))} />
                <Row>
                    <Col lg={12}>
                        <Card>
                            <CardBody className="card-body">

                                <div className="d-flex justify-content-between align-items-center mb-3">

                                    <h5 className="mb-3">Patient Details </h5>

                                    <Link to="/main/OPD" className="text-end">

                                        <Button color="light" className="bg-gradient backBtn">
                                            <IoArrowBack />
                                        </Button>
                                    </Link>
                                </div>
                                <Row>
                                    <Col >
                                        <Form onSubmit={handleSubmit}>
                                            <GetPatient onSelectPatientId={handleSelectedPatientIdChange} selectedPatientId={selectedPatientId} />
                                            <Row>
                                                <Col lg={12}>
                                                    <Row>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Admission Date <span className="text-danger">*</span></label>
                                                                <Input
                                                                    className={`${admissionDateValidationError ? 'is-invalid' : ''}`}
                                                                    id="admissionDate"
                                                                    name="admissionDate"
                                                                    type="datetime-local"
                                                                    value={admissionDate}
                                                                    min={today}
                                                                    onChange={e => handleAdmissionDateChange(e.target.value)}
                                                                />
                                                                {admissionDateValidationError && <div className="invalid-feedback">Admission Date Required.</div>}
                                                            </FormGroup>
                                                        </Col>
                                                        {/* <Col md={12}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Case</label>
                                                                <Input
                                                                    id="case"
                                                                    name="case"
                                                                    type="text"
                                                                    value={Case}
                                                                    onChange={e => setCase(e.target.value)}
                                                                />
                                                            </FormGroup>
                                                        </Col> */}
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Credit Limit (₹) <span className="text-danger">*</span> </label>
                                                                <Input
                                                                    className={`${cardLimitValidationError ? 'is-invalid' : ''}`}
                                                                    id="cardLimit"
                                                                    name="cardLimit"
                                                                    type="number"
                                                                    value={cardLimit}
                                                                    onChange={e => handleCardLimitChange(e.target.value)}
                                                                />
                                                                {cardLimitValidationError && <div className="invalid-feedback">Credit Limit (₹) Required.</div>}
                                                            </FormGroup>
                                                        </Col>

                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Reference</label>
                                                                <Input
                                                                    id="reference"
                                                                    name="reference"
                                                                    type="text"
                                                                    value={reference}
                                                                    onChange={e => setReference(e.target.value)}
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Casualty</label>
                                                                <select
                                                                    className={`form-control`}
                                                                    value={casualty ? "Yes" : "No"} onChange={(e) => {
                                                                        setCasualty(e.target.value === "Yes");
                                                                    }}
                                                                >
                                                                    <option value="">--Select Casualty--</option>
                                                                    {isOldPatient.map((data: any, idx: any) => (
                                                                        <option key={idx} value={data.code}>{data.code}</option>
                                                                    ))}
                                                                </select>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Old Patient</label>
                                                                <select
                                                                    className={`form-control`}
                                                                    value={oldPatient ? "Yes" : "No"} onChange={(e) => {
                                                                        setOldPatient(e.target.value === "Yes");
                                                                    }}
                                                                >
                                                                    <option value="">--Select Old Patient--</option>
                                                                    {isOldPatient.map((data: any, idx: any) => (
                                                                        <option key={idx} value={data.code}>{data.code}</option>
                                                                    ))}
                                                                </select>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Consultant Doctor <span className="text-danger">*</span></label>
                                                                <AsyncTypeahead
                                                                    filterBy={() => true}
                                                                    id="patient-id-search-box"
                                                                    className={` ${consultantDoctorValidationError ? 'is-invalid' : ''}`}
                                                                    isLoading={isLoading}
                                                                    labelKey="fullName"
                                                                    minLength={1}
                                                                    options={options}
                                                                    onSearch={onSearch}
                                                                    onChange={onSelectedDoctorId}
                                                                    placeholder="Search by Doctor Name or Id"
                                                                    selected={options.filter((doctor: any) => doctor.employeeId === consultantDoctor)}
                                                                />
                                                                {consultantDoctorValidationError && <div className="invalid-feedback">Consultant Doctor Required.</div>}
                                                            </FormGroup>
                                                        </Col>

                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Charge Type <span className="text-danger">*</span></label>
                                                                <select
                                                                    className="form-control"
                                                                    value={chargeType}
                                                                    onChange={(e) => handleChargeTypeChange(e.target.value)}
                                                                >
                                                                    <option value="">--Select Charge Type--</option>
                                                                    {chargeTypeData.map((data: any, idx: any) => (
                                                                        <option key={idx} value={data.chargeType}>{data.chargeType}</option>
                                                                    ))}
                                                                </select>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Charge Category <span className="text-danger">*</span></label>
                                                                <select
                                                                    className="form-control"
                                                                    value={chargeCategory}
                                                                    onChange={(e) => handleChargeCategoryChange(e.target.value)}
                                                                >
                                                                    <option value="">--Select Charge Category--</option>
                                                                    {filteredCategories.map((cat: any, idx: any) => (
                                                                        <option key={idx} value={cat?.name}>{cat?.name}</option>
                                                                    ))}
                                                                </select>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Charge Name <span className="text-danger">*</span></label>
                                                                <Input
                                                                    type="text"
                                                                    id="charge_name"
                                                                    name="charge_name"
                                                                    className="form-control"
                                                                    value={chargeName}
                                                                    onChange={e => handleChargeNameChange(e.target.value)}
                                                                    readOnly
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Standard Charge <span className="text-danger">*</span></label>
                                                                <Input
                                                                    readOnly
                                                                    id="StandardCharge"
                                                                    name="StandardCharge"
                                                                    type="text"
                                                                    value={standardCharge}
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">TPA Charge </label>
                                                                <Input
                                                                    readOnly
                                                                    id="TPACharge"
                                                                    name="TPACharge"
                                                                    type="text"
                                                                    value={tpaCharge}
                                                                />
                                                            </FormGroup>
                                                        </Col>

                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Applied Charge <span className="text-danger">*</span></label>
                                                                <Input
                                                                    id="AppliedCharge"
                                                                    name="AppliedCharge"
                                                                    type="text"
                                                                    value={appliedCharge}
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Discount %</label>
                                                                <Input
                                                                    id="Discount"
                                                                    name="Discount"
                                                                    type="text"
                                                                    value={discountPercentage}
                                                                    onChange={(e) => setDiscountPercentage(e.target.value)}
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <Row className="align-items-center">
                                                                <Col md="auto">
                                                                    <FormGroup switch className="fs-4">
                                                                        <Input
                                                                            type="switch"
                                                                            role="switch"
                                                                            checked={isGSTAdded}
                                                                            onChange={toggleSwitch}
                                                                        />
                                                                        <Label check>GST</Label>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col>
                                                                    <FormGroup>
                                                                        <label className="text-start mb-2">Tax %<span className="text-danger">*</span></label>
                                                                        <Input
                                                                            readOnly
                                                                            id="Tax"
                                                                            name="Tax"
                                                                            type="text"
                                                                            value={tax}
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Amount  <span className="text-danger">*</span></label>
                                                                <Input
                                                                    readOnly
                                                                    id="Amount"
                                                                    name="Amount"
                                                                    type="text"
                                                                    value={netAmount}
                                                                />
                                                            </FormGroup>
                                                        </Col>

                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Payment Mode</label>
                                                                <select
                                                                    className={`form-control`}
                                                                    value={paymentMode} onChange={(e) => { setPaymentMode(e.target.value) }}
                                                                >
                                                                    <option value="">--Select Payment Mode--</option>
                                                                    {paymentModeData.map((data: any, idx: any) => (
                                                                        <option key={idx} value={data.type}>{data.type}</option>
                                                                    ))}
                                                                </select>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Paid Amount<span className="text-danger">*</span></label>
                                                                <Input
                                                                    id="paidAmount"
                                                                    name="paidAmount"
                                                                    type="number"
                                                                    value={paidAmount}
                                                                    onChange={(e: any) => setPaidAmount(e.target.value)}
                                                                    onWheel={(e: any) => e.target.blur()}
                                                                    step="any"
                                                                />
                                                            </FormGroup>
                                                        </Col>

                                                        <Col md={4} >
                                                            <div className="mb-3">
                                                                <Label htmlFor="symptoms-type" className="form-label ">Symptoms Type</Label>
                                                                <Input
                                                                    id="symptoms-type"
                                                                    name="symptoms-type"
                                                                    type="text"
                                                                    value={symptomsType}
                                                                    onChange={e => setSymptomsType(e.target.value)}
                                                                />
                                                                {/* <Select
                                                                    id="symptoms-type"
                                                                    value={selectedType}
                                                                    isMulti={true}
                                                                    onChange={handleTypeChange}
                                                                    options={symptomsData.map(symptom => ({
                                                                        label: symptom.symptomsType,
                                                                        value: symptom.symptomsType,
                                                                    }))}
                                                                    styles={customStyles}
                                                                /> */}
                                                            </div>
                                                        </Col>
                                                        <Col md={8}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="symptoms-title" className="form-label ">Symptoms Title</Label>
                                                                <Input
                                                                    id="symptoms-title"
                                                                    name="symptoms-title"
                                                                    type="text"
                                                                    value={symptomsTitle}
                                                                    onChange={e => setSymptomsTitle(e.target.value)}
                                                                />
                                                                {/* <Select
                                                                    id="symptoms-title"
                                                                    value={selectedTitles}
                                                                    isMulti={true}
                                                                    onChange={handleTitleChange}
                                                                    options={titleOptions}
                                                                    styles={customStyles}
                                                                /> */}
                                                            </div>
                                                        </Col>
                                                        <Col md={4} className="d-flex align-items-center">
                                                            <div className="form-check">
                                                                <Input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id="visible"
                                                                    disabled={!insuranceId || !tpaCharge}
                                                                    checked={applyTPA}
                                                                    onChange={(e) => setApplyTPA(e.target.checked)}
                                                                />
                                                                <Label className="form-check-label">Apply TPA </Label>
                                                            </div>
                                                        </Col>
                                                        <Col md={6}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="symptoms-description" className="form-label ">Symptoms Description</Label>
                                                                <textarea
                                                                    id="symptoms-description"
                                                                    name="symptoms-description"
                                                                    rows={3}
                                                                    value={symptomsDescription}
                                                                    className={`form-control`}
                                                                    onChange={e => setSymptomsDescription(e.target.value)}
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col md={6}>
                                                            <div className="mb-3">
                                                                <Label className="form-label">Note</Label>
                                                                <textarea
                                                                    id="note"
                                                                    name="note"
                                                                    rows={3}
                                                                    value={note}
                                                                    className={`form-control`}
                                                                    onChange={e => setNote(e.target.value)}
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col md={6}>
                                                            <div className="mb-3">
                                                                <Label className="form-label ">Any Known Allergies</Label>
                                                                <textarea
                                                                    id="AnyKnownAllergies"
                                                                    name="AnyKnownAllergies"
                                                                    rows={3}
                                                                    value={anyKnownAllergies}
                                                                    className={`form-control`}
                                                                    onChange={e => setAnyKnownAllergies(e.target.value)}
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col md={6}>
                                                            <div className="mb-3">
                                                                <Label className="form-label ">Previous Medical Issue</Label>
                                                                <textarea
                                                                    id="previousMedicalIssue"
                                                                    name="previousMedicalIssue"
                                                                    rows={3}
                                                                    value={previousMedicalIssue}
                                                                    className={`form-control`}
                                                                    onChange={e => setPreviousMedicalIssue(e.target.value)}
                                                                />
                                                            </div>
                                                        </Col>

                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Col className="text-center">
                                                <Button color="primary">Submit</Button>
                                            </Col>
                                        </Form>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}
export default AddOpdPatient