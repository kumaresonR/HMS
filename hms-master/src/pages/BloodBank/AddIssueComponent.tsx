import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap'
import PatientApiService from '../../helpers/services/patient/patient-api-service';
import BloodBankApiService from '../../helpers/services/bloodBank/BloodBankApiService';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import AppointmentApiService from '../../helpers/services/appointment/appointment-api-service';
import { bloodGroupDetails, paymentModeData } from '../../common/data/FakeData';
import ErrorHandler from '../../helpers/ErrorHandler';
import SetupApiService from '../../helpers/services/setup/setup-api-service';
import { toast } from 'react-toastify';

const AddIssueComponent = (props: any) => {
    const patientApiService: PatientApiService = new PatientApiService();
    const bloodBankApiService: BloodBankApiService = new BloodBankApiService();
    const appointmentApiServic: AppointmentApiService = new AppointmentApiService();
    const setupApiService: SetupApiService = new SetupApiService();

    const today = new Date().toISOString().split('T')[0];
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<[]>([]);
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const [patientValidationError, setPatientValidationError] = useState(false);
    const [doctorOptions, setDoctorOptions] = useState<[]>([]);
    const [caseId, setCaseId] = useState('');
    const [issueDateValidationError, setIssueDateValidationError] = useState(false);
    const [issueDate, setIssueDate] = useState('');
    const [hospitalDoctor, setHospitalDoctor] = useState('');
    const [doctorName, setDoctorName] = useState('');
    const [componentData, setComponentData] = useState([]);
    const [filteredCategory, setFilteredCategory] = useState([]);
    const [filteredBags, setFilteredBags] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [referenceNameValidationError, setReferenceNameValidationError] = useState(false);
    const [referenceName, setReferenceName] = useState('');
    const [technician, setTechnician] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [components, setComponents] = useState('');
    const [bloodGroupValidationError, setBloodGroupValidationError] = useState(false);
    const [bag, setBag] = useState('');
    const [bagValidationError, setBagValidationError] = useState(false);
    const [chargeCategory, setChargeCategory] = useState('');
    const [chargeCategoryValidationError, setChargeCategoryValidationEroor] = useState(false);
    const [chargeName, setChargeName] = useState('');
    const [chargeNameValidationError, setchargeNameValidationError] = useState(false);
    const [standardCharge, setStandardCharge] = useState<number>();
    const [standardChargeValidationError, setStandardChargeValidationError] = useState(false);
    const [note, setNote] = useState('');
    const [bloodQty, setBloodQty] = useState('');
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
    const [loading, setLoading] = useState(false);

    const handleTechnicianChange = (value: any) => {
        setTechnician(value);
    }

    const handleIssueDateChange = (value: any) => {
        setIssueDate(value);
        setIssueDateValidationError(false);
    }

    const handleReferenceNameChange = (value: any) => {
        setReferenceName(value);
        setReferenceNameValidationError(false);
    }


    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            doCreateIssueComponent();
        }
    }

    const doCreateIssueComponent = async () => {
        try {
            let formData: FormData = new FormData();
            const payload: any = {
                patientId: selectedPatientId,
                caseId: caseId,
                issueDate: issueDate,
                hospitalDoctor: doctorName,
                referenceName: referenceName,
                technician: technician,
                bloodGroup: bloodGroup,
                components: components,
                componentId: bag,
                chargeCategory: chargeCategory,
                chargeName: chargeName,
                standardCharge: standardCharge,
                note: note,
                total: total,
                discount: discount,
                tax: tax,
                netAmount: netAmount,
                paymentMode: paymentMode,
                paymentAmount: paymentAmount,
                chequeNo: chequeNo,
                chequeDate: chequeDate,
                ipdOrOpdId: ipdOrOpdId,
            };
            const jsonBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            console.log("JSON.stringify(jsonBlob)", JSON.stringify(payload))
            formData.append('componentData', jsonBlob);
            formData.append('photo', documentFile);
            await bloodBankApiService.createComponentIssue(formData);
            toast.success('Record Saved Successfully', { containerId: 'TR' });
            props.handleClose();
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

        if (!issueDate) {
            setIssueDateValidationError(true);
            isFormValid = false;
        }

        if (!referenceName) {
            setReferenceNameValidationError(true);
            isFormValid = false;
        }
        if (!bloodGroup) {
            setBloodGroupValidationError(true);
            isFormValid = false;
        }
        if (!bag) {
            setBagValidationError(true);
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


    const onSearch = async (query: any) => {
        setIsLoading(true);
        try {
            let url = "getPatientData?searchTerm=" + query
            let result = await patientApiService.searchPatient(url);
            console.log("search result", result);
            setOptions(result.data)
        } catch (error) {
            console.log("Patient search Error");
        } finally {
            setIsLoading(false);
        }
    }

    const onSelectedPatientId = (selectedItem: any) => {
        const patientId = selectedItem?.[0]?.['patientId'];
        setSelectedPatientId(patientId);
        onSearchOpdOrIpd(patientId);
        setPatientValidationError(false);
    }

    const onSearchOpdOrIpd = async (id: any) => {
        try {
            let result = await patientApiService.searchOpdOrIpdByPatientId(id);
            console.log("search result", result);
            setIpdOrOpdId(result.id)
        } catch (error) {
            console.log("onSearchOpdOrIpd search Error");
        }
    }

    const onDoctorSearch = async (query: any) => {
        setIsLoading(true);
        try {
            let url = "role=DOCTOR&department=&searchTerm=" + query
            let result = await appointmentApiServic.searchAllEmployee(url);
            console.log("search result", result);
            setDoctorOptions(result)
        } catch (error) {
            console.log("Doctor search Error");
        } finally {
            setIsLoading(false);
        }
    }
    const handleHospitalDoctorChange = (value: any) => {
        const doctorId = value?.[0]?.['employeeId'];
        const doctorName = value?.[0]?.['fullName']
        setHospitalDoctor(doctorId);
        setDoctorName(doctorName);
        setReferenceName(doctorName)
    }

    const handleBloodGroupChange = (value: any) => {
        setBloodGroup(value);

        const filteredComponents = componentData.filter((item: any) => item.bloodGroup === value);
        if (filteredComponents.length > 0) {
            setFilteredCategory(filteredComponents);
        } else {
            setFilteredCategory([]);
            setFilteredBags([]);
        }
    };

    const handleComponentChange = (value: any) => {
        setComponents(value);

        const filteredBags = filteredCategory.filter((item: any) => item.componentName === value);
        if (filteredBags.length > 0) {
            setFilteredBags(filteredBags);
        } else {
            setFilteredBags([]);
        }
    }

    const handleCategoryChange = (value: any) => {
        setChargeCategory(value);

        const selectedCharge: any = categoryData.find((item: any) => item?.chargeCategory?.name === value);

        if (selectedCharge) {
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

    const getAllComponents = async () => {
        try {
            let result = await bloodBankApiService.getAllComponents();
            console.log("getAllComponents", result);
            setComponentData(result);
        } catch (error: any) {
            console.log("getAllComponents Error");
            console.log(error);
            return ErrorHandler(error)
        }
    }

    const getAllCategory = async () => {
        try {
            let result = await setupApiService.getAllChargeCategory();
            console.log("getAllCategory", result);
            setCategoryData(result);
        } catch (error: any) {
            console.log("getAllCategory Error");
            console.log(error);
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllComponents();
        getAllCategory();
    }, []);

    useEffect(() => {
        recalculateNetAmount(total, discountPercent, taxPercentage);
    }, [standardCharge, total, taxPercentage]);

    useEffect(() => {
        if (componentData.length > 0 && categoryData.length > 0) {
            if (props.item) {
                setBloodGroup(props.item.bloodGroup || '');
                setComponents(props.item.componentName || '');
                setBag(props.item.componentId || '');

                // Filter components and bags based on the default values
                const filteredComponents = componentData.filter((comp: any) => comp.bloodGroup === props.item.bloodGroup);
                setFilteredCategory(filteredComponents);

                const filteredBags = filteredComponents.filter((comp: any) => comp.componentName === props.item.componentName);
                setFilteredBags(filteredBags);
            }
        }
    }, [componentData]);


    return (
        <Container fluid>
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
            <Form onSubmit={handleSubmit}>

                <Row className="g-2">
                    <Row>
                        <Col>
                            <FormGroup>
                                <label className="text-start mb-2">Issue Date<span className="text-danger">*</span></label>
                                <Input
                                    id="issueDate"
                                    name="issueDate"
                                    type="datetime-local"
                                    value={issueDate}
                                    min={today}
                                    className={`${issueDateValidationError ? 'is-invalid' : ''}`}
                                    onChange={e => handleIssueDateChange(e.target.value)}
                                />
                                {issueDateValidationError && <div className="invalid-feedback">Issue Date Required.</div>}
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Label for="Hospital Doctor">Hospital Doctor</Label>
                                <AsyncTypeahead
                                    filterBy={() => true}
                                    id="patient-id-search-box"
                                    isLoading={isLoading}
                                    labelKey="fullName"
                                    minLength={1}
                                    options={doctorOptions}
                                    onSearch={onDoctorSearch}
                                    onChange={handleHospitalDoctorChange}
                                    placeholder="Hospital Doctor"
                                />
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <label className="text-start mb-2">Reference Name<span className="text-danger">*</span></label>
                                <Input
                                    id="referenceName"
                                    name="referenceName"
                                    type="text"
                                    value={referenceName}
                                    className={`${referenceNameValidationError ? 'is-invalid' : ''}`}
                                    onChange={e => handleReferenceNameChange(e.target.value)}
                                />
                                {referenceNameValidationError && <div className="invalid-feedback">Reference Name Required.</div>}
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <label className="text-start mb-2">Technician</label>
                                <Input
                                    id="technician"
                                    name="technician"
                                    type="text"
                                    value={technician}
                                    onChange={e => handleTechnicianChange(e.target.value)}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <label className="text-start mb-2">Blood Group <span className="text-danger">*</span></label>
                                <select
                                    className={`form-control ${bloodGroupValidationError ? 'is-invalid' : ''}`}
                                    value={bloodGroup}
                                    onChange={(e) => { handleBloodGroupChange(e.target.value) }}
                                >
                                    <option value="">--Select--</option>
                                    {bloodGroupDetails.map((data, idx) => (
                                        <option key={idx} value={data.type}>{data.type}</option>
                                    ))}
                                </select>
                                {bloodGroupValidationError && <div className="invalid-feedback">Blood Group Required.</div>}
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <label className="text-start mb-2">Components</label>
                                <select className='form-control'
                                    value={components}
                                    onChange={(e) => { handleComponentChange(e.target.value) }}
                                >
                                    <option value="">--Select--</option>
                                    {filteredCategory?.length > 0 ? (
                                        filteredCategory.map((data: any, idx: any) => (
                                            <option key={idx} value={data.componentName}>{data.componentName}</option>
                                        ))
                                    ) : (
                                        <option disabled>No components available for selected blood group</option>
                                    )}
                                </select>
                            </FormGroup>
                        </Col>
                        <Col>

                            <FormGroup>
                                <label className="text-start mb-2">Bag <span className="text-danger">*</span></label>
                                <select
                                    className={`form-control ${bagValidationError ? 'is-invalid' : ''}`}
                                    value={bag}
                                    onChange={(e) => { setBag(e.target.value) }}
                                >
                                    <option value="">--Select--</option>
                                    {filteredBags.length > 0 ? (
                                        filteredBags.map((data: any, idx: any) => (
                                            <option key={idx} value={data.componentId}>
                                                {data.componentBag} ({data.volume} {data.unit})
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>No bags available for selected components</option>
                                    )}
                                </select>
                                {bagValidationError && <div className="invalid-feedback">Bag Required.</div>}
                            </FormGroup>
                        </Col>

                        <Col>
                            <FormGroup>
                                <label className="text-start mb-2">Charge Category <span className="text-danger">*</span></label>
                                <select
                                    className={`form-control ${chargeCategoryValidationError ? 'is-invalid' : ''}`}
                                    value={chargeCategory}
                                    onChange={e => handleCategoryChange(e.target.value)}
                                >
                                    <option value="">--Select--</option>
                                    {categoryData.map((item: any, idx: any) => (
                                        <option key={idx} value={item?.chargeCategory?.name}>{item?.chargeCategory?.name}</option>
                                    ))}
                                </select>
                                {chargeCategoryValidationError && <div className="invalid-feedback">Charge Category Required.</div>}
                            </FormGroup>
                        </Col>

                    </Row>
                    <Row>
                        <Col md={3}>
                            <FormGroup>
                                <label className="text-start mb-2">Charge Name <span className="text-danger">*</span></label>
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
                            </FormGroup>
                        </Col>
                        <Col md={3}>
                            <FormGroup>
                                <label className="text-start mb-2">Standard Charge (₹)<span className="text-danger">*</span></label>
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
                            </FormGroup>
                        </Col>
                    </Row>
                </Row>

                <hr />
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
                            <Col>
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
                        </Row>
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
                        <Row>
                            <Col>
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
                            <Col>
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
                        </Row>

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
                    </Col>
                </Row>
                <Row>
                    <Col className="d-flex align-items-center">
                        {/* <Button type="submit" color="primary" className="ms-auto me-2">
                            Save & Print
                        </Button> */}
                        {/* <Button
                            // size="sm"
                            color="primary"
                            className="btn btn-primary ms-3">
                            Save
                        </Button> */}
                        <Button color='primary' disabled={loading}>
                            {loading ? <Spinner size='sm' className='me-2'/> : "save"}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    )
}

export default AddIssueComponent