import { Button, Col, Container, Form, FormGroup, Input, Row } from "reactstrap"
import { genderData, birthStatusData } from "../../../../../common/data/IpdData"
import { paymentModeData } from "../../../../../common/data/FakeData"
import { useState } from "react"
import { toast } from "react-toastify"
import IPDApiService from "../../../../../helpers/services/ipd/ipd-api-service"
import ErrorHandler from "../../../../../helpers/ErrorHandler"
import OPDApiService from "../../../../../helpers/services/opd/opd-api-service"

const AddIpdPayment = (props: any) => {
    const iPDApiService: IPDApiService = new IPDApiService();
    const opdApiService: OPDApiService = new OPDApiService();

    const [date, setDate] = useState('');
    const [dateValidationError, setDateValidationError] = useState(false);
    const [amount, setAmount] = useState();
    const [amountValidationError, setAmountValidationError] = useState(false);
    const [paymentMode, setPaymentMode] = useState('');
    const [chequeNo, setChequeNo] = useState('');
    const [chequeNoValidationError, setChequeNoValidationError] = useState(false);
    const [chequeDate, setChequeDate] = useState('');
    const [chequeDateValidationError, setChequeDateValidationError] = useState(false);
    const [note, setNote] = useState('');
    const [documentFile, setDocument] = useState<any>();

    const handleDateChange = (value: any) => {
        setDate(value);
        setDateValidationError(false);
    }

    const handleAmountChange = (value: any) => {
        setAmount(value);
        setAmountValidationError(false);
    }

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

        if (!date) {
            setDateValidationError(true);
            isFormValid = false;
        }

        if (!amount) {
            setAmountValidationError(true);
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
            let payload: any = {
                date: date,
                amount: amount,
                paymentMode: paymentMode,
                chequeNo: chequeNo,
                chequeDate: chequeDate,
                note: note || "NA"
            }
            if (props.title === 'ipd') {
                payload.ipdId = props?.data?.admissions?.ipdId;
            } else {
                payload.opdId = props?.data?.admissions?.opdId;
            }

            const jsonBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });

            formData.append('payment', jsonBlob);
            formData.append('file', documentFile);

            if (props.title === 'ipd') {
                await iPDApiService.createPayment(formData);
            } else {
                await opdApiService.createPayment(formData);
            }
            toast.success('Payment Created Successfully', { containerId: 'TR' });
            props.handleClose();
            props.refresh();
        } catch (error: any) {
            console.log("Payment Created Failed", error);
            return ErrorHandler(error)
        }
    }
    return <>
        <Container fluid>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <label className="text-start mb-2">Date <span className="text-danger">*</span> </label>
                            <Input
                                id="Date"
                                className={`${dateValidationError ? 'is-invalid' : ''}`}
                                name="Date"
                                type="datetime-local"
                                value={date}
                                onChange={e => handleDateChange(e.target.value)}
                            />
                            {dateValidationError && <div className="invalid-feedback">Date Required.</div>}
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <label className="text-start mb-2">Amount (₹)<span className="text-danger">*</span></label>
                            <Input className={`${amountValidationError ? 'is-invalid' : ''}`}
                                id="Amount"
                                name="Amount"
                                type="number"
                                value={amount}
                                onChange={e => handleAmountChange(e.target.value)}
                                onWheel={(e: any) => e.target.blur()}
                                step="any"
                            />
                            {amountValidationError && <div className="invalid-feedback">Amount Required.</div>}
                        </FormGroup>
                    </Col>

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

                    <Col md={12}>
                        <FormGroup>
                            <label className="text-start mb-2">Note</label>
                            <textarea className="form-control"
                                id="Note"
                                name="Note"
                                value={note}
                                onChange={e => setNote(e.target.value)}
                            />
                        </FormGroup>
                    </Col>

                    <Col className="text-end">
                        <Button color="primary">Save</Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    </>
}
export default AddIpdPayment