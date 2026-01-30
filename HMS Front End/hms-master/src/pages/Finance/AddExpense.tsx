import React, { useState, useEffect } from 'react';
import { Label, Input, Button, Form, FormGroup, Card, Col, Container, Row, CardBody } from 'reactstrap';
import FormHeader from '../../common/FormHeader/FormHeader';
import { IoArrowBack } from 'react-icons/io5';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FinanceApiService from '../../helpers/services/finance/finance-api-service';
import ErrorHandler from '../../helpers/ErrorHandler';
import { toast } from 'react-toastify';
import SetupApiService from '../../helpers/services/setup/setup-api-service';
import { useDispatch } from 'react-redux';
import { minimizePage } from '../../slices/pageResizer/uiSlice';

const AddExpense = () => {
    const financeApiService: FinanceApiService = new FinanceApiService();
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
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
    const [expenceHeadData, setExpenceHeadData] = useState([]);
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
            addExpenseRecord();
        }
    }

    const addExpenseRecord = async () => {
        try {
            let formData: FormData = new FormData();
            const payload = {
                expenseHead: incomeHead,
                name: name,
                invoiceNumber: invoiceNumber,
                date: date,
                amount: amount,
                description: description
            };
            console.log("Expence", payload)
            const jsonBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            formData.append('expenseData', jsonBlob);
            formData.append('attachment', selectedFile);
            await financeApiService.createExpenceRecord(formData);
            toast.success('Expence Added Successfully', { containerId: 'TR' });
            navigate('/main/expense')
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllExpenseHeads = async () => {
        try {
            let result = await setupApiService.getAllExpenseHeads();
            setExpenceHeadData(result);
        } catch (error: any) {
            console.log(error);
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllExpenseHeads();
    }, []);

    useEffect(() => {
        if (location?.state) {
            setIncomeHead(location?.state?.incomeHead);
            setName(location?.state?.name);
            setInvoiceNumber(location?.state?.invoiceNumber);
            setDate(location?.state?.date);
            setAmount(location?.state?.amount);
            setDescription(location?.state?.description);
            setSelectedFile(location?.state?.selectedFile);
        }
    }, [location?.state]);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Add Expense"
                        pageTitle="Finance"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "Add Expense",
                            data
                        }))} />
                    <Card>
                        <CardBody>
                            <Row className="d-flex justify-content-center">
                                <Col xl={12}>

                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="mb-0">Add Expense Details</h5>

                                        <Link to="/main/expense" className="text-end">
                                            <Button
                                                color="primary"
                                                className="btn btn-primary add-btn"
                                            >
                                                <IoArrowBack /> Back
                                            </Button>
                                        </Link>


                                    </div>
                                    <Form onSubmit={handleSubmit}>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="expenseHead">Expense Head</Label>
                                                    <Input type="select" id="expenseHead" value={incomeHead}
                                                        onChange={e => handleIncomeHeadChange(e.target.value)}
                                                        invalid={!!incomeHeadValidationError}
                                                    >
                                                        <option value="">Select Expense Head</option>
                                                        {expenceHeadData.map((item: any, idx: any) => (
                                                            <option value={item.expenseHead} key={idx}>{item.expenseHead}</option>
                                                        ))}
                                                    </Input>
                                                    {incomeHeadValidationError && <div className="invalid-feedback">Expense Head Required</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
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
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="invoiceNumber">Invoice Number</Label>
                                                    <Input type="text"
                                                        id="invoiceNumber"
                                                        value={invoiceNumber}
                                                        onChange={e => setInvoiceNumber(e.target.value)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
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
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="amount">Amount</Label>
                                                    <Input type="text" id="amount"
                                                        value={amount}
                                                        onChange={e => handleAmountChange(e.target.value)}
                                                        invalid={!!amountValidationError} />
                                                    {amountValidationError && <div className="invalid-feedback">{amountValidationError}</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="document">Attach Document</Label>
                                                    <Input
                                                        type="file"
                                                        id="document"
                                                        onChange={handleFileUpload}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={12}>
                                                <FormGroup>
                                                    <Label for="description">Description</Label>
                                                    <Input type="textarea" id="description"
                                                        value={description}
                                                        onChange={e => setDescription(e.target.value)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Button type="submit" color="primary">Add Expense</Button>
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

export default AddExpense;
