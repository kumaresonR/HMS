import { useLocation, useNavigate } from "react-router-dom";
import SetupApiService from "../../../helpers/services/setup/setup-api-service";
import { useEffect, useState } from "react";
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import React from "react";
import { IoArrowBack } from "react-icons/io5";
import { toast } from "react-toastify";
import FormHeader from "../../../common/FormHeader/FormHeader";
import ErrorHandler from "../../../helpers/ErrorHandler";

const EditIncomeHead = () => {
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();

    const { state } = useLocation();

    const data = state?.data;

    const [incomeHead, setIncomeHead] = useState<any>('');
    const [incomeHeadValidationError, setIncomeHeadValidationError] = useState(false);
    const [description, setDescription] = useState('');
    const [modNo, setModNo] = useState('');
    const [modNoValidationError, setModNoValidationError] = useState(false);

    const handleIncomeHeadChange = (value: any) => {
        setIncomeHead(value);
        setIncomeHeadValidationError(false);
    }

    const handleModNoChange = (value: any) => {
        setModNo(value);
        setModNoValidationError(false);
    }


    const validateForm = () => {
        let isFormValid = true;

        if (!incomeHead) {
            setIncomeHeadValidationError(true);
            isFormValid = false;
        }

        // if (!modNo) {
        //     setModNoValidationError(true);
        //     isFormValid = false;
        // }

        return isFormValid;
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            editIncomeHeads();
        }
    }
    const editIncomeHeads = async () => {
        try {
            const payload = {
                incomeHead: incomeHead,
                description: description || 'NA',
                // modNo: modNo
            }
            await setupApiService.editIncomeHeads(data.id, payload);
            navigate('/main/financeSetup');
            toast.success('Income Head Updated Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const setData = (data: any) => {
        setIncomeHead(data.incomeHead);
        setDescription(data.description);
        // setModNo(data.modNo);
    }

    useEffect(() => {
        if (state?.data) {
            setData(data);
        }
    }, [state?.data]);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Edit Income Head" pageTitle="Setup" />
                    <Card>
                        <CardBody>
                            <div className='text-end'>
                                <Button
                                    color="primary"
                                    onClick={() => navigate(-1)}
                                    className="btn btn-primary add-btn mx-2"
                                >
                                    <IoArrowBack /> Back
                                </Button>
                            </div>
                            <Row className="d-flex justify-content-center">
                                <Col xl={12}>
                                    <Form onSubmit={handleSubmit}>
                                        <Row className='align-items-center'>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="incomeHead"> Income Head  <span className='text-danger'> * </span></Label>
                                                    <Input
                                                        type="text"
                                                        id="incomeHead"
                                                        value={incomeHead}
                                                        invalid={!!incomeHeadValidationError}
                                                        onChange={e => handleIncomeHeadChange(e.target.value)}
                                                    />
                                                    {incomeHead && <div className="invalid-feedback">Income Head  Required</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="description"> Description  </Label>
                                                    <Input
                                                        className={`form-control`}
                                                        type="text"
                                                        id="description"
                                                        value={description}
                                                        onChange={e => setDescription(e.target.value)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            {/* <Col>
                                                <FormGroup>
                                                    <Label for="name">Version <span className='text-danger'> * </span></Label>
                                                    <Input
                                                        type="text"
                                                        id="name"
                                                        value={modNo}
                                                        onChange={e => handleModNoChange(e.target.value)}
                                                        invalid={!!modNoValidationError}
                                                    />
                                                    {modNoValidationError && (
                                                        <div className="invalid-feedback">Version Required</div>
                                                    )}
                                                </FormGroup>
                                            </Col> */}
                                        </Row>

                                        <Col className='text-end'>
                                            <Button type="submit" color="primary">Submit</Button>
                                        </Col>
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

export default EditIncomeHead