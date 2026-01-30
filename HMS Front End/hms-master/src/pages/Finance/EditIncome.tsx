import React, { useEffect, useState } from 'react'
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import FormHeader from '../../common/FormHeader/FormHeader';
import ErrorHandler from '../../helpers/ErrorHandler';
import FinanceApiService from '../../helpers/services/finance/finance-api-service';
import SetupApiService from '../../helpers/services/setup/setup-api-service';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { minimizePage } from '../../slices/pageResizer/uiSlice';

const EditIncome = () => {
    const financeApiService: FinanceApiService = new FinanceApiService();
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const { state } = location;

    const id = state?.id || location?.state?.id;

    const [incomeHead, setIncomeHead] = useState('');
    const [name, setName] = useState('')
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [date, setDate] = useState<any>('');
    const [amount, setAmount] = useState<any>('')
    const [description, setDescription] = useState('');
    const [incomeHeadValidationError, setIncomeHeadValidationError] = useState(false)
    const [nameValidationError, setNameValidationError] = useState(false);
    const [dateValidationError, setDateValidationError] = useState(false)
    const [amountValidationError, setAmountValidationError] = useState('');
    const [incomeHeadData, setIncomeHeadData] = useState([]);
    const [selectedFile, setSelectedFile] = useState<any>();
    const data = { incomeHead, name, invoiceNumber, date, amount, description, selectedFile }

    const handleIncomeHeadChange = (value: any) => {
        setIncomeHead(value);
        setIncomeHeadValidationError(false);
    }

    const handleAmountChange = (value: any) => {
        setAmount(value);
        if (!value) {
            setAmountValidationError('Amount is required.');
        } else if (isNaN(value)) {
            setAmountValidationError('Amount must be a number.');
        } else if (parseFloat(value) <= 0) {
            setAmountValidationError('Amount must be greater than zero.');
        } else {
            setAmountValidationError('');
        }
    }

    const handleDateChange = (value: any) => {
        setDate(value);
        setDateValidationError(false);
    }

    const handleNameChange = (value: any) => {
        setName(value);
        setNameValidationError(false);
    }

    const handleFileUpload = (event: any) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const validateForm = () => {
        let isFormValid = true;

        if (!incomeHead) {
            setIncomeHeadValidationError(true);
            isFormValid = false;
        }

        if (!name) {
            setNameValidationError(true);
            isFormValid = false;
        }

        if (!date) {
            setDateValidationError(true);
            isFormValid = false;
        }
        if (!amount) {
            setAmountValidationError("Amount Is Required");
            isFormValid = false;
        } else if (isNaN(amount) || parseFloat(amount) <= 0) {
            setAmountValidationError("Amount must be a positive number.");
            isFormValid = false;
        } else {
            setAmountValidationError("");
        }

        return isFormValid;
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            addBirthRecord();
        }
    }

    const addBirthRecord = async () => {
        try {
            let formData: FormData = new FormData();
            const payload = {
                incomeHead: incomeHead,
                name: name,
                invoiceNumber: invoiceNumber,
                date: date,
                amount: amount,
                description: description
            };
            console.log("Income", payload)
            const jsonBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            formData.append('incomeRecordData', jsonBlob);
            formData.append('attachment', selectedFile);
            await financeApiService.editIncome(id, formData);
            toast.success('Income Updated Successfully', { containerId: 'TR' });
            navigate('/main/income')
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllIncomeHeads = async () => {
        try {
            let result = await setupApiService.getAllIncomeHeads();
            setIncomeHeadData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getIncomeById = async () => {
        try {
            let result = await financeApiService.getIncomeById(id);
            setData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const setData = (data: any) => {
        setIncomeHead(data.incomeHead);
        setName(data.name);
        setInvoiceNumber(data.invoiceNumber);
        setDate(moment(data.date).format('YYYY-MM-DD'));
        setAmount(data.amount);
        setDescription(data.description);
    }

    useEffect(() => {
        getAllIncomeHeads();
    }, []);

    useEffect(() => {
        if (location?.state && Object.keys(location?.state).length > 1) {
            setData(location?.state);
        } else {
            getIncomeById();
        }
    }, [location?.state]);


    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader
                        title="Edit Income"
                        pageTitle="Finance"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "Edit Income",
                            data
                        }))} />
                    <Card>
                        <CardBody>
                            <Row className="d-flex justify-content-center">
                                <Col xl={12}>

                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="mb-0">Edit Income Details</h5>

                                        <Link to="/main/income" className="text-end">
                                            <Button
                                                color="primary"
                                                className="btn btn-primary add-btn"
                                            >
                                                <IoArrowBack /> Back
                                            </Button>
                                        </Link>

                                    </div>
                                    <Form onSubmit={handleSubmit}>
                                        <FormGroup>
                                            <Label for="incomeHead">Income Head</Label>
                                            <Input type="select" id="incomeHead"
                                                value={incomeHead}
                                                onChange={e => handleIncomeHeadChange(e.target.value)}
                                                invalid={!!incomeHeadValidationError}>
                                                <option value="">Select Income Head</option>
                                                {incomeHeadData.map((item: any, idx: any) => (
                                                    <option value={item.incomeHead} key={idx}>{item.incomeHead}</option>
                                                ))}
                                            </Input>
                                            {incomeHeadValidationError && <div className="invalid-feedback">{incomeHeadValidationError}</div>}
                                        </FormGroup>

                                        <FormGroup>
                                            <Label for="name">Name</Label>
                                            <Input type="text"
                                                id="name"
                                                value={name}
                                                onChange={e => handleNameChange(e.target.value)}
                                                invalid={!!nameValidationError}
                                            />
                                            {nameValidationError && <div className="invalid-feedback">Name Required</div>}
                                        </FormGroup>

                                        <FormGroup>
                                            <Label for="invoiceNumber">Invoice Number</Label>
                                            <Input type="text"
                                                id="invoiceNumber"
                                                value={invoiceNumber}
                                                onChange={e => setInvoiceNumber(e.target.value)}
                                            />
                                        </FormGroup>

                                        <FormGroup>
                                            <Label for="date">Date</Label>
                                            <Input type="date"
                                                id="date"
                                                value={date}
                                                onChange={e => handleDateChange(e.target.value)}
                                                invalid={!!dateValidationError}
                                            />
                                            {dateValidationError && <div className="invalid-feedback">Date Required</div>}
                                        </FormGroup>

                                        <FormGroup>
                                            <Label for="amount">Amount</Label>
                                            <Input type="text" id="amount"
                                                value={amount}
                                                onChange={e => handleAmountChange(e.target.value)}
                                                invalid={!!amountValidationError} />
                                            {amountValidationError && <div className="invalid-feedback">{amountValidationError}</div>}
                                        </FormGroup>

                                        <FormGroup>
                                            <Label for="document">Attach Document</Label>
                                            <Input
                                                type="file"
                                                id="document"
                                                onChange={handleFileUpload}
                                            />
                                        </FormGroup>

                                        <FormGroup>
                                            <Label for="description">Description</Label>
                                            <Input type="textarea" id="description"
                                                value={description}
                                                onChange={e => setDescription(e.target.value)}
                                            />
                                        </FormGroup>

                                        <Button type="submit" color="primary">Update Income</Button>
                                    </Form>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default EditIncome