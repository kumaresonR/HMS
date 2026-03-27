import React, { useState } from "react";
import { Row, Col, Label, FormGroup, Input, Button, Form, Table } from "reactstrap";
import { paymentModeData } from "../../common/data/FakeData";
import BillingApiService from "../../helpers/services/billing/billing-api-service";
import ErrorHandler from "../../helpers/ErrorHandler";
import { toast } from "react-toastify";

const RadiologyPayments = (props: any) => {
    const billingApiService: BillingApiService = new BillingApiService();

    const data = props.data;
    const [paymentMode, setPaymentMode] = useState('');
    const [paymentAmount, setPaymentAmount] = useState<any>(props.data.balanceAmount);
    const [paymentAmountValidationError, setPaymentAmountValidationError] = useState(false);
    const [date, setDate] = useState('');
    const [dateValidationError, setDateValidationError] = useState(false);
    const [documentFile, setDocument] = useState<any>();
    const [chequeNo, setChequeNo] = useState('');
    const [chequeNoValidationError, setChequeNoValidationError] = useState(false);
    const [chequeDate, setChequeDate] = useState('');
    const [chequeDateValidationError, setChequeDateValidationError] = useState(false);
    const [note, setNote] = useState('');

    const handleDateChange = (value: any) => {
        setDate(value);
        setDateValidationError(false);
    }

    const handlePaymentAmountChange = (value: any) => {
        const numericValue = parseFloat(value) || 0;
        setPaymentAmount(value);

        if (numericValue > props.data.balanceAmount) {
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

    const validateForm = () => {
        let isFormValid = true;

        if (!paymentAmount || parseFloat(paymentAmount) > props.data.balanceAmount) {
            setPaymentAmountValidationError(true);
            isFormValid = false;
        }

        if (!date) {
            setDateValidationError(true);
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
            doUpdate();
        }
    }
    const doUpdate = async () => {
        try {
            let formData: FormData = new FormData();
            const payload: any = {
                patientId: props.data.patientId,
                hospitalDoctor: props.data.hospitalDoctor,
                caseId: props.data.caseId,
                prescriptionNo: props.data.prescriptionNo,
                doctorName: props.data.doctorName,
                note: note,
                totalAmount: props.data.totalAmount,
                discount: props.data.discount,
                tax: props.data.tax,
                netAmount: props.data.netAmount,
                paymentMode: paymentMode,
                paymentAmount: paymentAmount,
                chequeNo: chequeNo,
                chequeDate: chequeDate,
            };
            const jsonBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            console.log("JSON.stringify(jsonBlob)", payload)
            formData.append('billData', jsonBlob);
            formData.append('photo', documentFile);
            if (props.title === 'radiology') {
                await billingApiService.editRadiologyBill(props.data.billId, formData);
            } else {
                await billingApiService.editPathologyBill(props.data.billId, formData);
            }
            toast.success('Payment Added Successfully', { containerId: 'TR' });
            props.handleClose();
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    return (
        <React.Fragment>
            <Row>
                <Col md={12}>
                    <Row>
                        <Col>
                            <Table className="noBorderTable">
                                <tbody>
                                    <tr>
                                        <td className="text-primary"><strong>Bill No</strong></td>
                                        <td>{data.billId}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>OPD/IPD ID</strong></td>
                                        <td>{data.ipdOrOpdId || 'NA'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Patient</strong></td>
                                        <td>{data?.patientDetails?.firstName} {data?.patientDetails?.lastName} ({data.patientId})</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Doctor Name</strong></td>
                                        <td>{data.doctorName}</td>
                                    </tr>
                                    {/* <tr>
                                        <td><strong>Generated By</strong></td>
                                        <td>Super Admin (9001)</td>
                                    </tr> */}
                                    <tr>
                                        <td><strong>Age</strong></td>
                                        <td>{data?.patientDetails?.age}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Gender</strong></td>
                                        <td>{data?.patientDetails?.gender}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Blood Group</strong></td>
                                        <td>{data?.patientDetails?.bloodType}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Mobile</strong></td>
                                        <td>{data?.patientDetails?.contactNumber}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Email</strong></td>
                                        <td>{data?.patientDetails?.email || 'NA'}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Col>
                        <Col>
                            <Table className="noBorderTable">
                                <tbody>
                                    <tr>
                                        <td><strong>Address</strong></td>
                                        <td>: {data?.patientDetails?.address}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>TPA</strong></td>
                                        <td>: {data?.patientDetails?.tpa || 'NA'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>TPA ID</strong></td>
                                        <td>: {data?.patientDetails?.tpaId || 'NA'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>TPA Validity</strong></td>
                                        <td>: {data?.patientDetails?.tpaValidity || 'NA'}</td>
                                    </tr>

                                    <tr>
                                        <td  ><strong>Total (₹)</strong></td>
                                        <td  >{data.totalAmount}</td>
                                    </tr>
                                    <tr>
                                        <td  ><strong>Discount Percentage (%)</strong></td>
                                        <td  >{data.discount} %</td>
                                    </tr>
                                    <tr>
                                        <td  ><strong>Tax (₹)</strong></td>
                                        <td  >{data.tax}</td>
                                    </tr>
                                    <tr>
                                        <td  ><strong>Net Amount (₹)</strong></td>
                                        <td  >{data.netAmount}</td>
                                    </tr>
                                    <tr>
                                        <td  ><strong>Paid Amount (₹)</strong></td>
                                        <td  >{data.paymentAmount}</td>
                                    </tr>
                                    <tr>
                                        <td  ><strong>Due Amount (₹)</strong></td>
                                        <td  >{data.balanceAmount}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={4}>

                                <FormGroup>
                                    <label className="text-start mb-2">Date <span className="text-danger">*</span></label>
                                    <Input
                                        className={`${dateValidationError ? 'is-invalid' : ''}`}
                                        type="datetime-local"
                                        id="date"
                                        value={date}
                                        onChange={e => handleDateChange(e.target.value)}
                                    />
                                    {dateValidationError && <div className="invalid-feedback">Date Required.</div>}
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <label className="text-start mb-2">Amount  <span className="text-danger">*</span></label>
                                    <Input
                                        className={`${paymentAmountValidationError ? 'is-invalid' : ''}`}
                                        type="number"
                                        id="paymentAmount"
                                        value={paymentAmount}
                                        onChange={e => handlePaymentAmountChange(e.target.value)}
                                    />
                                    {paymentAmountValidationError && (
                                        <div className="invalid-feedback">
                                            {paymentAmount > props.data.balanceAmount
                                                ? 'Amount cannot be greater than Balance Amount.'
                                                : 'Payment Amount is required.'}
                                        </div>
                                    )}
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
                        </Row>
                        {paymentMode === "Cheque" && (
                            <Row>
                                <Col md={6}>
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
                                <Col md={6}>
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
                                <Col md={6}>
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
                        <FormGroup>
                            <label className="text-start mb-2">Note</label>
                            <textarea className="form-control"
                                id="note"
                                name="note"
                                value={note}
                                onChange={e => setNote(e.target.value)}
                            />
                        </FormGroup>
                        <Col className="text-end my-3">
                            <Button type="submit" color="primary" disabled={props.data.balanceAmount <= 0}>Submit</Button>
                        </Col>

                    </Form>
                </Col>
            </Row>
        </React.Fragment>
    )
}

export default RadiologyPayments