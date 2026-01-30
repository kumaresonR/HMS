import { useLocation, useNavigate } from "react-router-dom";
import SetupApiService from "../../../helpers/services/setup/setup-api-service";
import { useEffect, useState } from "react";
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import React from "react";
import { IoArrowBack } from "react-icons/io5";
import { toast } from "react-toastify";
import FormHeader from "../../../common/FormHeader/FormHeader";
import ErrorHandler from "../../../helpers/ErrorHandler";

const EditDosageDuration = () => {
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();

    const { state } = useLocation();

    const data = state?.data;

    const [duration, setDuration] = useState('');
    const [durationValidationError, setDurationValidationError] = useState(false);
    const [modNo, setModNo] = useState<any>('');
    const [modNoValidationError, setModNoValidationError] = useState(false);

    const handleDurationChange = (value: any) => {
        setDuration(value);
        setDurationValidationError(false);
    }

    const handleModNoChange = (value: any) => {
        setModNo(value);
        setModNoValidationError(false);
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!duration) {
            setDurationValidationError(true);
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
                duration: duration,
            }
            await setupApiService.editDoseDuration(data.id, payload);
            navigate('/main/pharmacyMainSetup');
            toast.success('Duration Updated Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        if (state?.data) {
            // setModNo(data.modNo);
            setDuration(data.duration);
        }
    }, [state?.data]);


    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Edit Dosage Duration" pageTitle="Setup" />
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
                            <Row className="d-flex ">
                                <Col xl={12}>
                                    <Form onSubmit={handleSubmit}>
                                        <Row className='align-items-center'>
                                            <Col>
                                                <FormGroup>
                                                    <Label for="duration"> Dosage Duration <span className='text-danger'> * </span></Label>
                                                    <Input
                                                        type="text"
                                                        id="duration"
                                                        value={duration}
                                                        onChange={e => handleDurationChange(e.target.value)}
                                                        invalid={!!durationValidationError}
                                                    />
                                                    {durationValidationError && <div className="invalid-feedback">Dosage Duration  Required</div>}
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
                                            <Button type="submit" color="primary">Update Dosage duration</Button>
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

export default EditDosageDuration;