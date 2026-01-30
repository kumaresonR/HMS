import { useLocation, useNavigate } from "react-router-dom";
import SetupApiService from "../../../helpers/services/setup/setup-api-service";
import { useEffect, useState } from "react";
import ErrorHandler from "../../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import React from "react";
import FormHeader from "../../../common/FormHeader/FormHeader";
import { IoArrowBack } from "react-icons/io5";

const EditBedType = () => {
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();

    const { state } = useLocation();

    const id = state?.data.bedTypeId;

    const data = state?.data;

    const [name, setName] = useState('');
    const [nameValidationError, setNameValidationError] = useState(false);
    const [modNo, setModNo] = useState<any>('');
    const [modNoValidationError, setModNoValidationError] = useState(false);

    const handleNameChange = (value: any) => {
        setName(value);
        setNameValidationError(false);
    }

    const handleModNoChange = (value: any) => {
        setModNo(value);
        setModNoValidationError(false);
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!name) {
            setNameValidationError(true);
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
            createBedType();
        }
    }
    const createBedType = async () => {
        try {
            const payload: any = {
                // modNo: modNo,
                name: name,
            }
            await setupApiService.editBedType(id, payload);
            navigate('/main/bedMain');
            toast.success('Bed type Details updated Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        if (state?.data) {
            // setModNo(data.modNo);
            setName(data.name);
        }
    }, [state?.data]);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Edit Bed Type" pageTitle="Setup" />
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
                            <Row className="d-flex">
                                <Col>
                                    <Form onSubmit={handleSubmit}>
                                        <Row>
                                            <Col md={12}>
                                                <FormGroup>
                                                    <Label for="name">Name <span className='text-danger'> * </span></Label>
                                                    <Input
                                                        type="text"
                                                        id="name"
                                                        value={name}
                                                        onChange={e => handleNameChange(e.target.value)}
                                                        invalid={!!nameValidationError}
                                                    />
                                                    {nameValidationError && (
                                                        <div className="invalid-feedback">Name Required</div>
                                                    )}
                                                </FormGroup>
                                            </Col>
{/* 
                                            <Col md={12}>
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
                                            <Col className='text-end'>
                                                <Button color="primary" type="submit">Submit</Button>
                                            </Col>
                                        </Row>
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

export default EditBedType;