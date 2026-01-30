import React, { useState,  } from 'react';
import { Label, Input, Button, Form, FormGroup, Col, Row } from 'reactstrap';
import { paymentModeData } from '../../common/data/FakeData';
import ErrorHandler from '../../helpers/ErrorHandler';
import { toast } from 'react-toastify';
import PharmacyApiService from '../../helpers/services/pharmacy/pharmacy-api-service';
const PaymentForm = (props: any) => {
    const pharmacyApiService: PharmacyApiService = new PharmacyApiService();

    const [netAmount, setNetAmount] = useState<any>(0);
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
            doCreatePayment();
        }
    }
    const doCreatePayment = async () => {
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
                medicines: props.data.medicines
            };
            // Convert JSON payload to Blob with application/json type
            const jsonBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            console.log("JSON.stringify(jsonBlob)",payload)
            formData.append('medicineData', jsonBlob);
            formData.append('photo', documentFile);
            await pharmacyApiService.editPharmacyBill(props.data.billId,formData);
            toast.success('Payment Added Successfully', { containerId: 'TR' });
            props.handleClose();
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    return (
        <React.Fragment>
            <Row className="d-flex justify-content-center pb-4">
                <Col xl={12}>
                    <Form onSubmit={handleSubmit}>

                        <Row className='mb-2'>
                            <Col md={6}>
                                <label className="text-start mb-2">Date <span className="text-danger">*</span></label>
                                <Input
                                    className={`${dateValidationError ? 'is-invalid' : ''}`}
                                    type="datetime-local"
                                    id="date"
                                    value={date}
                                    onChange={e => handleDateChange(e.target.value)}
                                />
                                {dateValidationError && <div className="invalid-feedback">Date Required.</div>}
                            </Col>
                            <Col md={6}>
                                <label className="text-start mb-2">Amount <span className="text-danger">*</span></label>
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
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
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

                        <Row>
                            <Col md={6}>
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
                        <Button type="submit" color="primary" disabled={props.data.balanceAmount <= 0}>Submit</Button>
                    </Form>
                </Col>
            </Row>

        </React.Fragment>
    );
};

export default PaymentForm;
