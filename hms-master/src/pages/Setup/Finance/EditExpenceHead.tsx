import { useEffect, useState } from "react";
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import ErrorHandler from "../../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import SetupApiService from "../../../helpers/services/setup/setup-api-service";
import { useLocation, useNavigate } from "react-router-dom";
import React from "react";
import { IoArrowBack } from "react-icons/io5";
import FormHeader from "../../../common/FormHeader/FormHeader";

const EditExpenceHead = () => {
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();

    const { state } = useLocation();

    const data = state?.data;

    const [expenceHead, setExpenceHead] = useState<any>('');
    const [expenceHeadValidationError, setExpenceHeadValidationError] = useState(false);
    const [description, setDescription] = useState('');
    const [modNo, setModNo] = useState('');
    const [modNoValidationError, setModNoValidationError] = useState(false);

    const handleExpenceHeadChange = (value: any) => {
        setExpenceHead(value);
        setExpenceHeadValidationError(false);
    }

    const handleModNoChange = (value: any) => {
        setModNo(value);
        setModNoValidationError(false);
    }


    const validateForm = () => {
        let isFormValid = true;

        if (!expenceHead) {
            setExpenceHeadValidationError(true);
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
            editExpenseHeads();
        }
    }
    const editExpenseHeads = async () => {
        try {
            const payload = {
                expenseHead: expenceHead,
                description: description || 'NA',
                // modNo: modNo
            }
            await setupApiService.editExpenseHeads(data.id, payload);
            navigate('/main/financeSetup');
            toast.success('Expence Head Updated Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const setData = (data: any) => {
        setExpenceHead(data.expenseHead);
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
                    <FormHeader title="Edit Expence Head" pageTitle="Setup" />
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
                                                    <Label for="expenseHead"> Expense Head  <span className='text-danger'> * </span></Label>
                                                    <Input
                                                        type="text"
                                                        id="expenseHead"
                                                        value={expenceHead}
                                                        invalid={!!expenceHeadValidationError}
                                                        onChange={e => handleExpenceHeadChange(e.target.value)}
                                                    />
                                                    {expenceHeadValidationError && <div className="invalid-feedback">Expense Head  Required</div>}
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

export default EditExpenceHead