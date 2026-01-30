import React, { useState,  useEffect } from 'react';
import { Label, Input, Button, Form, FormGroup, Card, Col, Container, Row, CardBody } from 'reactstrap';
import FormHeader from '../../common/FormHeader/FormHeader';
import { IoArrowBack } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import { patientTypeData } from '../../common/data/FakeData';
import ReferralApiService from '../../helpers/services/referral/referral-api-service';
import ErrorHandler from '../../helpers/ErrorHandler';
import { toast } from 'react-toastify';

const AddReferralPayment = () => {

    const referralApiService: ReferralApiService = new ReferralApiService();
    let navigate: any = useNavigate();

    const [patientId, setPatientId] = useState('');
    const [patientType, setPatientType] = useState("");
    const [patientTypeValidationError, setPatientTypeValidationError] = useState(false);
    const [billNo, setBillNo] = useState("");
    const [billNoValidationError, setBillNoValidationError] = useState(false);
    const [billAmount, setBillAmount] = useState("");
    const [billAmountValidationError, setBillAmountValidationError] = useState(false);
    const [payee, setPayee] = useState("");
    const [payeeValidationError, setPayeeValidationError] = useState(false);
    const [commissionPercentage, setCommissionPercentage] = useState('');
    const [commissionPercentageValidationError, setCommissionPercentageValidationError] = useState(false);
    const [commissionAmount, setCommissionAmount] = useState('');
    const [commissionAmountValidationError, setCommissionAmountValidationError] = useState(false);
    const [referralData, setReferralData] = useState([]);

    const handlePatientData = (value: any) => {
        setPatientType(value);
        setPatientTypeValidationError(false);
    }

    const handleBillNoChange = (value: any) => {
        setBillNo(value);
        setBillNoValidationError(false);
    }

    const handleBillAmountChange = (value: any) => {
        setBillAmount(value);
        setBillAmountValidationError(false);
    }

    const handlePayeeChange = (value: any) => {
        setPayee(value);
        setPayeeValidationError(false);
    }

    const handlePrecentageChange = (value: any) => {
        setCommissionPercentage(value);
        setCommissionPercentageValidationError(false);
    }

    const handleCommissionAmountChange = (value: any) => {
        setCommissionAmount(value);
        setCommissionAmountValidationError(false);
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!patientType) {
            setPatientTypeValidationError(true);
            isFormValid = false;
        }

        if (!billNo) {
            setBillNoValidationError(true);
            isFormValid = false;
        }

        if (!billAmount) {
            setBillAmountValidationError(true);
            isFormValid = false;
        }

        if (!payee) {
            setPayeeValidationError(true);
            isFormValid = false;
        }

        if (!commissionPercentage) {
            setCommissionPercentageValidationError(true);
            isFormValid = false;
        }

        if (!commissionAmount) {
            setCommissionAmountValidationError(true);
            isFormValid = false;
        }

        return isFormValid;
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            //     addReferralPerson();
        }
    };

    const addReferralPerson = async () => {
        try {
            const payload = {
                patientType: patientType,
                billNo: billNo,
                patientBillAmount: billAmount,
                payee: payee,
                commissionPercentage: commissionPercentage,
                commissionAmount: commissionAmount,
                patientId: patientId
            };
            await referralApiService.createReferralPerson(payload);
            toast.success("Referral Person Added Successfully", { containerId: "TR" });
            navigate("/main/referralPersonList");
        } catch (error: any) {
            return ErrorHandler(error);
        }
    };

    const getAllReferralPerson = async () => {
        try {
            let result = await referralApiService.getAllReferralPerson();
            setReferralData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllReferralPerson();
    }, []);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Add Referral Payment" pageTitle="Setup" />
                    <Card>
                        <CardBody>
                            <Row className="d-flex justify-content-center">

                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="mb-0">Add Refferal Payment</h5>

                                    <Link to="/main/referralPaymentList" className="text-end">
                                        <Button
                                            color="primary"
                                            className="btn btn-primary add-btn"
                                        >
                                            <IoArrowBack /> Back
                                        </Button>
                                    </Link>
                                </div>
                                <Col xl={12}>
                                    <Form onSubmit={handleSubmit}>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="patientType">Patient Type <span className='text-danger'>*</span></Label>
                                                    <Input type="select" id="patientType"
                                                        value={patientType}
                                                        onChange={e => handlePatientData(e.target.value)}
                                                        invalid={!!patientTypeValidationError}>
                                                        <option value="">Select Patient Type</option>
                                                        {patientTypeData.map((item: any, idx: any) => (
                                                            <option value={item.type}>{item.type}</option>
                                                        ))}
                                                    </Input>
                                                    {patientTypeValidationError && <div className="invalid-feedback">Patient Type Required</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="billNo">Bill No/Case Id <span className='text-danger'>*</span></Label>
                                                    <Input type="select"
                                                        id="billNo"
                                                        value={billNo}
                                                        onChange={e => handleBillNoChange(e.target.value)}
                                                        invalid={!!billNoValidationError}
                                                    >
                                                        <option value="">Select Bill No/Case Id</option>
                                                        <option value="OPD00019">OPD00019</option>
                                                    </Input>
                                                    {billNoValidationError && <div className="invalid-feedback">Bill No/Case Id Required</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="patientBillAmount">Patient Bill Amount <span className='text-danger'>*</span></Label>
                                                    <Input type="text"
                                                        id="patientBillAmount"
                                                        value={billAmount}
                                                        onChange={e => handleBillAmountChange(e.target.value)}
                                                        invalid={!!billAmountValidationError}
                                                    />
                                                    {billAmountValidationError && <div className="invalid-feedback">Patient Bill Amount Required</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="payee">Payee <span className='text-danger'>*</span></Label>
                                                    <Input type="select"
                                                        id="payee"
                                                        value={payee}
                                                        onChange={e => handlePayeeChange(e.target.value)}
                                                        invalid={!!payeeValidationError}>
                                                        <option value="">Select Payee</option>
                                                        {referralData.map((item:any,idx:any) => (
                                                            <option key={idx} value={item.referrerName}>{item.referrerName}</option>
                                                        ))}
                                                    </Input>
                                                    {payeeValidationError && <div className="invalid-feedback">Payee Required</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="commissionPercentage">Commission Percentage (%) <span className='text-danger'>*</span></Label>
                                                    <Input type="text"
                                                        id="commissionPercentage"
                                                        value={commissionPercentage}
                                                        onChange={e => handlePrecentageChange(e.target.value)}
                                                        invalid={!!commissionPercentageValidationError}
                                                    />
                                                    {commissionPercentageValidationError && <div className="invalid-feedback">Commission Percentage Required</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="commissionAmount">Commission Amount <span className='text-danger'>*</span></Label>
                                                    <Input type="text"
                                                        id="commissionAmount"
                                                        value={commissionAmount}
                                                        onChange={e => handleCommissionAmountChange(e.target.value)}
                                                        invalid={!!commissionAmountValidationError}
                                                    />
                                                    {commissionAmountValidationError && <div className="invalid-feedback">Commission Amount Required</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Button type="submit" color="primary">Submit</Button>
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

export default AddReferralPayment;
