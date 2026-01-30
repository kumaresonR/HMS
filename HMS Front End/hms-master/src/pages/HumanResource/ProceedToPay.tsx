import React, { useEffect, useState } from 'react'
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap'
import { paymentModeData } from '../../common/data/FakeData'
import ErrorHandler from '../../helpers/ErrorHandler';
import { toast } from 'react-toastify';
import EmployeeApiService from '../../helpers/services/employee/EmployeeApiService';

const ProceedToPay = (props: any) => {
    const employeeApiService: EmployeeApiService = new EmployeeApiService();

    const [staff, setStaff] = useState('');
    const [paymentMode, setPaymentMode] = useState('');
    const [monthYear, setMonthYear] = useState<any>('');
    const [paymentAmount, setPaymentAmount] = useState<any>();
    const [documentFile, setDocument] = useState<any>();
    const [chequeNo, setChequeNo] = useState('');
    const [chequeNoValidationError, setChequeNoValidationError] = useState(false);
    const [chequeDate, setChequeDate] = useState('');
    const [chequeDateValidationError, setChequeDateValidationError] = useState(false);
    const [paymentModeValidationError, setPaymentModeValidationError] = useState(false);
    const [paymentDate, setPaymentDate] = useState('');
    const [paymentDateValidationError, setPaymentDateValidationError] = useState(false);
    const [note, setNote] = useState('');
    
    const handleChequeNoChange = (value: any) => {
        setChequeNo(value);
        setChequeNoValidationError(false);
    }

    const handleChequeDateChange = (value: any) => {
        setChequeDate(value);
        setChequeDateValidationError(false);
    }

    const handlePaymentDateChange = (value: any) => {
        setPaymentDate(value);
        setPaymentDateValidationError(false);
    }

    const onFileUploadListener = (event: any) => {
        const file = event.target.files[0];
        setDocument(file);
    }

    const validateForm = () => {
        let isFormValid = true;

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
                paymentMode: paymentMode,
                chequeNo: chequeNo,
                chequeDate: chequeDate,
                payrollDate: paymentDate,
                note: note || 'NA',
            };
            const jsonBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            console.log("JSON.stringify(jsonBlob)", JSON.stringify(payload))
            formData.append('data', jsonBlob);
            formData.append('attachment', documentFile);
            await employeeApiService.proceedToPay(props.id.payrollId, formData);
            props.handleClose();
            toast.success('Payment Details Added Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const viewPaySlip = async () => {
        try {
            let result = await employeeApiService.getPaySlipId(props.id.payrollId);
            console.log("getAllPayroll", result);
            setPayRoleData(result.payroll);
        } catch (error: any) {
            console.log("getAllPayroll Error");
            console.log(error);
            return ErrorHandler(error)
        }
    }

    const setPayRoleData = (data:any) => {
        setStaff(props.id.staffId)
        setPaymentAmount(data.netSalary);
        setMonthYear(`${data.year} - ${data.month}`)
    }

    useEffect(() => {
        viewPaySlip();
    }, []);

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <label className="text-start mb-2">Staff</label>
                            <Input
                                id="Staff"
                                name="Staff"
                                type="text"
                                disabled
                                value={staff}
                                onChange={(e) => setStaff(e.target.value)}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <label className="text-start mb-2">Payment Amount (₹)</label>
                            <Input
                                id="PaymentAmount"
                                name="PaymentAmount"
                                type="text"
                                disabled
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <label className="text-start mb-2">Month Year</label>
                            <Input
                                id="MonthYear"
                                name="MonthYear"
                                type="text"
                                value={monthYear}
                                disabled
                                onChange={(e) => setMonthYear(e.target.value)}
                            />
                        </FormGroup>
                    </Col>
                    <Col sm={6}>
                        <FormGroup>
                            <label className="text-start mb-2">Payment Mode</label>
                            <select
                                className={`${paymentModeValidationError ? 'is-invalid' : ''} form-control`}
                                value={paymentMode}

                                onChange={(e) => { setPaymentMode(e.target.value) }}
                            >
                                <option value="">--Select Payment Mode--</option>
                                {paymentModeData.map((data: any, idx: any) => (
                                    <option key={idx} value={data.type}>{data.type}</option>
                                ))}
                            </select>
                            {paymentModeValidationError && <span className="text-danger">Payment Mode Required</span>}
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
                    <Col md={6}>
                        <FormGroup>
                            <label className="text-start mb-2">Payment Date</label>
                            <Input
                                id="paymentDate"
                                name="paymentDate"
                                type="date"
                                value={paymentDate}
                                onChange={(e) => handlePaymentDateChange(e.target.value)}
                                invalid={!!paymentDateValidationError}
                            />
                            {paymentDateValidationError && <div className="invalid-feedback">Payment Date Required</div>}
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <label className="text-start mb-2">Note</label>
                            <textarea
                                id="note"
                                className='form-control'
                                name="note"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </FormGroup>
                    </Col>
                    <Col>
                        <Button>Save</Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

export default ProceedToPay