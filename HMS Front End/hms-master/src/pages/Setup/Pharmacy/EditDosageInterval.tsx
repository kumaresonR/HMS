import { useLocation, useNavigate } from "react-router-dom";
import SetupApiService from "../../../helpers/services/setup/setup-api-service";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ErrorHandler from "../../../helpers/ErrorHandler";
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import React from "react";
import { IoArrowBack } from "react-icons/io5";
import FormHeader from "../../../common/FormHeader/FormHeader";

const EditDosageInterval = () => {
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();

    const { state } = useLocation();

    const data = state?.data;

    const [interval, setInterval] = useState('');
    const [intervalValidationError, setIntervalValidationError] = useState(false);
    const [modNo, setModNo] = useState<any>('');
    const [modNoValidationError, setModNoValidationError] = useState(false);

    const handleIntervalChange = (value: any) => {
        setInterval(value);
        setIntervalValidationError(false);
    }

    const handleModNoChange = (value: any) => {
        setModNo(value);
        setModNoValidationError(false);
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!interval) {
            setIntervalValidationError(true);
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
            createCategory();
        }
    }
    const createCategory = async () => {
        try {
            const payload: any = {
                // modNo: modNo,
                interval: interval,
            }
            await setupApiService.editDoseIntervel(data.id, payload);
            navigate('/main/pharmacyMainSetup');
            toast.success('Interval Updated Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        if (state?.data) {
            // setModNo(data.modNo);
            setInterval(data.interval);
        }
    }, [state?.data]);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Edit Dosage Interval" pageTitle="Setup" />
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
                                        <Row>
                                            <Col>
                                                <FormGroup>
                                                    <Label for="dosageInterval"> Interval <span className='text-danger'> * </span></Label>
                                                    <Input
                                                        type="text"
                                                        id="dosageInterval"
                                                        value={interval}
                                                        onChange={e => handleIntervalChange(e.target.value)}
                                                        invalid={!!intervalValidationError}
                                                    />
                                                    {intervalValidationError && <div className="invalid-feedback">Interval  Required</div>}
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

                                        <Button type="submit" color="primary">Edit Dosage Interval</Button>
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

export default EditDosageInterval;