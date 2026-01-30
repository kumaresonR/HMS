import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { Button, Col, Container, Form, FormGroup, Input, Row, Table } from 'reactstrap';
import { paymentModeData } from '../../common/data/FakeData';
import ErrorHandler from '../../helpers/ErrorHandler';
import AmbulanceApiService from '../../helpers/services/ambulance/ambulance-api-service';
import TransactionHistoryDataTable from '../Pharmacy/TransactionHistoryDataTable';

const AddAmbulancePayment = (props: any) => {
    const ambulanceApiService: AmbulanceApiService = new AmbulanceApiService();

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
                date: date,
                paymentMode: paymentMode,
                checkNo: chequeNo,
                checkDate: chequeDate,
                attachment: documentFile,
                paymentAmount: paymentAmount,
            };
            const jsonBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            console.log("JSON.stringify(jsonBlob)", payload)
            formData.append('transaction', jsonBlob);
            formData.append('file', documentFile);
            await ambulanceApiService.addAmbulancePayment(data.vehicleChargeId, formData);
            toast.success('Payment Added Successfully', { containerId: 'TR' });
            props.handleClose();
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    return (
        <React.Fragment>
            <Container fluid>
                <Row>
                    <Col md={12}>
                        <Row>
                            <Col>
                                <Table className="noBorderTable">
                                    <tbody>
                                        <tr>
                                            <td className="text-primary"><strong>Bill No</strong></td>
                                            <td>{data.billId || 'NA'}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Received To</strong></td>
                                            <td>{data.patientId || 'NA'}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Vehicle Number</strong></td>
                                            <td>{data.vehicleNumber || 'NA'}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Vehicle Model</strong></td>
                                            <td>{data.vehicleModel}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Driver Name</strong></td>
                                            <td>{data.driverName || 'NA'}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Driver Contact</strong></td>
                                            <td>{data.driverContact || 'NA'}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Date</strong></td>
                                            <td>{data.date || 'NA'}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Patient Address	</strong></td>
                                            <td>{data.address || 'NA'}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                            <Col>
                                <Table className="noBorderTable">
                                    <tbody>
                                        <tr>
                                            <td><strong>Total (₹)</strong></td>
                                            <td>{data.total}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Discount Percentage ({data.discountPercentage}%)</strong></td>
                                            <td> ₹ {data.discountAmount} </td>
                                        </tr>
                                        <tr>
                                            <td><strong>Tax ({data.taxPercentage}%)</strong></td>
                                            <td>₹ {data.taxAmount}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Net Amount (₹)</strong></td>
                                            <td>{data.netAmount}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Paid Amount (₹)</strong></td>
                                            <td>{data.transactions[0]?.paymentAmount || 'NA'}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Due Amount (₹)</strong></td>
                                            <td>{data.balanceAmount}</td>
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
                <Row>
                    <TransactionHistoryDataTable data={data.transactions} />
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default AddAmbulancePayment