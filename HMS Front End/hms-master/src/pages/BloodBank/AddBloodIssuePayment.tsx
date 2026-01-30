import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import { paymentModeData } from '../../common/data/FakeData';
import ErrorHandler from '../../helpers/ErrorHandler';
import BloodBankApiService from '../../helpers/services/bloodBank/BloodBankApiService';
import CalculateAge from '../../Components/Common/CalculateAge';

const AddBloodIssuePayment = (props: any) => {
    const bloodBankApiService: BloodBankApiService = new BloodBankApiService();

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
                issueBloodId: props.data.issueBloodId,
                patientId: props.data.patientId,
                hospitalDoctor: props.data.hospitalDoctor,
                issueDate: props.data.issueDate,
                caseId: props.data.caseId,
                referenceName: props.data.referenceName,
                technician: props.data.technician,
                bloodGroup: props.data.bloodGroup,
                bloodQty: props.data.bloodQty,
                bag: props.data.bag,
                chargeCategory: props.data.chargeCategory,
                chargeName: props.data.chargeName,
                standardCharge: props.data.standardCharge,
                note: note || 'NA',
                total: props.data.totalAmount,
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
            formData.append('bloodData', jsonBlob);
            formData.append('attachment', documentFile);
            await bloodBankApiService.editBloodIssue(props.data.issueBloodId, formData);
            toast.success('Payment Added Successfully', { containerId: 'TR' });
            props.handleClose();
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    return (
        <React.Fragment>
            <Row>
                <Col md={8}>
                    <Row>
                        <Col>
                            {/* <Row>
                                <Col><Label>Bill No	</Label></Col>
                                <Col><Label>: {data.issueComponentId}</Label></Col>
                            </Row> */}
                            <Row>
                                <Col><Label>IPD/OPD ID	</Label></Col>
                                <Col><Label>: {data.ipdOrOpdId || 'NA'}</Label></Col>
                            </Row>
                            <Row>
                                <Col><Label>Patient</Label></Col>
                                <Col><Label>: {data.patientDetails?.firstName} {data.patientDetails?.lastName} ({data.patientId})</Label></Col>
                            </Row>
                            <Row>
                                <Col><Label>Doctor Name	</Label></Col>
                                <Col><Label>: {data.hospitalDoctor}</Label></Col>
                            </Row>
                            {/* <Row>
                                <Col><Label>Generated By</Label></Col>
                                <Col><Label>: Super Admin (9001)</Label></Col>
                            </Row> */}
                            <Row>
                                <Col><Label>Age</Label></Col>
                                <Col><Label>: <CalculateAge dateOfBirth={data?.patientDetails?.dateOfBirth} /> </Label></Col>
                            </Row>
                            <Row>
                                <Col><Label>Gender</Label></Col>
                                <Col><Label>: {data.patientDetails?.gender || 'NA'}</Label></Col>
                            </Row>
                            <Row>
                                <Col><Label>Blood Group	</Label></Col>
                                <Col><Label>: {data.patientDetails?.bloodType || 'NA'}</Label></Col>
                            </Row>
                            <Row>
                                <Col><Label>Mobile</Label></Col>
                                <Col><Label>: {data.patientDetails?.contactNumber || 'NA'}</Label></Col>
                            </Row>
                            <Row>
                                <Col><Label>Email</Label></Col>
                                <Col><Label>: {data.patientDetails?.email || 'NA'}</Label></Col>
                            </Row>
                            <Row>
                                <Col><Label>Address</Label></Col>
                                <Col><Label>: {data.patientDetails?.address || 'NA'}</Label></Col>
                            </Row>
                            <Row>
                                <Col><Label>TPA</Label></Col>
                                <Col><Label>: {data.tpa || 'NA'}</Label></Col>
                            </Row>
                            <Row>
                                <Col><Label>TPA ID	</Label></Col>
                                <Col><Label>: NA</Label></Col>
                            </Row>
                            <Row>
                                <Col><Label>TPA Validity</Label></Col>
                                <Col><Label>: NA</Label></Col>
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <Col className="text-end"><Label>Total (₹)</Label></Col>
                                <Col className="text-end"><Label>{data.total}</Label></Col>
                            </Row>
                            <Row>
                                <Col className="text-end"><Label>Discount (₹)	</Label></Col>
                                <Col className="text-end"><Label>{data.discount} </Label></Col>
                            </Row>
                            <Row>
                                <Col className="text-end"><Label>Tax (₹)	</Label></Col>
                                <Col className="text-end"><Label>{data.tax}</Label></Col>
                            </Row>
                            <Row>
                                <Col className="text-end"><Label>Net Amount (₹)	</Label></Col>
                                <Col className="text-end"><Label>{data.netAmount}</Label></Col>
                            </Row>
                            <Row>
                                <Col className="text-end"><Label>Paid Amount (₹)</Label></Col>
                                <Col className="text-end"><Label>{data.paymentAmount}</Label></Col>
                            </Row>
                            <Row>
                                <Col className="text-end"><Label>Due Amount (₹)</Label></Col>
                                <Col className="text-end"><Label>{data.balanceAmount}</Label></Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col md={4}>
                    <Form onSubmit={handleSubmit}>
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
                        <FormGroup>
                            <label className="text-start mb-2">Amount (₹) <span className="text-danger">*</span></label>
                            <Input
                                className={`${paymentAmountValidationError ? 'is-invalid' : ''}`}
                                type="number"
                                id="paymentAmount"
                                value={paymentAmount}
                                onChange={e => handlePaymentAmountChange(e.target.value)}
                                onWheel={(e: any) => e.target.blur()}
                                step="any"
                            />
                            {paymentAmountValidationError && (
                                <div className="invalid-feedback">
                                    {paymentAmount > props.data.balanceAmount
                                        ? 'Amount cannot be greater than Balance Amount.'
                                        : 'Payment Amount is required.'}
                                </div>
                            )}
                        </FormGroup>
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
                                <Col>
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
                                <Col>
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
                {/* <TransactionHistoryDataTable /> */}
            </Row>
        </React.Fragment>
    )
}

export default AddBloodIssuePayment