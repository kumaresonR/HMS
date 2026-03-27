import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap'
import PatientApiService from '../../helpers/services/patient/patient-api-service';
import BillingApiService from '../../helpers/services/billing/billing-api-service';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import ErrorHandler from '../../helpers/ErrorHandler';
import { toast } from 'react-toastify';
import { paymentModeData } from '../../common/data/FakeData';
import AppointmentApiService from '../../helpers/services/appointment/appointment-api-service';
import PharmacyApiService from '../../helpers/services/pharmacy/pharmacy-api-service';

const PathologyBill = (props: any) => {
    const patientApiService: PatientApiService = new PatientApiService();
    const billingApiService: BillingApiService = new BillingApiService();
    const appointmentApiServic: AppointmentApiService = new AppointmentApiService();
    const pharmacyApiService: PharmacyApiService = new PharmacyApiService();

    const [pathologyTestData, setPathologyTestData] = useState<any>([]);
    const [prescriptionNo, setPrescriptionNo] = useState('');
    const [applyTPA, setApplyTPA] = useState(false);
    const [rows, setRows] = useState<any[]>([]);
    const [testNameValidationError, setTestNameValidationError] = useState(false);
    const [reportDateValidationError, setReportDateValidationError] = useState(false);
    const [taxValidationError, setTaxValidationError] = useState(false);
    const [doctorOptions, setDoctorOptions] = useState<[]>([]);
    const [doctorName, setDoctorName] = useState('');
    const [hospitalDoctor, setHospitalDoctor] = useState('');
    const [paymentMode, setPaymentMode] = useState('Cash');
    const [paymentAmount, setPaymentAmount] = useState<any>(0);
    const [paymentAmountValidationError, setPaymentAmountValidationError] = useState(false);
    const [discount, setDiscount] = useState<number>(0);
    const [netAmount, setNetAmount] = useState<any>(0);
    const [note, setNote] = useState('');
    const [previousReportValue, setPreviousReportValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<[]>([]);
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const [patientValidationError, setPatientValidationError] = useState(false);
    const [tax, setTax] = useState<any>(0);
    const [total, setTotal] = useState<any>(0);
    const [documentFile, setDocument] = useState<any>();
    const [chequeNo, setChequeNo] = useState('');
    const [chequeNoValidationError, setChequeNoValidationError] = useState(false);
    const [chequeDate, setChequeDate] = useState('');
    const [chequeDateValidationError, setChequeDateValidationError] = useState(false);
    const [prescriptionNumberData, setPrescriptionNumberData] = useState<any>([]);
    const [patientData, setPatientData] = useState<any>([]);
    const [ipdOrOpdId, setIpdOrOpdId] = useState('');
    const [staffId, setStaffId] = useState('');
    const [isGSTAdded, setIsGSTAdded] = useState(true);

    const toggleSwitch = () => {
        const newIsGSTAdded = !isGSTAdded;
        setIsGSTAdded(newIsGSTAdded);
        recalculateTaxForRows(newIsGSTAdded);
    };

    const recalculateTaxForRows = (gstEnabled: boolean) => {
        setRows((prevRows) => {
            let total = 0;
            let totalTaxAmount = 0;

            const updatedRows = prevRows.map((row) => {
                const test = pathologyTestData.find(
                    (t: any) => t.pathologyTestId === row.pathologyTestId
                );

                const amount = parseFloat(test?.amount || row.amount || "0");
                const taxPercentage = gstEnabled ? parseFloat(test?.taxPercentage || "0") : 0;
                const taxAmount = amount * (taxPercentage / 100);

                total += amount;
                totalTaxAmount += taxAmount;

                return {
                    ...row,
                    amount: amount.toFixed(2),
                    tax: taxPercentage.toFixed(2),
                    taxAmount: taxAmount.toFixed(2),
                };
            });

            // Update totals
            setTotal(total.toFixed(2));
            setTax(totalTaxAmount.toFixed(2));
            const discountValue = total * (discount / 100);
            const netAmount = total - discountValue + totalTaxAmount;
            setNetAmount(netAmount.toFixed(2));
            setPaymentAmount(netAmount.toFixed(2));

            return updatedRows;
        });
    };

    const onSelectedPatientId = (selectedItem: any) => {
        const patientId = selectedItem?.[0]?.['patientId'];
        setSelectedPatientId(patientId);
        if (patientId) {
            getAllPrescriptions(patientId);
        }
        setPatientValidationError(false);
    }

    const getAllPrescriptions = async (id: any) => {
        try {
            const ipdDataPromise = pharmacyApiService.getAllPrescriptionByIpdId(id);
            const opdDataPromise = pharmacyApiService.getAllPrescriptionByOpdId(id);
            const [ipdData, opdData] = await Promise.all([ipdDataPromise, opdDataPromise]);
            // const combinedData = [...ipdData, ...opdData];
            // setPatientData(combinedData);
            const combinedData = [...ipdData, ...opdData].filter(item => !item.pathologyPaid);

            setPatientData(combinedData);

            console.log("Combined Patient Data", combinedData);
        } catch (error) {
            console.log(error);
        }
    };

    const searchByPrescriptionId = async () => {
        try {
            if (prescriptionNo) {
                let prescriptionDetails = [];
                if (prescriptionNo.startsWith("IPDP")) {
                    const ipdData = await pharmacyApiService.getAllPharmacyByIpdPrescription(prescriptionNo);
                    prescriptionDetails = ipdData?.[0]?.pathologyId || [];
                    setIpdOrOpdId(ipdData?.[0]?.ipdId);
                    console.log("opdOripd", ipdData?.[0]?.ipdId)
                    if (ipdData?.[0]?.doctor) {
                        const name = `${ipdData?.[0]?.doctor.firstName} ${ipdData?.[0]?.doctor.lastName}`
                        const firstName = name.split(" ")[0];
                        setDoctorName(firstName);
                        setStaffId(ipdData?.[0]?.doctor.staffId)
                        onDoctorSearch(firstName)
                    }
                } else {
                    const opdData = await pharmacyApiService.getAllPharmacyByOpdPrescription(prescriptionNo);
                    prescriptionDetails = opdData?.[0]?.pathologyId || [];
                    setIpdOrOpdId(opdData?.[0]?.opdId)
                    console.log("opdOripd", opdData?.[0]?.opdId)
                    if (opdData?.[0]?.doctor) {
                        const name = `${opdData?.[0]?.doctor.firstName} ${opdData?.[0]?.doctor.lastName}`
                        const firstName = name.split(" ")[0];
                        setDoctorName(firstName);
                        setStaffId(opdData?.[0]?.doctor.staffId)
                        onDoctorSearch(firstName)
                    }
                }

                if (prescriptionDetails.length === 0) {
                    console.log("No prescription details found for the given prescription number.");
                    toast.error("No prescription details found for the given prescription number.", { containerId: 'TR' });

                    setRows([{
                        pathologyTestId: '',
                        reportDays: '',
                        reportDate: '',
                        tax: '',
                        amount: ''
                    }]);
                    setPrescriptionNumberData([]);
                    return;
                }
                setRows([]);
                setPrescriptionNumberData([]);
                console.log("Resetting rows and prescription data...");

                setPrescriptionNumberData(prescriptionDetails);
                console.log("Prescription Data", prescriptionDetails);

                prescriptionDetails.forEach((pathologyTestId: any, index: any) => {
                    handleTestNameChange(index, pathologyTestId);
                });
            } else {
                console.log("Prescription number is not provided.");
                toast.warning("Please enter a prescription number.", { containerId: 'TR' });
            }
        } catch (error) {
            console.log("Error fetching prescription data:", error);
            toast.error("An error occurred while fetching prescription data. Please try again.", { containerId: 'TR' });
        }
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
    }

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

    const addRow = () => {
        setRows([...rows, {
            pathologyTestId: '',
            reportDays: '',
            reportDate: '',
            tax: '',
            amount: '',
            prescriptionNo: prescriptionNo
        }]);
    };

    const removeRow = (index: any) => {
        const newRow = [...rows];
        newRow.splice(index, 1);
        setRows(newRow);
    };
    const handleInputChange = (index: number, field: string, value: string) => {
        setRows((prevRows) => {
            const updatedRows = [...prevRows];
            updatedRows[index] = {
                ...updatedRows[index],
                [field]: value,
            };

            if (field === "amount" || field === "tax") {
                const amount = parseFloat(updatedRows[index].amount || "0");
                const tax = parseFloat(updatedRows[index].tax || "0");

                if (!isNaN(amount) && !isNaN(tax)) {
                    const taxAmount = amount * (tax / 100);
                    updatedRows[index].taxAmount = taxAmount.toFixed(2);
                }
            }

            let total = 0;
            let totalTaxAmount = 0;
            updatedRows.forEach((row) => {
                const amount = parseFloat(row.amount || "0");
                const tax = parseFloat(row.tax || "0");
                total += amount;
                totalTaxAmount += amount * (tax / 100);
            });

            setTotal(total.toFixed(2));
            setTax(totalTaxAmount.toFixed(2));

            const discountValue = total * (discount / 100);
            const netAmount = total - discountValue + totalTaxAmount;
            setNetAmount(netAmount.toFixed(2));
            setPaymentAmount(netAmount.toFixed(2));

            return updatedRows;
        });

        switch (field) {
            case 'pathologyTestId':
                setTestNameValidationError(!value);
                break;
            case 'reportDate':
                setReportDateValidationError(!value);
                break;
            default:
                break;
        }
    };
    const handleTestNameChange = (index: any, value: any) => {
        if (!value) {
            setRows((prevRows) => {
                const updatedRows = [...prevRows];
                updatedRows[index] = {
                    pathologyTestId: null,
                    reportDays: null,
                    tax: null,
                    amount: null,
                };
                return updatedRows;
            });
            return;
        }

        const selectedTest = pathologyTestData.find((test: any) => test.pathologyTestId === value);

        if (selectedTest) {
            setRows((prevRows) => {
                const updatedRows = [...prevRows];
                updatedRows[index] = {
                    ...updatedRows[index],
                    pathologyTestId: selectedTest.pathologyTestId,
                    reportDays: selectedTest.reportDays,
                    tax:isGSTAdded ? selectedTest.taxPercentage : 0,
                    amount: selectedTest.amount,
                    prescriptionNo: prescriptionNo
                };
                return updatedRows;
            });
        }
    };

    const getAllPathologyTest = async () => {
        try {
            let url = "all"
            let result = await billingApiService.getPathologyTest(url);
            setPathologyTestData(result);
        } catch (error: any) {
            console.log(error);
        }
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!selectedPatientId) {
            setPatientValidationError(true);
            isFormValid = false;
        }

        if (!paymentAmount || parseFloat(paymentAmount) > netAmount) {
            setPaymentAmountValidationError(true);
            isFormValid = false;
        }

        const rowErrors = rows.map((row: any) => {
            const errors = {
                pathologyTestId: !row.pathologyTestId,
                reportDate: !row.reportDate
            };

            // If any errors are true, the room is invalid
            isFormValid = isFormValid && !Object.values(errors).includes(true);
            return errors;
        });

        setTestNameValidationError(rowErrors.some(error => error.pathologyTestId));
        setReportDateValidationError(rowErrors.some(error => error.reportDate));

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
                hospitalDoctor: hospitalDoctor,
                caseId: "",
                prescriptionNo: prescriptionNo,
                doctorName: doctorName,
                note: note || 'NA',
                totalAmount: total,
                discount: discount,
                tax: tax,
                netAmount: netAmount,
                paymentMode: paymentMode,
                paymentAmount: paymentAmount,
                chequeNo: chequeNo,
                chequeDate: chequeDate,
                previousReportValue: previousReportValue || 'NA',
                pathologyItems: rows,
                ipdOrOpdId: ipdOrOpdId,
                isGstAdded: isGSTAdded
            };
            // Convert JSON payload to Blob with application/json type
            const jsonBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            console.log("JSON.stringify(jsonBlob)", payload)
            formData.append('billData', jsonBlob);
            formData.append('photo', documentFile);
            await billingApiService.createPathologyBill(formData);
            toast.success('Bill Added Successfully', { containerId: 'TR' });
            props.handleClose();
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllPathologyTest();
        // addRow();
    }, []);

    useEffect(() => {
        const discountValue = total * (discount / 100);
        const netAmount = total - discountValue + parseFloat(tax);
        setNetAmount(netAmount.toFixed(2));
        setPaymentAmount(netAmount.toFixed(2));
    }, [discount, total, tax]);

    return (
        <Container fluid>
            <Row className='mb-2'>
                <Col sm={5}>
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
                <Col sm={5} className='d-flex align-items-center justify-content-end gap-2'>
                    <select
                        className={`form-control`}
                        value={prescriptionNo} onChange={(e) => { setPrescriptionNo(e.target.value) }}
                    >
                        <option value="">--Select Prescription Number--</option>
                        {patientData.map((data: any, idx: any) => (
                            <option key={idx} value={data.prescriptionNo}>{data.prescriptionNo}</option>
                        ))}
                    </select>
                    <div>
                        <Button color='primary' onClick={searchByPrescriptionId}>Search</Button>
                    </div>
                </Col>
                {/* <Col className='d-flex align-items-center'>
                    <div className="form-check">
                        <Input
                            className="form-check-input"
                            type="checkbox"
                            id="visible"
                            checked={applyTPA}
                            onChange={(e) => setApplyTPA(e.target.checked)}
                        />
                        <Label className="form-check-label">Apply TPA </Label>
                    </div>
                </Col> */}
            </Row>

            <div className="row mb-2 mt-4">
                <div className="col-md-6"><h4>Add Pathology Details</h4></div>
                <div className="col-md-6 text-end">
                    <FormGroup switch className="fs-4">
                        <Input
                            type="switch"
                            role="switch"
                            checked={isGSTAdded}
                            onChange={toggleSwitch}
                        />
                        <Label check>GST</Label>
                    </FormGroup>
                    {/* <Button color="primary" disabled onClick={addRow}>
                        Add
                    </Button> */}
                </div>
            </div>

            <Form onSubmit={handleSubmit}>
                {rows.map((row, index) => (
                    <Row key={index} className="g-2 align-items-center">
                        <Col  >
                            <FormGroup>
                                <label className="text-start mb-2">Test Name<span className="text-danger">*</span></label>
                                <select
                                    className={`form-control ${testNameValidationError && !row.pathologyTestId ? 'is-invalid' : ''}`}
                                    value={row.pathologyTestId}
                                    onChange={(e) => {
                                        handleTestNameChange(index, e.target.value)
                                    }}
                                >
                                    <option value="">--Select Test Name--</option>
                                    {pathologyTestData.map((data: any, idx: any) => (
                                        <option key={idx} value={data.pathologyTestId}>{data.testName}</option>
                                    ))}
                                </select>
                                {testNameValidationError && !row.pathologyTestId && <div className="invalid-feedback">Test Name Required.</div>}
                            </FormGroup>
                        </Col>
                        <Col  >
                            <FormGroup>
                                <label className="text-start mb-2">Report Days</label>
                                <Input
                                    id="reportDays"
                                    name="reportDays"
                                    type="text"
                                    value={row.reportDays}
                                    disabled
                                />
                            </FormGroup>
                        </Col>
                        <Col  >
                            <FormGroup>
                                <Label for={`reportdate-${index}`}>Report Date<span className="text-danger">*</span></Label>
                                <Input
                                    className={`form-control ${reportDateValidationError && !row.reportDate ? 'is-invalid' : ''}`}
                                    type="datetime-local"
                                    id={`reportdate-${index}`}
                                    value={row.reportDate}
                                    onChange={(e) =>
                                        handleInputChange(index, "reportDate", e.target.value)
                                    }
                                />
                                {reportDateValidationError && !row.reportDate && <div className="invalid-feedback">Report Date Required.</div>}
                            </FormGroup>
                        </Col>
                        <Col  >
                            <FormGroup>
                                <label className="text-start mb-2">Tax (%)<span className="text-danger">*</span></label>
                                <Input
                                    id="tax"
                                    name="tax"
                                    type="text"
                                    value={row.tax}
                                    disabled
                                />
                                {taxValidationError && <div className="invalid-feedback">Tax Required.</div>}
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Label for={`amount-${index}`}>Gross Amount</Label>
                                <Input
                                    type="number"
                                    id={`amount-${index}`}
                                    value={row.amount}
                                    disabled
                                />
                            </FormGroup>
                        </Col>

                        {/* <Col xs="auto pt-2">
                            {index !== 0 && (
                                <button color='danger' className='btn btn-soft-danger' onClick={() => removeRow(index)}>x</button>
                            )}
                        </Col> */}
                    </Row>
                ))}


                <Row>
                    <Col>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label for="Hospital Doctor">Referal Doctor</Label>
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
                                        selected={doctorOptions.filter((doctor: any) => doctor.staffId === staffId)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label for="DoctorName">Doctor Name</Label>
                                    <Input
                                        type="text"
                                        id="doctorName"
                                        value={doctorName}
                                        onChange={(e) => setDoctorName(e.target.value)}
                                    >
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label for="note">Note</Label>
                                    <Input
                                        type="textarea"
                                        id="note"
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        rows={2}
                                    />
                                </FormGroup>
                            </Col>
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label for="previousReport">
                                            Previous Report Value</Label>
                                        <Input
                                            type="textarea"
                                            id="previousReport"
                                            value={previousReportValue}
                                            onChange={(e) => setPreviousReportValue(e.target.value)}
                                            rows={2}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
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
                                        value={discount}
                                        onChange={(e) => setDiscount(Number(e.target.value))}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
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
                                        disabled
                                    />
                                </FormGroup>
                            </Col>

                        </Row>
                        <Row>
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
                            <Col>
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
                <Row>
                    <Col className="d-flex align-items-center">
                        {/* <Button type="submit" color="primary" className="ms-auto me-2">
                            Save & Print
                        </Button> */}
                        <Button color="primary" >
                            Save
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>

    )
}

export default PathologyBill