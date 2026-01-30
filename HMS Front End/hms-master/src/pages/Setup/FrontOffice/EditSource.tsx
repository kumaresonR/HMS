import React, { useState, useEffect } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import FormHeader from "../../../common/FormHeader/FormHeader";
import ErrorHandler from "../../../helpers/ErrorHandler";
import SetupApiService from "../../../helpers/services/setup/setup-api-service";

const EditSource = () => {
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();

    const { state } = useLocation();

    const data = state?.data;

    const [source, setSource] = useState('');
    const [sourceValidationError, setSourceValidationError] = useState(false);
    const [description, setDescription] = useState('');
    const [modNo, setModNo] = useState('');
    const [modNoValidationError, setModNoValidationError] = useState(false);

    const handleSourceChange = (value: any) => {
        setSource(value);
        setSourceValidationError(false);
    }

    const handleModNoChange = (value: any) => {
        setModNo(value);
        setModNoValidationError(false);
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!source) {
            setSourceValidationError(true);
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
            editComplainType();
        }
    }
    const editComplainType = async () => {
        try {
            const payload: any = {
                // modNo: modNo,
                source: source,
                description : description
            };
            await setupApiService.editSource(data.id, payload);
            navigate('/main/frontofficeMain');
            toast.success('Source Updated Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        if (state?.data) {
            // setModNo(data.modNo);
            setSource(data.source);
            setDescription(data.description);
        }
    }, [state?.data]);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Edit Source" pageTitle="Setup" />
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
                                                    <Label for="source"> Source  <span className='text-danger'> * </span></Label>
                                                    <Input
                                                        type="text"
                                                        id="source"
                                                        value={source}
                                                        onChange={e => handleSourceChange(e.target.value)}
                                                        invalid={!!sourceValidationError}
                                                    />
                                                    {sourceValidationError && <div className="invalid-feedback">Source  Required</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="description"> Description  </Label>
                                                    <textarea
                                                        className={`form-control`}
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

export default EditSource;