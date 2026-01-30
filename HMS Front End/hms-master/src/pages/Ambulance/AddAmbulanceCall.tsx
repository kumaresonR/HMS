import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Button, Card, CardBody, Col, Container, FormGroup, Input, Label, Row, Spinner } from 'reactstrap';
import FormHeader from '../../common/FormHeader/FormHeader';
import { IoArrowBack } from 'react-icons/io5';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import PatientApiService from '../../helpers/services/patient/patient-api-service';
import ErrorHandler from '../../helpers/ErrorHandler';
import AmbulanceApiService from '../../helpers/services/ambulance/ambulance-api-service';
import { paymentModeData } from '../../common/data/FakeData';
import { toast } from 'react-toastify';
import SetupApiService from '../../helpers/services/setup/setup-api-service';
import { minimizePage } from '../../slices/pageResizer/uiSlice';
import { useDispatch, } from 'react-redux';

const AddAmbulanceCall = () => {
    const patientApiService: PatientApiService = new PatientApiService();
    const ambulanceApiService: AmbulanceApiService = new AmbulanceApiService();
    const setupApiService: SetupApiService = new SetupApiService();
    let navigate: any = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const [loading, setLoading] = useState(false);
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const [patientValidationError, setPatientValidationError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<[]>([]);
    const [caseId, setCaseId] = useState('');
    const [ambulanceData, setAmbulanceData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [vehicleModel, setVehicleModel] = useState('');
    const [vehicleId, setVehicleId] = useState('');
    const [vehicleModelValidationError, setVehicleModelValidationError] = useState(false);
    const [driverName, setDriverName] = useState('');
    const [date, setDate] = useState('');
    const [dateValidationError, setDateValidationError] = useState(false);
    const [chargeCategory, setChargeCategory] = useState('');
    const [chargeCategoryValidationError, setChargeCategoryValidationEroor] = useState(false);
    const [chargeName, setChargeName] = useState('');
    const [chargeNameValidationError, setchargeNameValidationError] = useState(false);
    const [standardCharge, setStandardCharge] = useState<number>();
    const [standardChargeValidationError, setStandardChargeValidationError] = useState(false);
    const [note, setNote] = useState('');
    const [total, setTotal] = useState<any>();
    const [tax, setTax] = useState<number>();
    const [discount, setDiscount] = useState<number>(0);
    const [taxPercentage, setTaxPercentage] = useState<any>();
    const [discountPercent, setDiscountPercent] = useState<any>(0);
    const [netAmount, setNetAmount] = useState<any>(0);
    const [paymentMode, setPaymentMode] = useState('');
    const [paymentAmount, setPaymentAmount] = useState<any>();
    const [documentFile, setDocument] = useState<any>();
    const [chequeNo, setChequeNo] = useState('');
    const [chequeNoValidationError, setChequeNoValidationError] = useState(false);
    const [chequeDate, setChequeDate] = useState('');
    const [chequeDateValidationError, setChequeDateValidationError] = useState(false);
    const [paymentAmountValidationError, setPaymentAmountValidationError] = useState(false);
    const [ipdOrOpdId, setIpdOrOpdId] = useState('');
    const data = { selectedPatientId, caseId, vehicleId, vehicleModel, driverName, chargeCategory, chargeName, standardCharge, note, total, discount, discountPercent, tax, taxPercentage, netAmount, ipdOrOpdId, date, paymentMode, chequeDate, paymentAmount, chequeNo };

    const onSelectedPatientId = (selectedItem: any) => {
        const patientId = selectedItem?.[0]?.['patientId'];
        setSelectedPatientId(patientId);
        onSearchOpdOrIpd(patientId);
        setPatientValidationError(false);
    }

    const onSearchOpdOrIpd = async (id: any) => {
        try {
            let result = await patientApiService.searchOpdOrIpdByPatientId(id);
            setIpdOrOpdId(result.id || '')
        } catch (error) {
            console.log("onSearchOpdOrIpd search Error");
        }
    }

    const onSearch = async (query: any) => {
        setIsLoading(true);
        try {
            let url = "getPatientData?searchTerm=" + query
            let result = await patientApiService.searchPatient(url);
            setOptions(result.data)
        } catch (error) {
            console.log("Patient search Error");
        } finally {
            setIsLoading(false);
        }
    }

    const handleVehicleModelChange = (value: string) => {
        const selectedVehicle: any = ambulanceData.find(
            (item: any) => item.vehicleId === value
        );
        if (selectedVehicle) {
            setVehicleModel(selectedVehicle.vehicleModel);
            setDriverName(selectedVehicle.driverName);
            setVehicleId(selectedVehicle.vehicleId);
        } else {
            setVehicleModel("");
            setDriverName("");
            setVehicleId("");
        }
        setVehicleModelValidationError(false);
    };


    const handleDateChange = (value: any) => {
        setDate(value);
        setDateValidationError(false);
    }

    const handleCategoryChange = (value: any) => {
        setChargeCategory(value);

        const selectedCharge: any = categoryData.find((item: any) => item?.chargeCategory?.name === value);

        if (selectedCharge) {
            // setVehicleChargeId(selectedCharge.)
            setChargeName(selectedCharge.chargeName);
            setStandardCharge(selectedCharge.standardCharge);
            setTaxPercentage(selectedCharge.taxPercentage);
            setTotal(selectedCharge.standardCharge)
            if (selectedCharge.standardCharge) {
                recalculateNetAmount(selectedCharge.standardCharge, discountPercent, selectedCharge.taxPercentage);
            }
            if (selectedCharge.taxPercentage) {
                handleTaxPercentChange(selectedCharge.taxPercentage)
            }
        } else {
            setChargeName('');
            setStandardCharge(0);
            setTotal(0);
            setDiscountPercent(0);
            setDiscount(0);
            setTaxPercentage(0);
        }
        setChargeCategoryValidationEroor(false);
    };


    const handleChargeNameChange = (value: any) => {
        setChargeName(value);
        setchargeNameValidationError(false);
    }

    const handleStandardChargeChange = (value: any) => {
        setStandardCharge(value);
        setStandardChargeValidationError(false);
    }

    const handleDiscountPercentChange = (value: number) => {
        setDiscountPercent(value);
        const calculatedDiscount = (value / 100) * total;
        setDiscount(calculatedDiscount);
        recalculateNetAmount(total, value, taxPercentage);
    };

    const handleDiscountChange = (value: number) => {
        setDiscount(value);
        setDiscountPercent((value / total) * 100);
        recalculateNetAmount(total, discountPercent, taxPercentage);
    };

    const handleTaxPercentChange = (value: number) => {
        setTaxPercentage(value);
        const calculatedTax = (value / 100) * total;
        setTax(calculatedTax);
        recalculateNetAmount(total, discountPercent, value);
    };

    const recalculateNetAmount = (total: number, discountPercent: number, taxPercent: number) => {
        const calculatedDiscount = (discountPercent / 100) * total;
        const calculatedTax = (taxPercent / 100) * total;

        const netAmount = total - calculatedDiscount + calculatedTax;

        setNetAmount(netAmount);
        setPaymentAmount(netAmount)
        setTax(calculatedTax);
        setDiscount(calculatedDiscount);
    };

    const handlePaymentAmountChange = (value: any) => {
        const numericValue = parseFloat(value) || 0;
        setPaymentAmount(value);

        if (numericValue > netAmount) {
            setPaymentAmountValidationError(true);
        } else {
            setPaymentAmountValidationError(false);
        }
    };

    const handleChequeNoChange = (value: any) => {
        setChequeNo(value);
        setChequeNoValidationError(false);
    }

    const handleChequeDateChange = (value: any) => {
        setChequeDate(value);
        setChequeDateValidationError(false);
    }

    const onFileUploadListener = (event: any) => {
        const file = event.target.files[0];
        setDocument(file);
    }

    const getAllAmbulanceList = async () => {
        try {
            let result = await ambulanceApiService.getAllAmbulanceList("all");
            setAmbulanceData(result);
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

    const validateForm = () => {
        let isFormValid = true;

        if (!selectedPatientId) {
            setPatientValidationError(true);
            isFormValid = false;
        }

        if (!vehicleModel) {
            setVehicleModelValidationError(true);
            isFormValid = false;
        }

        if (!standardCharge) {
            setStandardChargeValidationError(true);
            isFormValid = false;
        }

        if (!chargeCategory) {
            setChargeCategoryValidationEroor(true);
            isFormValid = false;
        }

        if (!chargeName) {
            setchargeNameValidationError(true);
            isFormValid = false;
        }

        if (!standardCharge) {
            setStandardChargeValidationError(true);
            isFormValid = false;
        }

        if (!date) {
            setDateValidationError(true);
            isFormValid = false;
        }

        if (!paymentAmount || parseFloat(paymentAmount) > netAmount) {
            setPaymentAmountValidationError(true);
            isFormValid = false;
        }

        if (paymentMode === "Cheque") {
            if (!chequeNo) {
                setChequeNoValidationError(true);
                isFormValid = false;
            }

            if (!chequeDate) {
                setChequeDateValidationError(true);
                isFormValid = false;
            }
        }

        return isFormValid;
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            doCreatePayment();
        }
    }
    const doCreatePayment = async () => {
        try {
            let formData: FormData = new FormData();
            const payload: any = {
                patientId: selectedPatientId,
                caseId: caseId,
                vehicleId: vehicleId,
                vehicleModel: vehicleModel,
                driverName: driverName,
                chargeCategory: chargeCategory,
                chargeName: chargeName,
                standardCharge: standardCharge,
                note: note || 'NA',
                total: total,
                discountAmount: discount,
                discountPercentage: discountPercent,
                taxAmount: tax,
                taxPercentage: taxPercentage,
                netAmount: netAmount,
                ipdOrOpdId: ipdOrOpdId,
                transactions: [
                    {
                        date: date,
                        paymentMode: paymentMode,
                        checkNo: chequeNo,
                        checkDate: chequeDate,
                        paymentAmount: paymentAmount
                    }
                ]
            };
            // Convert JSON payload to Blob with application/json type
            const jsonBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            console.log("JSON.stringify(jsonBlob)", JSON.stringify(payload))
            formData.append('ambulanceCall', jsonBlob);
            formData.append('file', documentFile);
            await ambulanceApiService.addAmbulanceCall(formData);
            toast.success('Bill Added Successfully', { containerId: 'TR' });
            navigate('/main/ambulance')
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllAmbulanceList();
        getAllCategory();
    }, []);

    useEffect(() => {
        recalculateNetAmount(total, discountPercent, taxPercentage);
    }, [discount, total, taxPercentage]);

    useEffect(() => {
        // Restore data if available
        if (location?.state) {
            setSelectedPatientId(location?.state?.selectedPatientId);
            if (location?.state?.selectedPatientId) {
                onSearch(location?.state?.selectedPatientId)
            }
            setCaseId(location?.state?.caseId);
            setVehicleId(location?.state?.vehicleId);
            setVehicleModel(location?.state?.vehicleModel);
            setDriverName(location?.state?.driverName);
            setChargeCategory(location?.state?.chargeCategory);
            setChargeName(location?.state?.chargeName);
            setStandardCharge(location?.state?.standardCharge);
            setNote(location?.state?.note);
            setTotal(location?.state?.total);
            setDiscount(location?.state?.discount);
            setDiscountPercent(location?.state?.discountPercent);
            setTax(location?.state?.tax);
            setTaxPercentage(location?.state?.taxPercentage);
            setNetAmount(location?.state?.netAmount);
            setIpdOrOpdId(location?.state?.ipdOrOpdId);
            setDate(location?.state?.date);
            setPaymentAmount(location?.state?.paymentAmount);
            setChequeDate(location?.state?.chequeDate);
            setChequeNo(location?.state?.chequeNo);
            setPaymentMode(location?.state?.paymentMode);
        }
    }, [location?.state]);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader
                        title="Add Ambulance Call"
                        pageTitle="Transportation Management"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "Add Ambulance Call",
                            data
                        }))} />
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardBody>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="mb-0">Add Ambulance Call</h5>
                                        <Button  onClick={() => navigate(-1)}
                                            color="primary"
                                            className="btn btn-primary add-btn"
                                        >
                                            <IoArrowBack /> Back
                                        </Button>
                                    </div>

                                    <Row className='mb-3'>
                                        <Col sm={6}>
                                            <AsyncTypeahead
                                                filterBy={() => true}
                                                id="patient-id-search-box"
                                                className={` ${patientValidationError ? 'is-invalid' : ''}`}
                                                isLoading={isLoading}
                                                labelKey="name"
                                                minLength={1}
                                                options={options}
                                                onSearch={onSearch}
                                                onChange={onSelectedPatientId}
                                                placeholder="Search by Patient Name or Id"
                                                selected={options.filter((patient: any) => patient.patientId === selectedPatientId)}
                                            />
                                            {patientValidationError && <div className="invalid-feedback">Patient Required.</div>}
                                        </Col>
                                        <Col sm={6} className='d-flex align-items-center justify-content-end gap-2'>
                                            <Input
                                                type="text"
                                                placeholder="Ipd Or Opd Id"
                                                id={`ipdOrOpdId`}
                                                value={ipdOrOpdId}
                                                onChange={e => setIpdOrOpdId(e.target.value)}
                                            />
                                        </Col>
                                    </Row>

                                    <div className="row">
                                        <div className="col-12">
                                            <div>
                                                <form onSubmit={handleSubmit}>
                                                    <div className="around10">
                                                        <div className="row mb-2">
                                                            <div className="col-md-6 mb-2">
                                                                <label htmlFor="vehicle_number">Vehicle Number </label>
                                                                <small className="req"> *</small>
                                                                <Input
                                                                    type="select"
                                                                    id="vehicle_number"
                                                                    name="vehicle_number"
                                                                    className="form-control"
                                                                    value={vehicleId}
                                                                    onChange={(e) => handleVehicleModelChange(e.target.value)}
                                                                    invalid={!!vehicleModelValidationError}
                                                                >
                                                                    <option value="">Select a Vehicle Number</option>
                                                                    {ambulanceData.map((item: any) => (
                                                                        <option key={item.vehicleId} value={item.vehicleId}>
                                                                            {item.vehicleNumber} ({item.vehicleModel})
                                                                        </option>
                                                                    ))}
                                                                </Input>

                                                                {vehicleModelValidationError && <span className="text-danger">Vehicle Number Required</span>}
                                                            </div>
                                                            <div className="col-md-6 mb-2">
                                                                <label htmlFor="driver_name">Driver Name </label>
                                                                <Input
                                                                    id="driver_name"
                                                                    name="driver_name"
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={driverName}
                                                                    disabled
                                                                />
                                                            </div>

                                                            <div className="col-md-6 mb-2">
                                                                <label htmlFor="date">Date </label>
                                                                <small className="req"> *</small>
                                                                <Input
                                                                    id="date"
                                                                    name="date"
                                                                    type="datetime-local"
                                                                    className="form-control"
                                                                    value={date}
                                                                    onChange={e => handleDateChange(e.target.value)}
                                                                    invalid={!!dateValidationError}
                                                                />
                                                                {dateValidationError && <span className="text-danger">Date Required</span>}
                                                            </div>

                                                            <div className="col-md-6 mb-2">
                                                                <label htmlFor="charge_category">Charge Category </label>
                                                                <small className="req"> *</small>
                                                                <Input
                                                                    type="select"
                                                                    id="charge_category"
                                                                    name="charge_category"
                                                                    className="form-control"
                                                                    value={chargeCategory}
                                                                    onChange={e => handleCategoryChange(e.target.value)}
                                                                    invalid={!!chargeCategoryValidationError}
                                                                >
                                                                    <option value="">Select</option>
                                                                    {categoryData?.map((item: any, idx: any) => (
                                                                        <option key={idx} value={item?.chargeCategory?.name}>{item?.chargeCategory?.name}</option>
                                                                    ))}
                                                                </Input>
                                                                {chargeCategoryValidationError && <span className="text-danger">Charge Category Required</span>}
                                                            </div>

                                                            <div className="col-md-6 mb-2">
                                                                <label htmlFor="charge_name">Charge Name </label>
                                                                <small className="req"> *</small>
                                                                <Input
                                                                    type="text"
                                                                    id="charge_name"
                                                                    name="charge_name"
                                                                    className="form-control"
                                                                    value={chargeName}
                                                                    onChange={e => handleChargeNameChange(e.target.value)}
                                                                    invalid={!!chargeNameValidationError}
                                                                    readOnly
                                                                />
                                                                {chargeNameValidationError && <span className="text-danger">Charge Name Required</span>}
                                                            </div>

                                                            <div className="col-md-6 mb-2">
                                                                <label htmlFor="standardCharge">Standard Charge (₹) </label>
                                                                <small className="req"> *</small>
                                                                <Input
                                                                    type="text"
                                                                    id="standardCharge"
                                                                    name="standardCharge"
                                                                    className="form-control"
                                                                    value={standardCharge}
                                                                    onChange={e => handleStandardChargeChange(e.target.value)}
                                                                    invalid={!!standardChargeValidationError}
                                                                    readOnly
                                                                />
                                                                {standardChargeValidationError && <span className="text-danger">Standard Charge Required</span>}
                                                            </div>
                                                        </div>
                                                        <Row>
                                                            <Col>
                                                                <Row>
                                                                    <Col>
                                                                        <FormGroup>
                                                                            <Label for="note">Note</Label>
                                                                            <Input
                                                                                type="textarea"
                                                                                id="note"
                                                                                value={note}
                                                                                onChange={(e) => setNote(e.target.value)}
                                                                                rows={4}
                                                                            />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                            <Col>
                                                                <Row>
                                                                    <Col sm={6}>
                                                                        <FormGroup>
                                                                            <Label for="total">Total (₹)</Label>
                                                                            <Input disabled
                                                                                type="number"
                                                                                id="total"
                                                                                value={total}
                                                                                onChange={(e) => setTotal(Number(e.target.value))}
                                                                            />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col sm={6}>
                                                                        <Row>
                                                                            <Col>
                                                                                <FormGroup>
                                                                                    <Label for="discount">Discount (%)</Label>
                                                                                    <Input
                                                                                        type="number"
                                                                                        id="discount"
                                                                                        value={discountPercent}
                                                                                        onChange={(e) => handleDiscountPercentChange(Number(e.target.value))}
                                                                                    />
                                                                                </FormGroup>
                                                                            </Col>
                                                                            <Col>
                                                                                <FormGroup>
                                                                                    <Label for="discount">Discount (₹)</Label>
                                                                                    <Input
                                                                                        type="number"
                                                                                        id="discount"
                                                                                        value={discount}
                                                                                        onChange={(e) => handleDiscountChange(Number(e.target.value))}
                                                                                    />
                                                                                </FormGroup>
                                                                            </Col>
                                                                        </Row>
                                                                    </Col>

                                                                    <Col sm={6}>
                                                                        <Row>
                                                                            <Col>
                                                                                <FormGroup>
                                                                                    <Label for="tax">Tax (%)</Label>
                                                                                    <Input disabled
                                                                                        type="number"
                                                                                        id="tax"
                                                                                        value={taxPercentage}
                                                                                        onChange={(e) => handleTaxPercentChange(Number(e.target.value))}
                                                                                    />
                                                                                </FormGroup>
                                                                            </Col>
                                                                            <Col>
                                                                                <FormGroup>
                                                                                    <Label for="tax">Tax (₹)</Label>
                                                                                    <Input disabled
                                                                                        type="number"
                                                                                        id="tax"
                                                                                        value={tax}
                                                                                        onChange={(e) => setTax(Number(e.target.value))}
                                                                                    />
                                                                                </FormGroup>
                                                                            </Col>
                                                                        </Row>
                                                                    </Col>

                                                                    <Col sm={6}>
                                                                        <FormGroup>
                                                                            <Label for="netAmount">Net Amount (₹)</Label>
                                                                            <Input
                                                                                type="number"
                                                                                id="netAmount"
                                                                                value={netAmount}
                                                                                readOnly
                                                                            />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col sm={6}>
                                                                        <FormGroup>
                                                                            <Label for="paymentAmount">Payment Amount <span className="text-danger">*</span></Label>
                                                                            <Input
                                                                                className={`${paymentAmountValidationError ? 'is-invalid' : ''}`}
                                                                                type="number"
                                                                                id="paymentAmount"
                                                                                value={paymentAmount}
                                                                                onChange={e => handlePaymentAmountChange(e.target.value)}
                                                                            />
                                                                            {paymentAmountValidationError && (
                                                                                <div className="invalid-feedback">
                                                                                    {paymentAmount > netAmount
                                                                                        ? 'Payment Amount cannot be greater than Net Amount.'
                                                                                        : 'Payment Amount is required.'}
                                                                                </div>
                                                                            )}
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col sm={6}>
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
                                                                    {paymentMode === "Cheque" && (
                                                                        <Row>
                                                                            <Col md={4}>
                                                                                <FormGroup>
                                                                                    <label className="text-start mb-2">Cheque No<span className="text-danger">*</span></label>
                                                                                    <Input className={`${chequeNoValidationError ? 'is-invalid' : ''}`}
                                                                                        id="ChequeNo"
                                                                                        name="ChequeNo"
                                                                                        type="text"
                                                                                        value={chequeNo}
                                                                                        onChange={e => handleChequeNoChange(e.target.value)}
                                                                                    />
                                                                                    {chequeNoValidationError && <div className="invalid-feedback">Cheque No Required.</div>}
                                                                                </FormGroup>
                                                                            </Col>
                                                                            <Col md={4}>
                                                                                <FormGroup>
                                                                                    <label className="text-start mb-2">Cheque Date<span className="text-danger">*</span></label>
                                                                                    <Input className={`${chequeDateValidationError ? 'is-invalid' : ''}`}
                                                                                        id="ChequeDate"
                                                                                        name="ChequeDate"
                                                                                        type="date"
                                                                                        value={chequeDate}
                                                                                        onChange={e => handleChequeDateChange(e.target.value)}
                                                                                    />
                                                                                    {chequeDateValidationError && <div className="invalid-feedback">Cheque Date Required.</div>}
                                                                                </FormGroup>
                                                                            </Col>
                                                                            <Col md={4}>
                                                                                <FormGroup>
                                                                                    <label className="text-start mb-2">Attach Document</label>
                                                                                    <Input
                                                                                        type="file"
                                                                                        className="form-control"
                                                                                        id="attachment"
                                                                                        onChange={onFileUploadListener}
                                                                                    />
                                                                                </FormGroup>
                                                                            </Col>
                                                                        </Row>
                                                                    )}
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                        <div className="col-md-12 text-right">
                                                            <Button type="submit" color="primary" disabled={loading}>
                                                                {loading ? <Spinner size="sm" /> : 'Add Ambulance Call'}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default AddAmbulanceCall;
